## Installation

Move to the directory of the project:

```
    # make sure that you are in the root directory of the project, use" pwd" or "cd" for windows

    cd RepoName
```

The *node_modules* directory is not a part of the cloned repository and should be downloaded using the *npm install* command to download all the direct and transitive dependencies mentioned in the package.json file:

```
    npm install
```

!!! warning
    It will take some time to download all the dependencies into the **node_modules** directory.

### Docker composer

Move to folder **seta-compose** and follow these instructions:

```
    cd ./seta-compose
```    

Create an ***.env*** file containing the variables as described in the file  *.env.example*


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

* **for UI:** [[location] {{ setaUrls.home }}]({{ setaUrls.home }})

* **for SeTA API:** [[location] {{ setaUrls.apiSeta }}]({{ setaUrls.apiSeta }})

* **for SeTA COMMUNITIES API:** [[location] {{ setaUrls.apiCommunities }}]({{ setaUrls.apiCommunities }})

* **for DOCS:** [[location] {{ setaUrls.apiCommunities }}]({{ setaUrls.apiCommunities }})

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