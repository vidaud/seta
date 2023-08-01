SeTA APIs use the support of Swagger.  Swagger is an open source repository of standards, specifications and tools for designing and specifying RESTful APIs. The Swagger framework enables the creation of interactive, machine- and human-readable APIs.  Swagger helps describing an API's structure so they can be comprehended  it.[^1]     
Swagger achieves this by requesting a comprehensive YAML or JSON answer from the API that provides a detailed description of the whole API. The resources of the API are listed in this file.      
In Swagger it is possible to write specifications for the API manually, or have it generated automatically from annotations in the source code.      

> The [open-source-integrations](https://swagger.io/tools/open-source/open-source-integrations/) page can be consulted for a list of tools that let generates Swagger from code. 

Finally, the use of Swagger UI allows to generate interactive API documentation that lets users try out the API calls directly in the browser.

In SeTA, with the variable *DISABLE_SWAGGER_DOCUMENTATION* setup in file `seta-ui\seta_flask_server\config.py` in container *seta-ui* it is possible to manage the display of Swagger Documentation:

```
     DISABLE_SWAGGER_DOCUMENTATION = False
```



[^1]: https://swagger.io/docs/specification/2-0/what-is-swagger/