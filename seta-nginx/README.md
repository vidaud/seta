# seta-nginx 💻 

The **seta-nginx** folder contains the configuration of the server with all the proxy configurations.


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