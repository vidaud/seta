Docker is an open platform for developing, shipping, and running applications. Docker enables to separate applications from infrastructure so you can deliver software quickly. By taking advantage of Docker’s methodologies for shipping, testing, and deploying code quickly, you can significantly reduce the delay between writing code and running it in production.[^1]

## Docker architecture

Docker uses a client-server architecture. The *Docker client* talks to the *Docker daemon*, which does the heavy lifting of building, running, and distributing your Docker containers. The Docker client and daemon can run on the same system, or you can connect a Docker client to a remote Docker daemon. The Docker client and daemon communicate using a REST API, over UNIX sockets or a network interface. Another Docker client is *Docker Compose*, that lets you work with applications consisting of a set of containers.


### The Docker daemon

The Docker daemon (dockerd) listens for Docker API requests and manages Docker objects such as images, containers, networks, and volumes. 


### The Docker client

The Docker client (docker) is the primary way that many Docker users interact with Docker. When you use commands such as docker run, the client sends these commands to dockerd, which carries them out. The docker command uses the Docker API. 



### Docker Desktop

Docker Desktop is an easy-to-install application for your environment that enables you to build and share containerized applications and microservices. Docker Desktop includes the Docker daemon (dockerd), the Docker client (docker), Docker Compose, Docker Content Trust, Kubernetes, and Credential Helper. For more information, see [Docker Desktop](https://docs.docker.com/desktop/).


### Docker registries

A Docker registry stores Docker images. Docker Hub is a public registry that anyone can use, and Docker is configured to look for images on Docker Hub by default. You can even run your own private registry.

When you use the docker pull or docker run commands, the required images are pulled from your configured registry. When you use the docker push command, your image is pushed to your configured registry.

### Docker objects

When you use Docker, you are creating and using images, containers, networks, volumes, plugins, and other objects.


#### Images

An image is a read-only template with instructions for creating a Docker container. Often, an image is based on another image, with some additional customization. 


#### Containers

A container is a runnable instance of an image. You can create, start, stop, move, or delete a container using the Docker API or CLI. You can connect a container to one or more networks, attach storage to it, or even create a new image based on its current state. There are two types of containers in Docker:




## SeTA Docker architecture

The SeTA project has been designed with folder **seta-compose** as the configuration source. 

### Configuration files
Inside this folder we can find:

File *common.yml* to set up of all the services:

```
    services:
        mongo:
            restart: always
            build:
            context: ../seta-mongo
            args:
                - HTTP_PROXY=${HTTP_PROXY}
                - HTTPS_PROXY=${HTTPS_PROXY}
            expose:
            - "27017"
            environment:
            - NO_PROXY=${NO_PROXY}
            - no_proxy=${NO_PROXY}

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
    
    cont...
```

File *docker-compose.yml* with the base configuration and with reference to file *common.yml*:

```
    version: "3.8"
    services:
    seta-mongo:
        container_name: mongo
        extends:
        file: common.yml
        service: mongo
        networks:
        - seta-network
        volumes:
        - seta-mongo:/data/db

    cont...
```
### Containers
For SeTA we are using two types of containers:     

- Stateless Containers: These types of containers do not persist data, i.e., their data is deleted as soon as they are stopped.    In SeTA the containers of this type are:    

    - seta-api: service that communicates with the docker client in order to elaborate the queries to the Elasticsearch engine that come from the web app.   Is included the functions by which this raw data is parsed, normalized, and enriched before it is indexed in Elasticsearch.   The process of index in Elasticsearch, it is also included in this container. 

    - seta-auth: it host the web service for authentication for register users. Also for the external applications as well internal applications. This service is intended for the communication from the web service that has authorization through a public driver key defined by register users and also a second part used for internal communication. 
    - seta-doc: contains the documentation files is not a dynamic container.

    - seta-es: contains the image where the Elasticsearch engine is store.  The Elasticsearch engine is fast, with it's logic of placing documents distributed across different containers, it provides redundant copies of the data in case of hardware failure. It has a number of powerful built-in features that make storing and searching data even more efficient, such as data rollups and index lifecycle management.

    - seta-nginx: contains the proxy server configurations for all the endpoints to be reachable outside, in particular for web services.

    - seta-ui: contains the configuration that enables the access to the web app. In this folder it is included the code to support the seta-api container.  In this folder it is included the code to support the seta-api to validate the authentication token.

    - seta-react: contains the react code of the web app interface.

- Stateful Containers: These types of containers persist data and are typically used to run stateful applications such as databases, message queues, and file servers. The data stored inside the container is persistent even if the container is stopped or recreated.  In SeTA the containers are:    

    - seta-data: this container functions mainly to populate de Elasticsearch database, if the database is empty at the begining, it will fill the Elasticsearch database.

    - seta-mongo: contains the operational databases for SETA web services and web application, also includes users management, comunity, resources managament and other operational data.


### Docker desktop

From the docker desktop we can see the containers, please note that the displayed names are just labels, for the deployment we used the services names: 
![Screenshot](../img/docker-desktop.png)






[^1]: https://docs.docker.com/get-started/overview/