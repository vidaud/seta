# Minimum Requirements

* At least 10 GB available free RAM.

* 16 GB (32 GB preferred) RAM, 100 GB free space HDD or SSD (preferred).

* Good Internet speed. You will need to download at least 5GB (> 20GB for all data)

The following setup and deployment guidelines are  for ^^Production^^ environment.

## Prerequisites 

- It is necessary to install [Git](https://git-scm.com/downloads). 

- Install Docker compose V2.  [*Click for reference to install in Linux, Mac or Windows*](https://docs.docker.com/compose/install/)

## Installation of the project

### Git clone

From the Git interface use the git **clone** command to clone the project in the select directory, using an SSH link.
```
    git clone https://github.com/vidaud/seta.git
```

After cloning the project, we open a command line shell and move to the root directory of the project:

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
    # Set-up of the administrators emails, the system creates local users.     
    There should be always at least one admin user defined always. It cannot be empty.         
        
    ROOT_USERS="ROOT_USERS="email@emailDomain"


```



### Models

Another important setup is the models file, they keep the necessary information to create the related suggestions, and the related terms of the words in the text provided. 

Download the file  **json_suggestion.json** from the following repository link:

[https://jeodpp.jrc.ec.europa.eu/ftp/jrc-opendata/D4P-Cellar-dump/json_suggestion.json](https://jeodpp.jrc.ec.europa.eu/ftp/jrc-opendata/D4P-Cellar-dump/json_suggestion.json) 


and copy into folder **./seta-data/models/**

### Build

If we have moved, we go back to folder **seta-compose** and from there we launch the build command: 

```
     docker compose build
```    

This command creates a docker image based on the Docker file called by default **docker-compose.yml** as the configuration file and **.env** as the environment file.

### Up
After finishing the build, launch the command to start and run the services:

First the service to initialise the Elasticsearch :

```
    docker compose up seta-data     

```    

In order to be sure that the start of service seta-data finishes correctly there must be a message like: 

> data exited with code 0


Later we start the rest of the services, for now is just necessary to start the seta-nginx as the other services are attached to start together with this service:     

```
    docker compose up seta-nginx -d
```

!!! info
    Is recommended to start in *detach mode (-d)* as this allows the docker container to run in the background of your terminal. Furthermore, using detached mode also allows you to close the opened terminal session without stopping the container.



This command will setup all system and data.

It will take a while depending on the Internet speed. Might take 30min to 2h.

At some point there will be a message **SeTA-API is up and running**


After successfully start all the containers, you are ready to open your browser and go to one of the following links:

* **User Web App:** [[location] /](/)

* **SETA API:** [[location] /seta-api/doc](/seta-api/doc)

* **SETA API Communities:** [[location] /seta-ui/api/v1/communities/doc](/seta-ui/api/v1/communities/doc)

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
