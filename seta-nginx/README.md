# seta-nginx 💻 

The **seta-nginx** contains the proxy server configurations for all the endpoints to be reachable outside, in particular for web services.
In this folder we can find the directives for web traffic handling (nginx.conf), which are generally known as **universal**. Furthermore contains NGINX’s location setting in which NGINX responds to requests for resources inside the server for the different enviroment: production, development and test.


## Build
The image is build it together with all the images through the execution of the docker compose:

```
    docker compose build
```


## Up
To start this service:

```
    docker compose up seta-ui-react seta-nginx
```


It will recreate containers: _seta-ui-react_ and _seta-nginx_ 

At some point there will be a message **SeTA-API is up and running**


After successfully start all the containers, you are ready to open your browser and go to one of the following links:

* **User Web App:** [[location] /](/)

* **SETA API:** [[location] /seta-api/doc](/seta-api/doc)

* **SETA API Communities:** [[location] /api/communities/v1/doc](/api/communities/v1/doc)

* **Documentation:** [[location] /docs](/docs)




## License
Copyright (c) 2023 European Union      
Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the European Commission – subsequent versions of the EUPL (the "Licence");     

You may not use this work except in compliance with the Licence.      


You may obtain a copy of the Licence at:      


https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12       
 
Unless required by applicable law or agreed to in writing, software distributed under the Licence is distributed on an "AS IS" basis, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.             
 
See the Licence for the specific language governing permissions and limitations under the Licence.