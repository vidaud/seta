# Minimum Requirements

* At least 10 GB available free RAM.

* 16 GB (32 GB preferred) RAM, 100 GB free space HDD or SSD (preferred).

* Good Internet speed. You will need to download at least 5GB (> 20GB for all data)

# Prerequisites 

- You need to have a GitHub account [https://github.com/](https://github.com/) to download the project. 

Use the git **clone** command to clone the project in the current directory, using an SSH link.
    ```
        git clone https://github.com/vidaud/seta.git
    ```


- Install Docker compose version 2.  *For reference to install in Linux, Maco or Windows:* [https://docs.docker.com/compose/install/](https://docs.docker.com/compose/install/)



# Installation of the project

After clonning the project, move to the directory of the project:

*make sure that you are in the root directory of the project, use" pwd" or "cd" for windows*

```
    cd [RepoName]
```

to add more
### Docker composer

Move to folder **seta-compose** and follow these instructions:

```
    cd ./seta-compose
```    

In the ***.env*** file change the necessary information, where is required for the variables described in the file  

```
    # http and https proxies, --blank for none--
    HTTP_PROXY="http://proxyusername:proxypwd@proxyaddress:proxyport"
    HTTPS_PROXY="http://proxyusername:proxypwd@proxyaddress:proxyport"


    # set-up of no proxy control for docker containers 
    NO_PROXY="seta-es,seta-data,seta-mongo,seta-api,seta-nginx,seta-ui,seta-ui-react,seta-auth"


    ##### Seta-UI variables  ####
    # Set-up of the administrators emails, the system create local users, if no user found it is create it.
    ROOT_USERS="vidas.daudaravicius@ec.europa.eu;lucia.noce@ext.ec.europa.eu;Andrei.Patrascu@ext.ec.europa.eu;adriana.lleshi@ext.ec.europa.eu"
```

### Models

*From repository XXXX download file json_suggestion.json and copy into folder ./seta-data/models*


### Compose and Build

The following commands will call by default the {++docker-compose.yml++} as the configuration file and *.env* as the environment file

```
    docker-compose build
    docker-compose up
```
???+ note "Notes:"
  
    It will setup all system and data.

    It will take a while depending on the Internet speed. Might take 30min to 2h.

    At some point there will be a message *"SeTA-API is up and running."*


After successfully start all the containers you are ready to open your browser and start typing:

* **for UI:** [http://localhost/seta-ui](http://localhost/seta-ui)

* **for API:** [http://localhost/seta-api/doc](http://localhost/seta-api/doc)

* **for DOCS:** [http://localhost/docs](http://localhost/docs)

#### To stop services
```
    CTRL + C
```

#### Start in detach mode

```
    docker-compose up -d
```

#### Stop services after detach mode

```
    docker compose down
```

#### Development environment

To deploy in the Development environment:

Create an ***.env.dev*** file containing the variables as described in  file **.env.example**

#### To (re-)build all images

```
    docker compose -f docker-compose.yml -f docker-compose-dev.yml --env-file .env.dev build
```

#### To (re-)build only seta-ui image

```
    docker compose -f docker-compose.yml -f docker-compose-dev.yml --env-file .env.dev build seta-ui
```

#### Start all services for your environment locally

```
    docker compose -f docker-compose.yml -f docker-compose-dev.yml --env-file .env.dev up
```

#### Start all services for your environment locally in detached mode

```
    docker compose -f docker-compose.yml -f docker-compose-dev.yml --env-file .env.dev up -d
```

#### Rebuild and restart seta-ui services while other services are runing

```
    docker compose -f docker-compose.yml -f docker-compose-dev.yml --env-file .env.dev up --force-recreate --build --no-deps seta-ui
```

#### Shell scripts

For the scripts with short commands: 
```
    docker compose -f docker-compose.yml -f docker-compose-dev.yml --env-file .env.dev
```

 is used a .bat file where it can be set up all the neccesary functions, as well as the set up of the proxy.  Here below the execution of this bat files in {++Windows++} and {++Linux++}.

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

#### Test environment

Create an ***.env.test*** file containing the variables as described in *.env.example*

```
    docker compose -f docker-compose-test.yml build
    docker compose -f docker-compose-test.yml up
```