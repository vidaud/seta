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

**POST /communities**   

Create a new community and add this user as a member with elevated scopes.    
<!--    
<figure markdown>
![Image title](/docs/img/post_community.png){ width="900" }
<figcaption>POST /community</figcaption>
</figure>

<figure markdown>
![Image title](/docs/img/post_community_result.png){ width="900" }
<figcaption>POST /community (result)</figcaption>
</figure>
 -->

**GET /communities**     
Retrieve community list for this user.    
<!--
<figure markdown>
![Image title](/docs/img/get_communities.png){ width="900" }
<figcaption>GET /communities</figcaption>
</figure>
  -->


**DELETE /communities/{id}**      

Delete community entries.     
<!--
<figure markdown>
![Image title](/docs/img/delete_communities_id.png){ width="900" }
<figcaption>DELETE /communities{id}</figcaption>
</figure>
 -->

**PUT /communities/{id}**     
Update community fields.
<!--
<figure markdown>
![Image title](/docs/img/put_communities_id.png){ width="900" }
<figcaption>PUT /communities{id}</figcaption>
</figure>
<figure markdown>
![Image title](/docs/img/put_communities_id_result.png){ width="900" }
<figcaption>PUT /communities{id} (result)</figcaption>
</figure>
 -->

**GET /communities/{id}**      
Retrieve community, if user is a member of it.    
<!--
<figure markdown>
![Image title](/docs/img/get_communities_id.png){ width="900" }
<figcaption>GET /communities{id}</figcaption>
</figure>

 -->

<figure markdown>
![Image title](/docs/img/seta_api_communities.png){ width="900" }
<figcaption>Communities</figcaption>
</figure>


## Community Change Requests

**GET /communities/change-requests/pending**     
Retrieve pending change requests for communitites.    


<!--  

<figure markdown>
![Image title](/docs/img/get_communities_change_request_pending.png){ width="900" }
<figcaption>GET /communities change request</figcaption>
</figure>
-->

