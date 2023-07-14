The SeTA APIs use the support of Swagger.  Swagger is an open source collection of guidelines, requirements, and resources for creating and defining RESTful APIs. Making interactive, machine- and human-readable API documentation is made possible by the Swagger framework.          



## Benefits of Swagger
Swagger helps describing an API's structure so that computers may comprehend it. By reading the structure of the API, it can automatically generate beautiful and interactive API documentation. It also makes it possible to investigate different possibilities, including automated testing.[^1]     
Swagger achieves this by requesting a comprehensive YAML or JSON answer from the API that provides a detailed description of the whole API. The resources of the API are listed in this file, which adheres to the OpenAPI Specification. The specification requests include details like:

1. What are all the operations that the API supports?
2. What are the API’s parameters and what does it return?
3. Does the API need some authorization?

And even things like *terms, contact information and license* to use the API.

In Swagger it is possible to write specifications for the API manually, or have it generated automatically from annotations in the source code.      

> The [open-source-integrations](swagger.io/open-source-integrations) page can be consulted for a list of tools that let generates Swagger from code. 


Finally, the use of Swagger UI allows to generate interactive API documentation that lets users try out the API calls directly in the browser.


## Configuration of Swagger in SeTA 
The use of Swagger is convenient when doing development and very useful for public APIs to know how they function.     
But for security concerns, in the production environment Swagger and Swagger-ui are disabled.      

This configuration is setup in the config.py file in the `seta-ui\seta_flask_server\config.py`
```
     DISABLE_SWAGGER_DOCUMENTATION = False
```


[^1]: https://swagger.io/docs/specification/2-0/what-is-swagger/