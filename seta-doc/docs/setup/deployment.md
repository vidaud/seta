# Minimum Requirements

* At least 10 GB available free RAM.

* 16 GB (32 GB preferred) RAM, 100 GB free space HDD or SSD (preferred).

* Good Internet speed. You will need to download at least 5GB (> 20GB for all data)


## Prerequisites 

- It is neccesary to install [Git](https://git-scm.com/downloads). 

- Install [Docker compose V2](https://docs.docker.com/compose/install/).*For reference to install in Linux, Maco or Windows*



## Installation of the project

### Git clone

Use the git **clone** command to clone the project in the select directory, using an SSH link.
```
    git clone https://github.com/vidaud/seta.git
```

After clonning the project, move to the directory of the project:

!!! warning
    Make sure that you are in the root directory of the project, use **pwd** or **cd** for windows

```
    cd [project folder]
```

### Docker setup

From the root folder move to folder **seta-compose**: 

```
    cd ./seta-compose
```    

Follow these instructions:

In the **common.yml** file make sure in service **es** the memory limit in var mem_limit is 4g

```
    es:
        restart: always
        build:
        context: ../seta-es
        args:
            - HTTP_PROXY=${HTTP_PROXY}
            - HTTPS_PROXY=${HTTPS_PROXY}
        expose:
        - "9200"
        - "9300"
        mem_limit: "4g"
        environment:
        - NO_PROXY=${NO_PROXY}
        - no_proxy=${NO_PROXY}
        - xpack.security.enabled=false
        - discovery.type=single-node
        - xpack.security.http.ssl.enabled=false
        - xpack.security.transport.ssl.enabled=false
        - ingest.geoip.downloader.enabled=false
```

In the ***.env*** file change the necessary information, where is required, for the variables:


```
    # http and https proxies, --blank for none--
    HTTP_PROXY="http://proxyusername:proxypwd@proxyaddress:proxyport"
    HTTPS_PROXY="http://proxyusername:proxypwd@proxyaddress:proxyport"


    # set-up of no proxy control for docker containers 
    NO_PROXY="seta-es,seta-data,seta-mongo,seta-api,seta-nginx,seta-ui,seta-ui-react,seta-auth"


    ##### Seta-UI variables  ####
    # Set-up of the administrators emails, the system create local users. There should be always at least one admin user defined always. It cannot be empty.    ROOT_USERS="ROOT_USERS="email@emailDomain"
```



### Models

Another important setup is the models file, they keep the necessary information to created the related suggestions, and the related terms of the words in the text provided. 

Download the file  **json_suggestion.json** from From the following repository link:

[https://jeodpp.jrc.ec.europa.eu/ftp/jrc-opendata/D4P-Cellar-dump/json_suggestion.json](https://jeodpp.jrc.ec.europa.eu/ftp/jrc-opendata/D4P-Cellar-dump/json_suggestion.json) 


and copy into folder **./seta-data/models/**

### Build

If we have moved, we go back to folder **seta-compose** and from there we launch the build command: 

```
     docker-compose build
```    

This command creates a docker image based on the Dockerfile called by default **docker-compose.yml** as the configuration file and **.env** as the environment file.

### Up

After finishing the build, launch the command to start and run the services:

```
    docker-compose seta-data up
    docker-compose seta-ui seta-nginx up
```

!!! info
    Is recommended to start in *detach mode (-d)* as this allows the docker container to run in the background of your terminal. Furthermore, using detached mode also allows you to close the opened terminal session without stopping the container.



!!! note "Notes:"
  
    This commands will setup all system and data.

    It will take a while depending on the Internet speed. Might take 30min to 2h.

    At some point there will be a message *"SeTA-API is up and running."*


After successfully start all the containers you are ready to open your browser and go to one of the following links:

* **User Web App:** [[location] /](/)

* **API:** [[location] /seta-api/doc](/seta-api/doc)

* **Documentation:** [[location] /docs](/docs)



### Stopping commands

#### To stop services 
```
    CTRL + C
```

#### Stop services started in detach mode

```
    docker compose down
```

## Starting commands


Here below more commands that will help you to build and start the services.


#### To (re-)build all images

```
    docker compose -f docker-compose.yml --env-file build
```

#### To (re-)build only seta-ui image (Web App interface)

```
    docker compose -f docker-compose.yml --env-file  seta-ui
```

#### Start all services for your environment locally

```
    docker compose -f docker-compose.yml --env-file up
```

#### Start all services for your environment locally in detached mode

```
    docker compose -f docker-compose.yml --env-file up -d
```

#### Rebuild and restart seta-ui services while other services are runing

```
    docker compose -f docker-compose.yml --env-file up --force-recreate --build --no-deps seta-ui
```
