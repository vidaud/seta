## Setup

    cd ./seta-compose-test
    docker-compose build
    docker-compose up

It will setup all system and data.\
It will take a while depending on the Internet speed.\
Might take 30min to 2h.\
At some point there will be a message *"SeTA-API is up and running."*

The build of seta-ui-spa container will need about 10 minutes to complete and see the result in the output folder\ 
**'seta-ui\seta-flask-server\seta-ui'**

After that you are ready to open your browser and start typing:  
* **for UI:** http://localhost/seta-ui
* **for API:** http://localhost/seta-api/doc

## To stop services:
    CTRL + C

and it will stop gracefully. If you started in detached mode (**'docker-compose up -d'** ) you can stop services with **docker-compose down**

## Requirements 

The minimum requirements are:
* At least 10GB available free RAM.
* 16 GR (32GB preferred) RAM, 100GB free space HDD or SSD (preferred).
* Good Internet speed. You will need to download at least 5GB (> 20GB for all data)

The first run will take time. The next run will be fast.

### (re-)build all images
    docker-compose -f docker-compose.yml build

### (re-)build only seta-ui image
    docker-compose -f docker-compose.yml build seta-ui

### Start all services for your environment locally
    docker-compose -f docker-compose.yml  up

### Start all services for your environment locally in detached mode
    docker-compose -f docker-compose.yml  up -d

### (re-)build and restart seta-ui services while other services are runing
    docker-compose -f docker-compose.yml --force-recreate --build --no-deps seta-ui