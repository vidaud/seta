# SeTA *Semantic Text Analyser*

**SeTA** (“Semantic Text Analyser”) is a tool that offers a search functionality in large document collections. Upon providing a keyword, a set of keywords, or a piece of text, the tool will indicate a list of documents, and locations therein, where the keyword(s) occur. The search is enhanced beyond merely finding the keywords literally, first by the use of a taxonomy (that structures pre-defined keywords) and second by semantic interpretation of the keywords (that uses the meaning of the words in addition to their literal form). The search results can, as next step, be easily screened and filtered by the user with the help of the tool.       

SeTA is accessed via a web user interface, and also allows the use of APIs for automated access.        
SeTA furthermore offers community spaces for groups of users to collaborate on joint tasks and document collections.      


## General Overview 

This project is made up of two modules:
* The **frontend** 
* The **flask-server** one. 

**Seta-frontend** is a *React* standard workspace enabled application.  
**Seta-middleware** is a standard `maven-archetype-webapp` 
**Seta-flask-server** is a Flask application 

The frontend module contains all the static resources that make up the UI business logic  \
The middleware module contains all the java sources and acts as a proxy / integration layer towards the backend. \
The flask-server module contains all the python sources and acts as a proxy / authentication layer towards the backend.  


All static resources that come from `ng build seta-web -c=<environment>` of the frontend module are copied inside the flask-server **seta-ui** folder's module.  
The end result is a ***seta-flask-server*** folder that contains a Flask application that can be deployed on any web container.  
Flask configurations files are:
 - seta-flask-server/config.py
 - seta-flask-server/.env
 
 React configuration files are:
 - package.json



## Deployment
 
### Minimum Requirements

* At least 10 GB available free RAM.

* 16 GB (32 GB preferred) RAM, 100 GB free space HDD or SSD (preferred).

* Good Internet speed. You will need to download at least 5GB (> 20GB for all data)

The following setup and deployment guidelines are  for ^^Production^^ environment.


### Prerequisites 

