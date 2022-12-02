
# run this at top level
sudo docker-compose -f docker-compose-toplevel.yml -f docker-compose-backend.yml exec dbServiceA /dbscripts/createUserAndTable
