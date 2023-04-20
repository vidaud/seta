# SeTA *Semantic Text Analyser*

SeTA is a new tool that applies advanced text analysis techniques to large document collections, helping policy analysts to understand the concepts expressed in thousands of documents and to see in a visual manner the relationships between these concepts and their development over time. 

**Documentation:** For more information click  [here 📖](http://localhost/docs)


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


All static resources that ensue from `ng build seta-web -c=<environment>` of the the frontend module are copied inside the flask-server **seta-ui** folder's module.  
The end result is a ***seta-flask-server*** folder that contains a Flask application that can be deployed on any web container.  
Flask configurations files are:
 - seta-flask-server/config.py
 - seta-flask-server/.env
 
 React configuration files are:
 - package.json
 
## Prerequisites

It is necessary to download the project from the git repository


#### **Use the git clone command to clone the project in the current directory, using an SSH link**
```
    git clone https://github.com/vidaud/seta.git
```


## Minimum requirements

* At least 10 GB available free RAM.

* 16 GR (32 GB preferred) RAM, 100 GB free space HDD or SSD (preferred).

* Good Internet speed. You will need to download at least 5GB (> 20GB for all data)

The first run will take time. The next run will be fast.


## Installation

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


## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License


[![MIT][mit-badge]][mit-url]

[mit-badge]: https://img.shields.io/badge/license-mit-blue
[mit-url]: https://choosealicense.com/licenses/mit/