- It is necessary to install [Git](https://git-scm.com/downloads). 

- Install Docker compose V2.  [*Click for reference to install in Linux, Mac or Windows*](https://docs.docker.com/compose/install/)



### Installation of the project

**Git clone**

From the Git interface use the git **clone** command to clone the project in the select directory, using an SSH link.
```
    git clone https://github.com/vidaud/seta.git
```

After cloning the project, we open a command line shell and move to the root directory of the project:

>Make sure that you are in the root directory of the project, use **pwd** or **cd** for windows

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
     # Set-up of the administrators emails, the system create local users. There should be always at least one admin user defined always. It cannot be empty.    
    ROOT_USERS="ROOT_USERS="email@emailDomain"
```

### Models

Another important setup is the models file, they keep the necessary information to created the related suggestions, and the related terms of the words in the text provided. 

Download the file  **json_suggestion.json** from From the following repository link:

[https://jeodpp.jrc.ec.europa.eu/ftp/jrc-opendata/D4P-Cellar-dump/json_suggestion.json](https://jeodpp.jrc.ec.europa.eu/ftp/jrc-opendata/D4P-Cellar-dump/json_suggestion.json) 


and copy into folder **./seta-data/models/**   


### Build

After this, if we have moved, we go back to folder **seta-compose** and from there we launch the build command: 

```
     docker compose build
```    

This command creates a docker image based on the Dockerfile called by default **docker-compose.yml** as the configuration file and **.env** as the environment file.   


### Up

After finishing the build, launch the command to start and run the services:

```
    docker compose seta-data up
    docker compose seta-ui seta-nginx up
```     



> Is recommended to start in **detach mode (-d)** as this allows the docker container to run in the background of your terminal. Furthermore, using detached mode also allows you to close the opened terminal session without stopping the container.    


> **Notes:**
  
> - This commands will setup all system and data.
> - It will take a while depending on the Internet speed. Might take 30min to 2h.
> - At some point there will be a message *"SeTA-API is up and running."*     




After successfully start all the containers, you are ready to open your browser and go to one of the following links:

* **User Web App:** [[location] /](/)

* **SETA API:** [[location] /seta-api/doc](/seta-api/doc)

* **SETA API Communities:** [[location] /seta-ui/api/v1/communities/doc](/seta-ui/api/v1/communities/doc)

* **Documentation:** [[location] /docs](/docs)




## Stopping commands

### To stop services 
```
    CTRL + C
```

### Stop services started in detach mode

```
    docker compose down
```

## Development environment

To deploy in the Development environment:

Create an ***.env.dev*** file containing the variables as described in  file **.env.example** and then you can launch the build and up commands:

```
    docker compose -f docker-compose-dev.yml build
    docker compose -f docker-compose-dev.yml up
    docker compose seta-data up
    docker compose seta-ui seta-nginx up
```


## Test environment
To deploy in a Test environment:

Create an ***.env.test*** file containing the variables as described in *.env.example* and then you can launch the build and up commands:

```
    docker compose -f docker compose-test.yml build
    docker compose -f docker compose-test.yml up
```


## Starting commands


Here below more commands that will help you to build and start the services in the different environments.


### To (re-)build all images (production, test and development environment)

```
    docker compose -f docker-compose.yml -f docker-compose-dev.yml -f docker compose-test.yml --env-file .env.dev .env.test build
```

### To (re-)build only seta-ui image (production, test and development environment)

```
    docker compose -f docker-compose.yml -f docker-compose-dev.yml -f docker compose-test.yml --env-file .env.dev .env.test seta-ui
```

### Start all services for your environment locally

```
    docker compose -f docker-compose.yml -f docker-compose-dev.yml -f docker compose-test.yml --env-file .env.dev .env.test up
```

### Start all services for your environment locally in detached mode

```
    docker compose -f docker-compose.yml -f docker-compose-dev.yml --f docker compose-test.yml --env-file .env.dev .env.test up -d
```

### Rebuild and restart seta-ui services while other services are runing

```
    docker compose -f docker-compose.yml -f docker-compose-dev.yml -f docker compose-test.yml --env-file .env.dev .env.test up --force-recreate --build --no-deps seta-ui
```

## Shell scripts

For the scripts with short commands: 
```
    docker compose -f docker-compose.yml -f docker-compose-dev.yml --env-file .env.dev
```

 It can be used a *.bat* file where it can be set up all the neccesary functions, as well as the set up of the proxy.  
 
 
 Here below an example:

 **build.bat**
 
 
 ```
    docker compose -f docker-compose.yml -f docker-compose-dev.yml --env-file .env.dev build %*
 ```

 **up.bat**
 ```

    docker compose -f docker-compose.yml -f docker-compose-dev.yml --env-file .env.dev up %*

 ```
 
 
 Here below the example of how to execute this bat files in {++Windows++} and {++Linux++}.

### **Windows**

Open a *cmd* window and from there go to the *seta-compose* folder, for example, if we want to run for *development* environment the build and up:

```
    dev-build.bat
    dev-up.bat
```

From now, any argument for the docker compose *build* or *up* commands will be appended in the batch scripts.

For example:

```
    dev-build.bath --no-cache
```

### **Linux**

For execute permissions run:

```
    chmod +x ./dev-build.sh
    chmod +x ./dev-up.sh
```

Run for development build and up:

```
    ./dev-build.sh
    ./dev-up.sh
```

Any arguments for the docker compose *build* or *up* commands will be appended in the shell scripts.

For example:

```
    ./dev-build.sh --no-cache
```


## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.



## License
Copyright (c) 2023 European Union      
Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the European Commission – subsequent versions of the EUPL (the "Licence");     

You may not use this work except in compliance with the Licence.      


You may obtain a copy of the Licence at:      


https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12       
 
Unless required by applicable law or agreed to in writing, software distributed under the Licence is distributed on an "AS IS" basis, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.             
 
See the Licence for the specific language governing permissions and limitations under the Licence.