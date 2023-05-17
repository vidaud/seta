# seta-compose ⚙️

# Minimum requirements
  
* at least 10 GB available free RAM.

* 16 GB (32 GB preferred) RAM, 100 GB free space HDD or SSD (preferred).

* good Internet speed. You will need to download at least 5GB (> 20GB for all data)


To setup the implementation follow these instructions:

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

## Models

Another important setup is the models file, they keep the necessary information to create the related suggestions, and the related terms of the words in the text provided. 

Download the file  **json_suggestion.json** from the following repository link:

[https://jeodpp.jrc.ec.europa.eu/ftp/jrc-opendata/D4P-Cellar-dump/json_suggestion.json](https://jeodpp.jrc.ec.europa.eu/ftp/jrc-opendata/D4P-Cellar-dump/json_suggestion.json) 


and copy into folder **./seta-data/models/**

## Build

If we have moved, we go back to folder **seta-compose** and from there we launch the build command: 

```
     docker compose build
```    

This command creates a docker image based on the Docker file called by default **docker-compose.yml** as the configuration file and **.env** as the environment file.

## Up
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


> Is recommended to start in *detach mode (-d)* as this allows the docker container to run in the background of your terminal. Furthermore, using detached mode also allows you to close the opened terminal session without stopping the container.


**Notes:**

This command will setup all system and data.

It will take a while depending on the Internet speed. Might take 30min to 2h.

At some point there will be a message **SeTA-API is up and running**


After successfully start all the containers you are ready to open your browser and go to one of the following links:

* **User Web App:** [[location] /](/)

* **SETA API:** [[location] /seta-api/doc](/seta-api/doc)

* **SETA API Communities:** [[location] /api/communities/v1/doc](/api/communities/v1/doc)

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

Create an ***.env.test*** file containing the variables as described in **.env.example** and then you can launch the build and up commands:

```
    docker compose -f docker compose-test.yml build
    docker compose -f docker compose-test.yml up
    docker compose seta-data up
    docker compose seta-ui seta-nginx up
```


To create scripts with short commands like this:

```
    docker compose -f docker-compose.yml -f docker-compose-dev.yml --env-file .env.dev
```

 It can be used a *.bat* file where it can be set up all the neccesary functions, as well as the set up of the proxy.  
 
 
 Here below an example:

 **build.bat**:
 
 
 ```
    docker compose -f docker-compose.yml -f docker-compose-dev.yml --env-file .env.dev build %*
 ```


 **up.bat**:
 ```

    docker compose -f docker-compose.yml -f docker-compose-dev.yml --env-file .env.dev up %*

 ```
 
 
 Here below the example of how to execute this bat files in **Windows** and **Linux**.

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


