
# this script uses docker (NOT docker-compose) commands to
# rebuild docker container after a gradle build.
# It is a brute-force method and 
# It is not as good as the script RestartWebA in upper folder which
# keeps the instance alive, but copies the new jar file into it and
# restarts the instance.
#
# sudo docker stop $(docker ps -aq)
# sudo docker exec -it spA bash
# sudo docker exec -it spA ls
sudo docker stop spA
sudo docker rm spA
# ./gradlew build
# do a clean then a build. Good for rebuilding jar regardless of src date
./gradlew clean build
sudo docker image rm spboot_img 
sudo docker build -t spboot_img -f DockerfileA .
sudo docker run --name spA -p 80:8080 -d spboot_img 
# ls src/main/java/com/example/springboot/HelloController.java 
# vi !!:1

# ssh -i "awsKeyPair2.pem" ubuntu@xx.xx.xx.xx 'cd spboot-nginx-reactjs-compose && ./RestartWebA'
