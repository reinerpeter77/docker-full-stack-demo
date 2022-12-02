package Helper;

import java.io.IOException;
import java.net.Socket;
import java.util.regex.*;

public class ConnectTestThread extends Thread {
    public String serverAndPort;
    ConnectTestThread(String serverAndPort) {
        this.serverAndPort = serverAndPort;
    }
    @Override
    public void run() {
        try {
            connTest(serverAndPort);
        } catch (IOException e) {
           // gets here 30 seconds later regardless. Cant stop this thread!
           // System.out.println("IOException in thread");
        }

    }
    @Override
    public void interrupt() {
        // does nothing because still cant stop connection.
        System.out.println("ConnectTestThread interrupted");
    }
    static void connTest(String serverAndPort) 
        throws IOException {
        Matcher mat = Pattern.compile("(.*)\\:(.*)").matcher(serverAndPort);
        mat.find();
        String dbSrv = mat.group(1);
        String dbPort = mat.group(2);
        // throws exception if fails
        // takes 30 seconds to timeout
        Socket zz = new Socket(dbSrv, Integer.parseInt(dbPort));
    }

    static String OKserverAndPort = "";

    static void quickSocketTestToAvoid30SecondTimeout(String serverAndPort) 
        throws Exception {
        if (OKserverAndPort.equals(serverAndPort)) return; // in past was OK, so dont try again 
        Thread thd = new ConnectTestThread(serverAndPort);
        thd.start();
        synchronized(thd) {
            try {
                thd.join(1000);
                if (thd.isAlive()) { 
                    // thd.interrupt(); 
                    throw new InterruptedException(); 
                } else {
                    // assume connection was successful
                    OKserverAndPort = ((ConnectTestThread)thd).serverAndPort;
                }
            } catch (InterruptedException iex) { 
                System.out.println("timeout on conn");
                throw new Exception();
            }
        }
    }
}
