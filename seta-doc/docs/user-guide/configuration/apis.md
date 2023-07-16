## APIs

The SeTA APIs provides the functions and procedures to access data from a developer point of view.

### Swagger
The SeTA APIs use the support of Swagger.  Swagger is an open source repository of standards, specifications, and tools for designing and specifying RESTful APIs. The Swagger framework enables the creation of interactive, machine- and human-readable APIs.  Swagger helps describing an API's structure so that computers may comprehend it.[^1]     
Swagger achieves this by requesting a comprehensive YAML or JSON answer from the API that provides a detailed description of the whole API. The resources of the API are listed in this file, which adheres to the OpenAPI Specification.      
In Swagger it is possible to write specifications for the API manually, or have it generated automatically from annotations in the source code.      

> The [open-source-integrations](swagger.io/open-source-integrations) page can be consulted for a list of tools that let generates Swagger from code. 

Finally, the use of Swagger UI allows to generate interactive API documentation that lets users try out the API calls directly in the browser.

The use of Swagger is convenient when doing development and very useful for public APIs to know how they function.     
But for security concerns, in the production environment Swagger and Swagger-ui are disabled.      

In SeTA, this configuration is setup inside the container *seta-ui* in the *config.py* file `seta-ui\seta_flask_server\config.py` with the command:
```
     DISABLE_SWAGGER_DOCUMENTATION = False
```

### SeTA API's

In SeTA there are two APIs:   
- Communities API       
- SeTA API             

To prepare the upload of the data, it is important to setup first the **Communities API** to then follow with **SeTA API**.

### Communities API 


#### Prerequisites

The Docker containers must be running.

!!! note "Optional, but useful:" 
    Install MongoDB Compass and connect to dockerized MongoDB on localhost:27017

    If the seta database exists, then remove it with either MongoDB Compass or bash MongoDB commands.

#### EU Login Authentication

Open browser and go to seta-ui [login]({{ setaUrls.login }}) page.

Connect with EU Login account (*you can also use GitHub authentication, but EU Login will be used as an example here*).

After successful authentication, check that you have the following entries in the new **seta database - users collection**:      


<figure markdown>
![Image title](../../../img/db_usr_collection.png){ width="700" }
<figcaption>Partial object for the new seta account</figcaption>
</figure>



<!--```
    {
        "user_id": "5Mq7bNYnhtaiS6BDLvcZ",
        "email": "email@domain",
        "user_type": "user",
        "status": "active",
    }
```-->



<figure markdown>
![Image title](../../../img/Provider_object.png){ width="700" }
<figcaption>Provider object</figcaption>
</figure>

<!--```
    {
        "user_id": "5Mq7bNYnhtaiS6BDLvcZ",
        "provider_uid": "ecas_id",
        "provider": "ECAS",
        "first_name": "First name",
        "last_name": "Last name",
        "domain": "eu.europa.ec"
    }
``` -->


<figure markdown>
![Image title](../../../img/community_create_scope.png){ width="700" }
<figcaption>Community create scope</figcaption>
</figure>


<!--```
    {
        "user_id": "5Mq7bNYnhtaiS6BDLvcZ",
        "system_scope": "/seta/community/create",
        "area": "community"
    }
```-->


<figure markdown>
![Image title](../../../img/role_claim.png){ width="700" }
<figcaption>Role claim (claim_value can different)</figcaption>
</figure>

<!--```
    {
        "user_id": "5Mq7bNYnhtaiS6BDLvcZ",
        "claim_type": "roles",
        "claim_value": "Administrator"
    }
```-->

!!! info
    **user_id** is a randomly generated short guid for each new account



Open a new tab in the same browser for the [Community API swagger documentation]({{ setaUrls.apiCommunities }})

<figure markdown>
![Image title](../../../img/communities_api.png)
<figcaption>SeTA Communities</figcaption>
</figure>


Open the *browser developer tool* and copy the value of the ^^**csrf_access_token**^^ cookie

