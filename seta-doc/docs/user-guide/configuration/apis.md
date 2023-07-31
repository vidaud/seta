The SeTA APIs provides the functions and procedures to access the data of the Communities and the functionalities from the Search tool, from a developer point of view.

## API's in SeTA

In SeTA there are two APIs:   
- Communities API       
- JWT Token Authentication                
- SeTA API - Elastic Search queries                 


To prepare the upload of the data, it is important to setup first the **Communities API** to then follow with **SeTA API**.

### Communities API 

!!! info
    The ^^SeTA Communities API^^ are only available for the *Development Environment*

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

<figure markdown>
![Image title](../../../img/Provider_object.png){ width="700" }
<figcaption>Provider object</figcaption>
</figure>

<figure markdown>
![Image title](../../../img/community_create_scope.png){ width="700" }
<figcaption>Community create scope</figcaption>
</figure>

<figure markdown>
![Image title](../../../img/role_claim.png){ width="700" }
<figcaption>Role claim (claim_value can different)</figcaption>
</figure>

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

<figure markdown>
![Image title](../../img/membership_object.png){ width="700" }
<figcaption>Membership object</figcaption>
</figure>

Check the objects for the community scopes in the **seta database - users** collection:

<figure markdown>
![Image title](../../img/seta_usr_scope.png){ width="700" }
<figcaption>User scope</figcaption>
</figure>

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

Check that the objects for the resource scopes in the **seta database - users** collection exists

<figure markdown>
![Image title](../../img/usrs_resources.png){ width="700" }
<figcaption>Users Resource</figcaption>
</figure>

At this point, Community API usage is set up and now it is possible to go to SeTA API to start using the methods under **seta-api-corpus** region for the upload of data.

### SeTA API

#### Prerequisites

#### EU Login Authentication

Open a browser and go to seta-ui [login]({{ setaUrls.login }}) page. Connect with EU Login account or use a GitHub authentication. After that, you can open a new tab in the same browser or go to [SeTA API]({{ setaUrls.apiSeta }}).


!!! info
    If you open a new tab or window from another browser, you need to open the browser developer tool and copy the value of the ^^csrf_access_token^^ cookie 

<figure markdown>
![Image title](../../img/seta-api.png)
<figcaption>SeTA API</figcaption>
</figure>

### JWT token authentication
There is no need to configurate to access the JWT token authetication API:    
 
[JWT Token]({{ setaUrls.jwtToken }})




