# seta-nginx 💻 

The **seta-nginx** folder contains the configuration of the server with all the proxy configurations.

* [Dockerfile](../seta-nginx/Dockerfile)
* [nginx.conf](../seta-nginx/nginx.conf)
* [project.conf](../seta-nginx/project.conf)
* [project_dev.conf](../seta-nginx/project_dev.conf)
* [project_test.conf](../seta-nginx/project_test.conf)


## Build

The image can be built by running:
```
    docker compose up seta-ui-react seta-nginx
```
It will setup all the containers: _seta-mongo_, _seta-es_, _seta-api_ and _seta-ui_ \
It will recreate containers: _seta-ui-react_ and _seta-nginx_ 

At some point there will be a message *"Accepting connections at http://localhost:3000"*


After that you are ready to open your browser and start typing:  
* **for UI:** http://localhost
* **for API:** http://localhost/seta-api/doc
