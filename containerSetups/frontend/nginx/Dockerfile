
# FROM nginx:alpine
FROM nginx:1.19.6
# this dockerfile starts with an alpine linux image loaded with nginx.
# It then copies config files and content into the new image.
#!/bin/sh

# nginx in this container is controlled by this file.
# First copy it to the docker host from the container using:
# sudo docker exec nginxA cat /etc/nginx/conf.d/default.conf
# Then, customize it. The following copies it back to the container
# when docker build happens.
COPY default.conf /etc/nginx/conf.d/default.conf
RUN touch BBBBBBBBBBBBBBBB
# sudo docker exec nginxA ls
# copy other files if needed -> COPY zzhtml zzhtml

# note: address translation occurs in docker run or in docker-compose.yml
EXPOSE 80/tcp
# this starts it up.
ENTRYPOINT ["nginx", "-g", "daemon off;"]
