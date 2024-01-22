# Docker   
SeTA uses Docker, an open platform for developing, shipping, and running applications. Docker enables to separate applications from infrastructure so it is possible to deliver software quickly. By taking advantage of Docker’s methodologies for shipping, testing, and deploying code quickly, it can reduce significantly the delay between writing code and running it in production.[^1]



## Docker architecture

Docker uses a client-server architecture. The *Docker client* talks to the *Docker daemon*, which does the heavy lifting of building, running, and distributing the Docker containers. The Docker client and daemon can run on the same system, or connect a Docker client to a remote Docker daemon. The Docker client and daemon communicate using a REST API, over UNIX sockets or a network interface. Another Docker client is *Docker Compose*, that allows to work with applications consisting of a set of containers.  The Docker daemon (dockerd) listens for Docker API requests and manages Docker objects such as images, containers, networks, and volumes.      

## Docker Desktop

Docker Desktop is an easy-to-install application for the user environment that enables to build and share containerized applications and microservices. Docker Desktop includes the Docker daemon (dockerd), the Docker client (docker), Docker Compose, Docker Content Trust, Kubernetes, and Credential Helper.[^2].



## SeTA Docker architecture

The `seta-compose` folder is serving as the central hub for SeTA's Docker architecture.

### Configuration files

The `common.yml` file defines the shared services utilized across all three environments: Production, Development, and Test.

```
services:
  opensearch:
    restart: always
    build:
      context: ../seta-opensearch
      args:
        - HTTP_PROXY=${HTTP_PROXY}
        - HTTPS_PROXY=${HTTPS_PROXY}
    environment:
      - bootstrap.memory_lock=true
      - plugins.security.disabled=true
    ulimits:
      memlock:
        soft: -1
        hard: -1
      nofile:
        soft: 65536 # maximum number of open files for the OpenSearch user, set to at least 65536 on modern systems
        hard: 65536
    
    cont...
```

The `docker-compose.yml` file orchestrates the **production** configuration of SeTA's Docker services, networks, volumes, and more, extending the settings defined in the `common.yml` file.

```
    version: "3.8"
    services:
        seta-opensearch:
            container_name: opensearch
            extends:
                file: common.yml
                service: opensearch
            environment:
                - discovery.type=single-node
            volumes:
                - opensearch-data:/usr/share/opensearch/data
            expose:
                - "9200"
                - "9600"
            networks:
                - seta-network  

    cont...
```

The `docker-compose-dev.yml` and `docker-compose-test.yml` files manage the configuration of SeTA's Docker architecture for the development and test environments, respectively.

The `.env.example` file contains the definition of the environment variables used in containers that you have to define in a separate text file for each environment.
For example,  create an `.env` file that is picked-up by default on `docker compose build` and `docker compose up` for production environment.

### Containers
SeTA utilizes two categories of Docker containers:

- **Stateless Containers**: These types of containers do not persist data, i.e., their data is deleted as soon as they are shutdown.

    a) **seta-search**:  This service interacts with the OpenSearch API to process queries originating from the web app or web service clients.  It encompasses functions for parsing, normalizing, and enriching raw data before indexing it in OpenSearch.

    b) **seta-auth**: It hosts the authorization service for registered users.

    c) **seta-doc**: This container houses the documentation project built with MkDocs.

    e) **seta-nginx**: This container holds the proxy server configurations, enabling all endpoints to be accessible externally, particularly for web services.

    f) **seta-ui**: This container hosts the web API that serves the web application.

    g) **seta-ui-react**: This container houses the web application developed with React.

    h) **seta-nlp**: This container provides web services for natural language processing, serving as a critical resource for both the Search API and the web application.

    i) **seta-admin**: This service functions as an internal administrative web interface, accessible exclusively within the Docker network.

- **Stateful Containers**: These types of containers persist data and are typically used to run stateful applications such as databases, message queues, and file servers. The data stored inside the container is persistent even if the container is stopped or recreated.  In SeTA the containers are:    

    a) **seta-opensearch**: OpenSearch engine and data store.

    b) **seta-mongo**: It hosts the operational databases for the SETA web application and services.

    c) **seta-data**: This container functions mainly to initialize the OpenSearch data store.



[^1]: https://docs.docker.com/get-started/overview/
[^2]: https://docs.docker.com/desktop/