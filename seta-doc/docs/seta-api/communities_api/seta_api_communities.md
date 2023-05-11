# SETA-API Communities

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

#### POST /communities

Create a new community and add this user as a member with elevated scopes.    
    
<!-- <!-- ![Screenshot](/docs/img/post_community.png){ width="900" } -->
<!-- ![Screenshot](/docs/img/post_community_result.png){ width="900" } -->

#### GET /communities
Retrieve community list for this user.    

<!-- ![Screenshot](/docs/img/get_communities.png){ width="900" } -->


#### DELETE /communities/{id}

Delete community entries.     

<!-- ![Screenshot](/docs/img/delete_communities_id.png){ width="900" } -->



#### GET /communities/{id}
Retrieve community, if user is a member of it.    

<!-- ![Screenshot](/docs/img/get_communities_id.png){ width="900" } -->


#### PUT /communities/{id}
Update community fields.


<!-- ![Screenshot](/docs/img/put_communities_id.png){ width="900" } -->
<!-- ![Screenshot](/docs/img/put_communities_id_result.png){ width="900" } -->






<!--## Swagger

In the following swagger implementation it is possible to start using the API, *^^do not forget to follow the instructions in the set up page^^*:

!!swagger seta_communities_api.json!!-->