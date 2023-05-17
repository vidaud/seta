# seta-ui 🏁


The **seta-ui**  folder contains the configuration that enables the access to the web app.        
In the files **seta-flask-server** it is possible to replicate the application across different servers with minimal reconfiguration.     
In this folder it is included the code to support the seta-api to validate the authentication token.


## Build

The image is build it together with all the images through the execution of the docker compose:

```
    docker compose build
```

## UP
To start this service, is requires only to start the seta-nginx service as the rest of the services are attached to start together with this service:     

```
    docker compose up seta-nginx -d
```


## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
Copyright (c) 2023 European Union      
Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the European Commission – subsequent versions of the EUPL (the "Licence");     

You may not use this work except in compliance with the Licence.      


You may obtain a copy of the Licence at:      


https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12       
 
Unless required by applicable law or agreed to in writing, software distributed under the Licence is distributed on an "AS IS" basis, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.             
 
See the Licence for the specific language governing permissions and limitations under the Licence.