**POST /communities/{community_id}/change-requests/**      
Add new change request for a community field.    
<!--  

<figure markdown>
![Image title](/docs/img/post_communities_community_id.png){ width="900" }
<figcaption>POST /communities{community_id} change requests</figcaption>
</figure>

<figure markdown>
![Image title](/docs/img/post_communities_community_id_result.png){ width="900" }
<figcaption>POST /communities{community_id} change requests (result)</figcaption>
</figure>

-->

**GET /communities/{community_id}/change-requests/{request_id}**      

Retrieve change request for the community.     
<!--
<figure markdown>
![Image title](/docs/img/get_communities_change_request_request_id.png){ width="900" }
<figcaption>GET /communities{community_id} change requests{request_id}</figcaption>
</figure>

  -->


**PUT /communities/{community_id}/change-requests/{request_id}**     

Approve/reject request  
<!--
<figure markdown>
![Image title](/docs/img/put_communities_id_change_request_id.png){ width="900" }
<figcaption>PUT /communities{community_id} change requests{request_id}</figcaption>
</figure>  


 -->
<figure markdown>
![Image title](/docs/img/seta_api_communities_change_requests.png){ width="900" }
<figcaption> Communities Change Requests</figcaption>
</figure>

## Community Memberships

**POST  /communities/{community_id}/memberships**    
Add new member to an opened community.    
<!--

<figure markdown>
![Image title](/docs/img/post_communities_community_id_memberships.png){ width="900" }
<figcaption>POST /communities{community_id} memberships</figcaption>
</figure>
 -->

**GET /communities/{community_id}/memberships**    
Retrieve membership list for this community.

<!-- ![Screenshot](/docs/img/get_communities_id_memberships.png){ width="900" } -->


**DELETE /communities/{community_id}/memberships/{user_id}**     

Remove membership.

<!-- ![Screenshot](/docs/img/delete_communities_id_memberships_usr_id.png){ width="900" } -->


**GET /communities/{community_id}/memberships/{user_id}**    
Retrieve user membership

<!-- ![Screenshot](/docs/img/get_communities_id_memberships_usr_id.png){ width="900" } -->


**PUT /communities/{community_id}/memberships/{user_id}**     
Update membership fields.

<!-- ![Screenshot](/docs/img/put_communities_id_memberships_usr_id.png){ width="900" } -->


**POST  /communities/{community_id}/requests**    
Add new request for the community for the authorized user.    

<!-- ![Screenshot](/docs/img/post_communities_community_id_requests.png){ width="900" } -->


**GET /communities/{community_id}/requests**      
Retrieve request list for this community.

<!-- ![Screenshot](/docs/img/get_communities_id_requests.png){ width="900" } -->



**GET /communities/{community_id}/requests/{user_id}**      
Retrieve user request for the community.

<!-- ![Screenshot](/docs/img/get_communities_id_requests_usr_id.png){ width="900" } -->


**PUT /communities/{community_id}/requests/{user_id}**      
Approve/reject request.

<!-- ![Screenshot](/docs/img/put_communities_id_requests_usr_id.png){ width="900" }  -->

<figure markdown>
![Image title](/docs/img/seta_api_communities_memberships.png){ width="900" }
<figcaption> Community Memberships</figcaption>
</figure>

## Community Invites

**POST  /communities/{community_id}/invites**    
Create new invites.    

<!-- ![Screenshot](/docs/img/post_communities_community_id_invites.png){ width="900" } -->

**GET /communities/{community_id}/invites**       

Retrieve pending invites for this community.

<!-- ![Screenshot](/docs/img/get_communities_id_invites.png){ width="900" } -->



## Invites

**GET /invites/{invite_id}**      
Retrieve invite.    
<!-- ![Screenshot](/docs/img/get_invites_id.png){ width="900" } -->

**PUT /invites/{invite_id}**       

Update an invite. Accept/reject invite.     
<!-- ![Screenshot](/docs/img/put_invites_id.png){ width="900" } -->

<figure markdown>
![Image title](/docs/img/seta_api_communities_invites.png){ width="900" }
<figcaption> Community Invites</figcaption>
</figure>



## Resources
**POST  /resources/community/{community_id}**    
Create new resource por given community.    

<!-- ![Screenshot](/docs/img/post_resources_community_id.png){ width="900" } -->

<!-- ![Screenshot](/docs/img/post_resources_community_id_result.png){ width="900" } -->

**GET  /resources/community/{community_id}**    
Retrieve resources for a given community.  

<!-- ![Screenshot](/docs/img/get_resources_community_id.png){ width="900" } -->
<!-- ![Screenshot](/docs/img/get_resources_community_id_results.png){ width="900" } -->


**DELETE  /resources/{id}**    
Delete all resource entries.  

<!-- ![Screenshot](/docs/img/delete_resources_id.png){ width="900" } -->

**GET /resources/{id}**   
Retrieve resource.
<!-- ![Screenshot](/docs/img/get_invites_id.png){ width="900" } -->

**PUT /resources/{id}**      

Update resource fields.

<!-- ![Screenshot](/docs/img/put_resources_id.png){ width="900" } -->
<!-- ![Screenshot](/docs/img/put_resources_id_results.png){ width="900" } -->

## Resource Contributors

**POST  /resources/{resource_id}/contributors**    
Create new contributor por given resource.    

<!-- ![Screenshot](/docs/img/post_resources_id_contributors.png){ width="900" } -->

<!-- ![Screenshot](/docs/img/post_resources_id_contributors_result.png){ width="900" } -->

**GET /resources/{resource_id}/contributors**      
Retrieve contributors of a given resource.
<!-- ![Screenshot](/docs/img/get_resources_id_contributors.png){ width="900" } -->


## Resource Change Requests

**GET /resources/change-requests/pending**      

Retrieve pending change requests for resources.

<!-- ![Screenshot](/docs/img/get_resources_change_requests_pending.png){ width="900" } -->

**POST  /resources/{resource_id}/change-requests**    
Add new change request for a resource field.   

<!-- ![Screenshot](/docs/img/post_resources_id_change-requests.png){ width="900" } -->


**GET  /resources/{resource_id}/change-requests/{request-id}**    
Retrieve change request for the resource. 

<!-- ![Screenshot](/docs/img/get_resources_id_change_requests_id.png){ width="900" } -->



**PUT  /resources/{resource_id}/change-requests/{request-id}**    
Approve/reject request

<!-- ![Screenshot](/docs/img/put_resources_id_change_requests_id.png){ width="900" } -->

<figure markdown>
![Image title](/docs/img/seta_api_communities_resources.png){ width="900" }
<figcaption>Resources, Contributors, Change Requests</figcaption>
</figure>

## Community User Permissions

**GET  /permissions/community/{community_id}**    
Retrieve user-scope list for given community. 

<!-- ![Screenshot](/docs/img/get_permissions_community_id.png){ width="900" } -->

**POST  /permissions/community/{community_id}/user/{user-id}**    
Replace all user permissions for the community. 

<!-- ![Screenshot](/docs/img/get_permissions_community_id.png){ width="900" } -->

**GET  /permissions/community/{community_id}/user/{user-id}**    
Retrieve user-scopes for given community. 
<!-- ![Screenshot](/docs/img/get_permissions_community_id_user_id.png){ width="900" } -->


<figure markdown>
![Image title](/docs/img/seta_api_communities_usr_permissions.png){ width="900" }
<figcaption>Community User Permissions</figcaption>
</figure>