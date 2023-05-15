
This project is made up of two modules:

* The **frontend** 

* The **flask-server**

**Seta-frontend** is an *React* standard workspace enabled application. The frontend module contains all the static resources that make up the UI business logic. 

**Seta-middleware** is a standard {++maven-archetype-webapp++}, it contains all the java sources and acts as a proxy / integration layer towards the backend. 

**Seta-flask-server** is a Flask application, contains all the python sources and acts as a proxy / authentication layer towards the backend.


All static resources that ensure from {++ng build seta-web -c=<environment>++} of the frontend module are copied inside the flask-server **seta-ui** folder's module. 

The end result is a ***seta-flask-server*** folder that contains a Flask application that can be deployed on any web container.  

The Flask configurations files are:

 - seta-flask-server/config.py

 - seta-flask-server/.env
 
The React configuration file is:

 - package.json
 
## Prerequisites

The project is located in a git repository:

!!! info
    Use the git **clone** command to clone the project in the current directory, using an SSH link.
    ```
        git clone https://github.com/vidaud/seta.git
    ```











