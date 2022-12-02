package Helper;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.StringReader;
import java.net.InetSocketAddress;
import java.net.Socket;
import java.net.UnknownHostException;
import java.nio.file.Files;
import java.nio.file.NoSuchFileException;
import java.nio.file.Paths;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.Calendar;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.naming.CommunicationException;
import javax.swing.text.Style;
import javax.xml.XMLConstants;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.w3c.dom.Document;

public class CloudHelper {
    public static final String ANSI_RESET = "\u001B[0m";
    public static final String ANSI_BLACK = "\u001B[30m";
    public static final String ANSI_RED = "\u001B[31m";
    public static final String ANSI_GREEN = "\u001B[32m";
    public static final String ANSI_YELLOW = "\u001B[33m";
    public static final String ANSI_BLUE = "\u001B[34m";
    public static final String ANSI_PURPLE = "\u001B[35m";
    public static final String ANSI_CYAN = "\u001B[36m";
    public static final String ANSI_WHITE = "\u001B[37m";

    public static String[] getArrayOfSecrets(String secretsFileName, String xmlTagInFile)
          throws Exception {
		String secret = "";
		try {
            String secretsString = CloudHelper.getDockerSecretFileContent(secretsFileName);
            if (secretsString == null) return null;
			secret = CloudHelper.readTagFromXml(secretsString, xmlTagInFile);
		} catch (Exception e) {
			// System.out.println( 
			//	Thread.currentThread().getStackTrace()[1].getMethodName() + "()" + e);
			throw(e);
		}
		String[] list = secret.split("\\s*,\\s*"); // trims whitespace foreach
		return list;
	}

    public static String getDockerSecretFileContent(String nameOfSecret) throws Exception {
        String theSecret = null;
        /* WARNING: on linux, vi editor appends newline (\n). Be sure to trim() */
        // below is the path in a docker container where docker puts secrets files
        String secretFilePath = "/run/secrets/" + nameOfSecret;
        try {
            theSecret = new String(Files.readAllBytes(Paths.get(secretFilePath)));
            System.out.println("*** " + Thread.currentThread().getStackTrace()[1].getMethodName() + "() :" +
               "found secret file in /run/secrets");
        } catch (NoSuchFileException ex) {
            // getting docker secrets file failed. 
            // Maybe its not running in docker but running in the dev machine 
            // in visual studio code or in a linux shell using java.exe
            // if this is the case go directly to the secrets file in the local filesystem.
            String secretFilePath2 = "../../../secrets/docker/" + nameOfSecret + ".secret";
            // System.out.println("*** " + Thread.currentThread().getStackTrace()[1].getMethodName() + "()\n" + 
            //    "   file.b.: " + secretFilePath + " not found. Assuming (dev ide), not docker \n" +
            //    "   retrying new local fs path \"" + secretFilePath2 + "\"");
            try {
                theSecret = new String(Files.readAllBytes(Paths.get(secretFilePath2)));
                System.out.println("*** " + Thread.currentThread().getStackTrace()[1].getMethodName() + "() :" +
                   "found secret file in ../../../secrets/docker/");
            } catch (NoSuchFileException ex2) {
                // System.out.println(Thread.currentThread().getStackTrace()[1].getMethodName() + "()" + 
                // " file: " + secretFilePath2 + " not found");
                System.out.println("*** " + Thread.currentThread().getStackTrace()[1].getMethodName() + "() :" +
                  " failed to find secret file. Throwing back to caller which will hardcode value.");
                throw ex2;
            }
        }
        return theSecret.trim();
    }

    static class DuplicateXmlTagNameException extends Exception {
        public DuplicateXmlTagNameException(String msg) { super(msg); }
    }

    public static String readTagFromXml(String textIn, String tag) throws Exception {
        DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
        String tagValue = "";
        try {
            dbf.setFeature(XMLConstants.FEATURE_SECURE_PROCESSING, true);
            DocumentBuilder db = dbf.newDocumentBuilder();
            Document doc = db.parse(new ByteArrayInputStream(textIn.getBytes()));
            if (doc.getDocumentElement().getElementsByTagName(tag).getLength() > 1)
                throw new DuplicateXmlTagNameException("duplicate tag name in xml");
            tagValue = doc.getDocumentElement().getElementsByTagName(tag).item(0).getTextContent();
        } catch (DuplicateXmlTagNameException e) {
            System.out.println("*** ERROR: " + Thread.currentThread().getStackTrace()[1].getMethodName() + "()" +
              "duplicate xml tag " + tag + ". No duplicates allowed.");
            throw e;
        } catch (Exception e) {
            System.out.println(Thread.currentThread().getStackTrace()[1].getMethodName() + "()" +
                  "Exception: " + e);
            throw e;
        } 
        return tagValue.trim();
    }

