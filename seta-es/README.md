# seta-es 🔎

* [Dockerfile](../seta-es/Dockerfile)

The **seta-es** folder contains the image where the Elasticsearch engine is store.

The **Elasticsearch** engine is fast, with it's logic of placing documents distributed across different containers, it provides redundant copies of the data in case of hardware failure. 

Elasticsearch comes with a wide set of features: *is fast, scalabale, and resilient.* 

It has a number of powerful built-in features that make storing and searching data even more efficient, such as data rollups and index lifecycle management.

The Elasticsearch engine simplifies data ingest, visualization, and reporting. 


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