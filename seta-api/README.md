# seta-api 📃

The **seta-api**  folder contains the image with the python client that helps to communicates with the docker client in order to elaborate the queries to the ElasticSearch engine that comes from the web app. 

It has all the necessary configuration to make the data flows into the Elasticsearch engine from the different sources. In this image are included the functions by which this raw data is parsed, normalized, and enriched before it is indexed in ElasticSearch. 

The process of index in ElasticSearch, it is also included in this image, together with the process of manage complex queries against the data and use aggregations to retrieve complex summaries of the data. 




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