    public static String readTagFromSecretsFileRegex(String textIn, String tag) {
        // warning: does not really parse xml, so tag can only appear once!
        // s/.*<dbUrl>\(.*\)<\/dbUrl>.*/\1/p "s/.*<dbUrl>\\(.*\\)<\\/dbUrl>.*/\\1/p"
        Matcher matcher = Pattern.compile(".*<dbUrl>(.*)</dbUrl>.*").matcher(textIn);
        matcher.find();
        String tagValue = matcher.group(1);
        return tagValue;
    }

    
    
    static Connection getConn(String dbUrlDockerContainer, String dbUrlNotDockerContainer, 
             String dbUserName, String dbUserPasswdSecret) throws Exception {
        Connection con;
        try {
            // WARNING: this is a quick db connection check to avoid 30 second timeout during development
            // It throws exception of the address and port are not openable
            // It uses threads and may wreak havoc in a production environment.
            ConnectTestThread.quickSocketTestToAvoid30SecondTimeout(dbUrlDockerContainer);
            // throws exception of connection cant be made
            con = DriverManager.getConnection(
                "jdbc:mysql://" + dbUrlDockerContainer + "/" + dbUserName + "?characterEncoding=latin1", 
                dbUserName,  dbUserPasswdSecret);
            System.out.println("got db conn using dbUrlDockerContainer tag using docker secrets");
        } catch (Exception ce) {
            System.out.println("failed db conn using dbUrlDockerContainer from docker secrets, trying dbUrlNotDockerContainer");
            // usually localhost when running on ide
            ConnectTestThread.quickSocketTestToAvoid30SecondTimeout(dbUrlNotDockerContainer);
            con = DriverManager.getConnection(
                "jdbc:mysql://" + dbUrlNotDockerContainer + "/" + dbUserName + "?characterEncoding=latin1",
                dbUserName,  dbUserPasswdSecret);
        }
        return con;
    }

    public static String testDB() throws Exception {
        try {
            String dbRes = ""; 
            System.out.println("....testing db");
            Class.forName("com.mysql.jdbc.Driver");
            // to avoid error "Unknown initial character set index '255' received from
            // server" add ?characterEncoding=latin1
            // test connection: curl -v telnet://xx.xx.xx.xx:3306 --output -
            String passwdSecretName = "mysqlPasswd";
            String dbUserPasswdSecret = getDockerSecretFileContent(passwdSecretName);
            String dbUserName = "dbUser2";
            Connection con;
            System.out.println(Thread.currentThread().getStackTrace()[1].getMethodName() + 
              "(): obtaining db conn creds from secrets file");
            String textIn = getDockerSecretFileContent("dbUrl");
            String dbUrlDockerContainer = readTagFromXml(textIn, "dbUrlDockerContainer");
            String dbUrlNotDockerContainer = readTagFromXml(textIn, "dbUrlNotDockerContainer");
            //System.out.println("THIS SHOULD NOT BE IN A LOG!: dbUrl: >>" + dbUrl + "<< user: >>" + dbUserName  +
            //    "<< dbUserPasswdSecret >>" + dbUserPasswdSecret + "<<");
            Statement stmt = null;
            int beforeTime2 = Calendar.getInstance().get(Calendar.MILLISECOND);  
            con = getConn(dbUrlDockerContainer, dbUrlNotDockerContainer, dbUserName, dbUserPasswdSecret);
            stmt = con.createStatement();
            // works ok: "jdbc:mysql://dbServiceA/dbUser2?characterEncoding=latin1", "dbUser2", secret);
            // "jdbc:mysql://dbServiceA/test1db?characterEncoding=latin1", "dbUser2", secret);
            ResultSet rs = stmt.executeQuery("select * from carmakers");
            while (rs.next())
                dbRes += " CloudHelper: " + rs.getString(1) + "  " + rs.getString(2);
            con.close();
            dbRes += "\ndb-access-seconds: " + (float)(Calendar.getInstance().get(Calendar.MILLISECOND) - beforeTime2)/1000 ;
            return dbRes;
        } catch (Exception ce) {
            String msg = ("ERROR " + Thread.currentThread().getStackTrace()[1].getMethodName() + "()\n" +
            "   db connection error: " + ce + 
            "\n   Maybe test schema not created 'Scripts/DatabaseCreateTestUserAndTable.sh'" +
            "\n   Maybe you're running in local ide but need to start only the database in docker?" +
            "\n    ie: docker-compose -f docker-compose-fullstackWithProfiles.yml --profile dbOnly up -d");
            msg += ("\nThe cause may arise when switching code from local ide to docker container");
            return "<xmp>" + msg + "</xmp>"; // yup, xmp does \n newlines in browser too.
        } 
    }
}

// Resource resource = new FileSystemResource(dockerSecretInContainer);
// if (resource.exists()) {
// theSecret = StreamUtils.copyToString(resource.getInputStream(),
// Charset.defaultCharset());
// Properties props = new Properties();
// props.put("spring.datasource.password", theSecret);
// environment.getPropertySources().addLast(new
// PropertiesPropertySource("dbProps", props));
// } else {
