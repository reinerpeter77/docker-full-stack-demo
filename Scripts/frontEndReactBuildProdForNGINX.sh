
# script to build production react.js by having container do it.
# docker-compose -f docker-compose-frontend.yml down
# docker-compose -f docker-compose-frontend.yml up -d
# now run build INSIDE CONTAINER. The built file appear in the hosts (shared) build folder.
# NOTE: on cloud instance node, npm are not installed but they are
#    always in container bc of dockerfile.
docker-compose -f docker-compose-frontend.yml exec reactA npm run-script build
docker-compose -f docker-compose-frontend.yml logs reactA
# docker-compose -f docker-compose-frontend.yml logs nginxA
echo To login to container:
echo docker-compose -f docker-compose-frontend.yml exec reactA sh

 
