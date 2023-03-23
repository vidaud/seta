# seta-api

The **seta API**  allows to create new communities through a simple rest call. It receives the requests about a specific resource on the seta server.

The subfolder contains docker files and the configuration files for the execution of the API:

* app.py
* app_dev.py
* app_test.py
* docker-compose.yml
* Dockerfile
* Dockerfile-dev-flask
* Dockerfile-test
* gunicorn_conf.py \



## Prerequisites
***
The Docker containers have to be running.

>Optional, but useful: install _MongoDB Compass_ and connect to dockerized mongodb on localhost:**27017**

If the seta database exists, then remove it with either MongoDB Compass or bash mongodb commands.

* EU Login Authentication

   Open a browser and go to `seta-ui` login page: [http://localhost/seta-ui/login](http://localhost/seta-ui/login).

   Connect with `EU Login` account (you can also use *GitHub* authentication, but `EU Login` will be used as an example here)

   After successful authentication, check that you have the following entries in the new *seta database - users collection*:

   *Notice:* **user_id** is a randomly generated short guid for each new account

* **Partial object for the new *seta* account:**


```json
      {
        "user_id": "5Mq7bNYnhtaiS6BDLvcZ",
        "email": "email@domain",
        "user_type": "user",
        "status": "active",
      }
```

* **provider object:**
```json
      {
        "user_id": "5Mq7bNYnhtaiS6BDLvcZ",
        "provider_uid": "ecas_id",
        "provider": "ECAS",
        "first_name": "First name",
        "last_name": "Last name",
        "domain": "eu.europa.ec"
       }
```

* **community create scope:**
```json
      {
        "user_id": "5Mq7bNYnhtaiS6BDLvcZ",
        "system_scope": "/seta/community/create",
        "area": "community"
       }
```

* **role claim (claim_value can different):**
```json
       {
        "user_id": "5Mq7bNYnhtaiS6BDLvcZ",
        "claim_type": "roles",
        "claim_value": "Administrator"
        }
```

## Community API
***
Open a new tab in the same browser for the **community api swagger documentation:** [http://localhost/api/communities/v1/doc](http://localhost/api/communities/v1/doc)

Open the _browser developer tool_ and copy the value of the ***'csrf_access_token'** cookie

_Note:_ you can check the decoded access and refresh tokens at [https://jwt.io/](https://jwt.io/) website

Click on the *Authorize* button to open the Available authorizations dialog; set the **CSRF** value and click on **Authorize** button; leave the Bearer field empty.


##  Create community
***
Expand *Communities* region and then Try out POST **/communities**:


The server response should be a **201** code with a json body:

**{ "message": "New community added", "status": "success" }**


Check the following entries in the *seta database - communities* collection:

* **community object:**
```json
       {
            "community_id": "seta",
            "title": "Seta",
            "description": "Seta community",
            "membership": "closed",
            "data_type": "evidence",
            "status": "active",
            "creator_id": "5Mq7bNYnhtaiS6BDLvcZ"
       }
```

* **membership object:**
```json
        {
            "community_id": "seta",
            "user_id": "5Mq7bNYnhtaiS6BDLvcZ",
            "role": "CommunityOwner",
            "join_date": "2023-03-06T17:34:48.538+00:00",
            "status": "active"
        }
```

* **Check the objects for the community scopes in the seta database - users collection:**
```json
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

## Create resource
***
Expand Resources region and then Try out POST ***/resources/community/{community_id}:***



* **Check the resource entry in the seta database - resources collection:**
```json
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
```

* **Check the objects for the resource scopes in the seta database - users collection:**
```json
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

## SeTA-API Corpus
***
Open a new tab in the same browser for the seta-api swagger documentation: [http://localhost/seta-api/doc](http://localhost/seta-api/doc)



>**Only if you want to use seta-api in another browser:**

Open the _browser developer tool_ and copy the value of the **'_access_token_cookie'** cookie
Click on the **Authorize** button to open the Available authorizations dialog; in the apikey text input set **'Bearer'** value then click on the Authorize button.



*Seta-API* will get at each request another authorization decoded token from seta-ui at [http://localhost/authorization/v1/token_info](http://localhost/authorization/v1/token_info) endpoint using the authenticated **JWT**.

***Note:*** You can verify the authorization token at [http://localhost/authorization/v1/doc](http://localhost/authorization/v1/doc) passing the **JWT** access token as payload.

Start using the methods under **seta-api-corpus** region.

## License


[![MIT][mit-badge]][mit-url]

[mit-badge]: https://img.shields.io/badge/license-mit-blue
[mit-url]: https://choosealicense.com/licenses/mit/