!!! note
    you can check the decoded access and refresh tokens at [https://jwt.io/](https://jwt.io/) website

Click on the **Authorize** button to open the Available authorizations dialog; set the CSRF value and click on *Authorize* button; leave the **Bearer** field empty.

<figure markdown>
![Image title](../../img/authorize.png){ width="500" }
<figcaption>Authorize</figcaption>
</figure>

!!! warning "Only if you want to use seta-api in another browser:"
    * open the browser developer tool and copy the value of the **access_token_cookie**
    * click on the **Authorize** button to open the Available authorizations dialog; in the apikey text input set **Bearer** value then click on the *Authorize* button.

SeTA-API will get at each request another authorization decoded token from seta-ui through the *token info* endpoint using the authenticated JWT.

> You can verify the authorization token at [authorization doc]({{ setaUrls.auth_Token }}) passing the JWT access token as payload.





#### Create community

Expand **Communities** region and then Try out **POST** /communities:

<figure markdown>
![Image title](../../img/create_community.png){ width="800" }
<figcaption>Create Community</figcaption>
</figure>



The server response should be a 201 code with a JSON body:
```
    { "message": "New community added", "status": "success" }
```
\     
\     
Check the following entries in the **seta database - communities** collection:



<figure markdown>
![Image title](../../img/community_object.png){ width="700" }
<figcaption>Community object</figcaption>
</figure>

<!--```
    {
        "community_id": "seta",
        "title": "SeTA",
        "description": "SeTA community",
        "membership": "closed",
        "data_type": "evidence",
        "status": "active",
        "creator_id": "5Mq7bNYnhtaiS6BDLvcZ"
    }
```-->


<figure markdown>
![Image title](../../img/membership_object.png){ width="700" }
<figcaption>Membership object</figcaption>
</figure>


<!--
```
    {
        "community_id": "seta",
        "user_id": "5Mq7bNYnhtaiS6BDLvcZ",
        "role": "CommunityOwner",
        "join_date": "2023-03-06T17:34:48.538+00:00",
        "status": "active"
    }
```
-->



Check the objects for the community scopes in the **seta database - users** collection:


<figure markdown>
![Image title](../../img/seta_usr_scope.png){ width="700" }
<figcaption>User scope</figcaption>
</figure>


<!--
```
    {
        "user_id": "5Mq7bNYnhtaiS6BDLvcZ",
        "community_id": "seta",
        "community_scope": "/seta/community/owner"
    },
    {
        "user_id": "5Mq7bNYnhtaiS6BDLvcZ",
        "community_id": "seta",
        "community_scope": "/seta/community/manager"
    },
    {
        "user_id": "5Mq7bNYnhtaiS6BDLvcZ",
        "community_id": "seta",
        "community_scope": "/seta/community/invite"
    },
    {
        "user_id": "5Mq7bNYnhtaiS6BDLvcZ",
        "community_id": "seta",
        "community_scope": "/seta/community/membership/approve"
    },
    {
        "user_id": "5Mq7bNYnhtaiS6BDLvcZ",
        "community_id": "seta",
        "community_scope": "/seta/resource/create"
    }
```
-->




#### Create resource

Expand **Community Resources** region and then Try out **POST** /communities/{community_id}/resources:


<figure markdown>
![Image title](../../img/create-resource.png)
<figcaption>Create Resource</figcaption>
</figure>


Check that the Resource entry appears in the **seta database - resources** collection:


<figure markdown>
![Image title](../../img/resource_community.png){ width="700" }
<figcaption>Resource</figcaption>
</figure>

<!--```
    {
        "resource_id": "cordis",
        "community_id": "seta",
        "title": "Cordis",
        "abstract": "Cordis resource",
        "access": "community",
        "limits": {"total_files_no": 50,"total_storage_mb": 1024,"file_size_mb": 50},
        "status": "active",
        "creator_id": "5Mq7bNYnhtaiS6BDLvcZ"
    }
```-->

Check that the objects for the resource scopes in the **seta database - users** collection exists


<figure markdown>
![Image title](../../img/usrs_resources.png){ width="700" }
<figcaption>Users Resource</figcaption>
</figure>

<!--```
    {
        "user_id": "5Mq7bNYnhtaiS6BDLvcZ",
        "resource_id": "cordis",
        "resource_scope": "/seta/resource/edit"
    },
    {
        "user_id": "5Mq7bNYnhtaiS6BDLvcZ",
        "resource_id": "cordis",
        "resource_scope": "/seta/resource/data/add"
    },
    {
        "user_id": "5Mq7bNYnhtaiS6BDLvcZ",
        "resource_id": "cordis",
        "resource_scope": "/seta/resource/data/delete"
    }
```
-->


At this point, Community API usage is set up and now it is possible to go to SeTA API to start using the methods under **seta-api-corpus** region for the upload of data.

### SeTA API

#### Prerequisites


#### EU Login Authentication

Open a browser and go to seta-ui [login]({{ setaUrls.login }}) page. Connect with EU Login account or use a GitHub authentication. After that, you can open a new tab in the same browser or go to [Search API swagger documentation]({{ setaUrls.apiSeta }}).


!!! info
    If you open a new tab or window from another browser, you need to open the browser developer tool and copy the value of the ^^csrf_access_token^^ cookie 




<figure markdown>
![Image title](../../img/seta-api.png)
<figcaption>SeTA API</figcaption>
</figure>







[^1]: https://swagger.io/docs/specification/2-0/what-is-swagger/

