# SeTA *Semantic Text Analyser*

SeTA is a new tool that applies advanced text analysis techniques to large document collections, helping policy analysts to understand the concepts expressed in thousands of documents and to see in a visual manner the relationships between these concepts and their development over time. 


## General Overview 
***
This project is made up of two modules: \
* The **frontend** 
* The **flask-server** one. \

**Seta-frontend** is an *React* standard workspace enabled application.  \
**Seta-middleware** is a standard `maven-archetype-webapp` \
**Seta-flask-server** is a Flask application \

The frontend module contains all the static resources that make up the UI business logic  
The middleware module contains all the java sources and acts as a proxy / integration layer towards the backend. \
The flask-server module contains all the python sources and acts as a proxy / authentication layer towards the backend.  


All static resources that ensue from `ng build seta-web -c=<environment>` of the the frontend module are copied inside the flask-server **seta-ui** folder's module.  
The end result is a ***seta-flask-server*** folder that contains a Flask application that can be deployed on any web container.  
Flask configurations files are:
 - seta-flask-server/config.py
 - seta-flask-server/.env
 
 React configuration files are:
 - package.json
 
## Prerequisites
***
It is necessary to download the project from the git repository

#### **Add GitHub account details**

```
    git config --global user.name "Your name here"
    git config --global user.email "your_email@example.com"
```

#### **Generate SSH keys**
```
    ssh-keygen -t rsa -C "your_email@example.com"
```
#### **Copy the generated SSH key**
- On Linux, get the content of the SSH key using the cat command:
```
    cat < ~/.ssh/id_rsa.pub
```
  
- For Windows, the key can be generated using git bash (or putty), so open the git bash console and type:
```
    ssh-keygen -t rsa
```

#### **Add SSH to GitHub account**
Open settings from the profile icon, select SSH and GPG keys, and add the copied SSH key
```
    git remote add https://username:password@git@github.com:vidaud/seta.git
```
#### **Use the git clone command to clone the project in the current directory, using an SSH link**
```
    git clone https://github.com/vidaud/seta.git
```

## Installation
***
Move to the directory of the project:

```
    # make sure that you are in the root directory of the project, use" pwd" or "cd" for windows

    cd RepoName
```
The node_modules directory is not a part of the cloned repository and should be downloaded using the npm install command to download all the direct and transitive dependencies mentioned in the package.json file:
```
    npm install
```

It will take some time to download all the dependencies into a node_modules directory.

## Deployment procedure
***
### **Docker composer**

> For the prerequistes on the composer please go to the *README.md* in **cd ./seta-compose**

```
    cd ./seta-compose
```    

Create an ***.env*** file containing the variables as described in *.env.example*
The following commands will use by default the *docker-compose.yml* as the configuration file and *.env* as the environment file

```
    docker-compose build
    docker-compose up
```

_Notes:_
- It will setup all system and data.\
- It will take a while depending on the Internet speed. Might take 30min to 2h.\
- At some point there will be a message *"SeTA-API is up and running."*


After successfully start all the containers you are ready to open your browser and start typing:
* **for UI:** http://localhost/seta-ui
* **for API:** http://localhost/seta-api/doc

### To stop services:
***
```
    CTRL + C
```
* Start in detach mode:
```
    docker-compose up -d
```

* Stop services after detach mode
```
    docker compose down
```
### Development environment
***
+ Create an ***.env.dev*** file containing the variables as described in *.env.example*

### (re-)build all images
```
    docker compose -f docker-compose.yml -f docker-compose-dev.yml --env-file .env.dev build
```
### (re-)build only seta-ui image
```
    docker compose -f docker-compose.yml -f docker-compose-dev.yml --env-file .env.dev build seta-ui
```
+ Start all services for your environment locally:
```
    docker compose -f docker-compose.yml -f docker-compose-dev.yml --env-file .env.dev up
```
+ Start all services for your environment locally in detached mode:
```
    docker compose -f docker-compose.yml -f docker-compose-dev.yml --env-file .env.dev up -d
```
### Rebuild and restart seta-ui services while other services are runing:  
```
    docker compose -f docker-compose.yml -f docker-compose-dev.yml --env-file .env.dev up --force-recreate --build --no-deps seta-ui
```

For Linux, there are two shell files *dev-build.sh* and *dev-up.sh* as shorts commands for docker compose -f docker-compose.yml -f docker-compose-dev.yml --env-file .env.dev

For execute permissions run:
```
    chmod +x ./dev-build.sh
    chmod +x ./dev-up.sh
```
### Test environment
***
Create an ***.env.test*** file containing the variables as described in *.env.example*

```
    docker compose -f docker-compose-test.yml build
    docker compose -f docker-compose-test.yml up
```


## Contributing
***

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License


[![MIT][mit-badge]][mit-url]

[mit-badge]: https://img.shields.io/badge/license-mit-blue
[mit-url]: https://choosealicense.com/licenses/mit/