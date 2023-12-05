The SeTA APIs provides the functions and procedures to access the data of the Datasources and the functionalities from the Search tool, from a developer point of view.

## APIs in SeTA

In SeTA there the following APIs:   
- Datasources API       
- JWT Token Authentication                
- SeTA API - Elastic Search queries                 


To prepare the upload of the data, it is important to setup first the **Datasources API** to then follow with **SeTA API**.

### Datasources API 

!!! info
    The ^^SeTA Datasources API^^ are only available for the *Development Environment*

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
![Image title](../../../img/role_claim.png){ width="700" }
<figcaption>Role claim (claim_value can different)</figcaption>
</figure>

!!! info
    **user_id** is a randomly generated short guid for each new account


Open a new tab in the same browser for the [SeTA Datasources API]({{ setaUrls.apiDatasources }})

<figure markdown>
![Image title](../../../img/datasources_api.png)
<figcaption>SeTA Datasources</figcaption>
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


At this point, Datasource API usage is set up and now it is possible to go to SeTA API to start using the methods under **seta-api-corpus** region for the upload of data.

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




