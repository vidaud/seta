# SETA-API

The SeTA API Communities exposes the data and functionality of the management in the communities. It has various methods that can be performed on them over HTTP, like GET, POST, PUT, and DELETE. 

The main categories are:    
- Communities    
- Community Change Requests     
- Community Memberships      
- Community Invites       
- Invites
- Resources
- Resource Contributors
- Resource Change Requests
- Community User Permissions
        

 
## Communities

The Communities section is the related to the creation, retrieve, update and delete the communities.

### POST /communities

Create a new community and add this user as a member with elevated scopes.    
    
![Screenshot](../img/post_community.png){ width="900" }
![Screenshot](../img/post_community_result.png){ width="900" }

### GET /communities
Retrieve community list for this user.    

![Screenshot](../img/get_communities.png){ width="900" }


### DELETE /communities/{id}

Delete community entries.     

![Screenshot](../img/delete_communities_id.png){ width="900" }



### GET /communities/{id}
Retrieve community, if user is a member of it.    

![Screenshot](../img/get_communities_id.png){ width="900" }


### PUT /communities/{id}
Update community fields.


![Screenshot](../img/put_communities_id.png){ width="900" }
![Screenshot](../img/put_communities_id_result.png){ width="900" }



## Community Change Requests

SETA Community Change Requests.    

### GET /communities/change-requests/pending
Retrieve pending change requests for communitites.    


![Screenshot](../img/get_communities_change_request_pending.png){ width="900" }




### POST /communities/{community_id}/change-requests/
Add new change request for a community field.    
![Screenshot](../img/post_communities_community_id.png){ width="900" }
![Screenshot](../img/post_communities_community_id_result.png){ width="900" }



### GET /communities/{community_id}/change-requests/{request_id}

Retrieve change request for the community.     


![Screenshot](../img/get_communities_change_request_request_id.png){ width="900" }


### PUT /communities/{community_id}/change-requests/{request_id}

Approve/reject request    
![Screenshot](../img/put_communities_id_change_request_id.png){ width="900" }


## Community Memberships

### POST  /communities/{community_id}/memberships    
Add new member to an opened community.    

![Screenshot](../img/post_communities_community_id_memberships.png){ width="900" }


### GET /communities/{community_id}/memberships
Retrieve membership list for this community.

![Screenshot](../img/get_communities_id_memberships.png){ width="900" }


### DELETE /communities/{community_id}/memberships/{user_id}

Remove membership.

![Screenshot](../img/delete_communities_id_memberships_usr_id.png){ width="900" }


### GET /communities/{community_id}/memberships/{user_id}
Retrieve user membership

![Screenshot](../img/get_communities_id_memberships_usr_id.png){ width="900" }


### PUT /communities/{community_id}/memberships/{user_id}
Update membership fields.

![Screenshot](../img/put_communities_id_memberships_usr_id.png){ width="900" }



### POST  /communities/{community_id}/requests    
Add new request for the community for the authorized user.    

![Screenshot](../img/post_communities_community_id_requests.png){ width="900" }


### GET /communities/{community_id}/requests
Retrieve request list for this community.

![Screenshot](../img/get_communities_id_requests.png){ width="900" }



### GET /communities/{community_id}/requests/{user_id}
Retrieve user request for the community.

![Screenshot](../img/get_communities_id_requests_usr_id.png){ width="900" }


### PUT /communities/{community_id}/requests/{user_id}
Approve/reject request.

![Screenshot](../img/put_communities_id_requests_usr_id.png){ width="900" }


## Community Invites

### POST  /communities/{community_id}/invites    
Create new invites.    

![Screenshot](../img/post_communities_community_id_invites.png){ width="900" }

### GET /communities/{community_id}/invites

Retrieve pending invites for this community.

![Screenshot](../img/get_communities_id_invites.png)



## Invites

### POST /compute-embeddings
Given a file or a plain text, related embeddings are provided. Embeddings are built using Doc2vec. Tika is used to extract text from the provided file. If both file and text are provided, function will return text embeddings.
![Screenshot](../img/post-compute-embeddings.png)
![Screenshot](../img/post-compute-embeddings-results.png)


## Models

The models section describes the patterns that were used in the different executions of the API.

![Screenshot](../img/models.png)

## Swagger

In the following swagger implementation it is possible to start using the API, *^^do not forget to follow the instructions in the set up page^^*:

!!swagger seta_api_v1.json!!