# Minimum Requirements

* At least 10 GB available free RAM.

* 16 GB (32 GB preferred) RAM, 100 GB free space HDD or SSD (preferred).

* Good Internet speed. You will need to download at least 5GB (> 20GB for all data)


## Prerequisites 

- It is neccesary to have a GitHub account [https://github.com/](https://github.com/) to download the project. 

Use the git **clone** command to clone the project in the select directory, using an SSH link.
    ```
        git clone https://github.com/vidaud/seta.git
    ```


- Install **Docker compose V2**.  *For reference to install in Linux, Maco or Windows:* [https://docs.docker.com/compose/install/](https://docs.docker.com/compose/install/)



## Installation of the project

After clonning the project, move to the directory of the project:

*make sure that you are in the root directory of the project, use" pwd" or "cd" for windows*

```
    cd [project folder]
```

### Docker compose

From the root folder move to folder **seta-compose**: 

```
    cd ./seta-compose
```    

Follow these instructions:

In the ***.env*** file change the necessary information, where is required, for the variables:  

```
# http and https proxies, --blank for none--
HTTP_PROXY="http://proxyusername:proxypwd@proxyaddress:proxyport"
HTTPS_PROXY="http://proxyusername:proxypwd@proxyaddress:proxyport"


# set-up of no proxy control for docker containers 
NO_PROXY="seta-es,seta-data,seta-mongo,seta-api,seta-nginx,seta-ui,seta-ui-react,seta-auth"


##### Seta-UI variables  ####
# Set-up of the administrators emails, the system create local users, if no user found it is create it.
ROOT_USERS="ROOT_USERS="email@emailDomain"
```

### Models

Before building, it is neccesary to setup the models file which keeps the related suggestions of the words in the text provided. 



{++From repository XXXX download file json_suggestion.json and copy into folder ./seta-data/models/++}

### Build

After this, if we have moved, we go back to folder **seta-compose** and from there we launch the build command: 

```
     docker-compose build
```    

This command creates a docker image based on the Dockerfile called by default **docker-compose.yml** as the configuration file and *.env* as the environment file.

### Compose

After finishing the build, launch the command to start and run the services:

```
    docker-compose up -d
```

In this case is recommended to start in detach mode as this allows the docker container to run in the background of your terminal. Furthermore, using detached mode also allows you to close the opened terminal session without stopping the container.

???+ note "Notes:"
  
    This commands will setup all system and data.

    It will take a while depending on the Internet speed. Might take 30min to 2h.

    At some point there will be a message *"SeTA-API is up and running."*


After successfully start all the containers you are ready to open your browser and start typing:

* **User Web App:** [/](/)

* **API:** [/seta-api/doc](/seta-api/doc)

* **Documentation:** [/docs](/docs)

### Stopping commands

#### To stop services 
```
    CTRL + C
```

#### Stop services started in detach mode

```
    docker compose down
```

## Development environment

To deploy in the Development environment:

Create an ***.env.dev*** file containing the variables as described in  file **.env.example** and then you can launh the build and up commands:

```
    docker compose -f docker-compose-dev.yml build
    docker compose -f docker-compose-dev.yml up
```


## Test environment

Create an ***.env.test*** file containing the variables as described in *.env.example* and then you can launh the build and up commands:

```
    docker compose -f docker-compose-test.yml build
    docker compose -f docker-compose-test.yml up
```


## Starting commands

#### To (re-)build all images (production, test and development environment)

```
    docker compose -f docker-compose.yml -f docker-compose-dev.yml -f docker-compose-test.yml --env-file .env.dev .env.test build
```

#### To (re-)build only seta-ui image (production, test and development environment)

```
    docker compose -f docker-compose.yml -f docker-compose-dev.yml -f docker-compose-test.yml --env-file .env.dev .env.test seta-ui
```

#### Start all services for your environment locally

```
    docker compose -f docker-compose.yml -f docker-compose-dev.yml -f docker-compose-test.yml --env-file .env.dev .env.test up
```

#### Start all services for your environment locally in detached mode

```
    docker compose -f docker-compose.yml -f docker-compose-dev.yml --f docker-compose-test.yml --env-file .env.dev .env.test up -d
```

#### Rebuild and restart seta-ui services while other services are runing

```
    docker compose -f docker-compose.yml -f docker-compose-dev.yml -f docker-compose-test.yml --env-file .env.dev .env.test up --force-recreate --build --no-deps seta-ui
```

#### Shell scripts

For the scripts with short commands: 
```
    docker compose -f docker-compose.yml -f docker-compose-dev.yml --env-file .env.dev
```

 It can be used a .bat file where it can be set up all the neccesary functions, as well as the set up of the proxy.  Here below an example:

 **build.bat**
 ```
    docker compose -f docker-compose.yml -f docker-compose-dev.yml --env-file .env.dev build %*
 ```

 **up.bat**
 ```

    docker compose -f docker-compose.yml -f docker-compose-dev.yml --env-file .env.dev up %*

 ```
 
 
 Here below the example of how to execute this bat files in {++Windows++} and {++Linux++}.

#### Windows

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

#### Linux

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

