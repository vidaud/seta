# seta-nginx 💻 

The subfolder contains docker files for generating executable images for nginx and the configuration files:

* Dockerfile
* Dockerfile-dev
* Dockerfile-test
* nginx.conf
* project.conf
* project_dev.conf
* project_test.conf


The images can be built by running:
```
    docker compose up seta-ui-react seta-nginx
```
It will setup all the containers: _seta-mongo_, _seta-es_, _seta-api_ and _seta-ui_ \
It will recreate containers: _seta-ui-react_ and _seta-nginx_ 

At some point there will be a message *"Accepting connections at http://localhost:3000"*


After that you are ready to open your browser and start typing:  
* **for UI:** http://localhost/seta-ui
* **for API:** http://localhost/seta-api/doc
