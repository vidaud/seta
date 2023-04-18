# seta-nginx 💻 

The **seta-nginx** folder contains the configuration of the server with all the proxy configurations.

* [Dockerfile](../seta-nginx/Dockerfile) - contains all the commands to assemble an image.
* [nginx.conf](../seta-nginx/nginx.conf) - Includes directives for web traffic handling, which are generally known as **universal** .
* [project.conf](../seta-nginx/project.conf) - contains NGINX’s location setting in which NGINX responds to requests for resources inside the server for the production environment. As the server_name directive informs NGINX how it should process requests for the domain, location directives apply to requests for certain folders and files (e.g. http://example.com/blog/.). It also describes the server configuration through the server blocks.
* [project_dev.conf](../seta-nginx/project_dev.conf) -  contains NGINX’s location setting in which NGINX responds to requests for resources inside the server for the development environment. As the server_name directive informs NGINX how it should process requests for the domain, location directives apply to requests for certain folders and files (e.g. http://example.com/blog/.). It also describes the server configuration through the server blocks.
* [project_test.conf](../seta-nginx/project_test.conf) -  contains NGINX’s location setting in which NGINX responds to requests for resources inside the server for the test test. As the server_name directive informs NGINX how it should process requests for the domain, location directives apply to requests for certain folders and files (e.g. http://example.com/blog/.). It also describes the server configuration through the server blocks.


## Build

The image can be built by running:
```
    docker compose up seta-ui-react seta-nginx
```
It will setup all the containers: _seta-mongo_, _seta-es_, _seta-api_ and _seta-ui_ 


It will recreate containers: _seta-ui-react_ and _seta-nginx_ 

At some point there will be a message *"Accepting connections at http://localhost:3000"*


After that you are ready to open your browser and start typing:  
* **for UI:** http://localhost/seta-ui
* **for API:** http://localhost/seta-api/doc
