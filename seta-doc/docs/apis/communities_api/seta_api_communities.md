# SETA-API Communities

The SeTA API Communities exposes the data and functionality of the management in the communities. It has various methods that can be performed on them over HTTP, like GET, POST, PUT, and DELETE. 

The main categories are:    
- Communities    
- Community Change Requests     
- Community Memberships      
- Community Memberships Requests      
- Community My Membership      
- Community Invites       
- Community Resources      
- Invites   
- Resources     
- Resource Change Request      
- Community User Permissions     
- Resource User Permissions     
- Discovery     

        

 
## Communities

The Communities section is the related to the creation, retrieve, update and delete the communities.                   



**GET /communities**     
Retrieve community list for this user.    



**POST /communities**   

Create a new community and add this user as a member with elevated scopes.    


**GET /communities/{id}**      
Retrieve community, if user is a member of it.    



**DELETE /communities/{id}**      

Delete community entries.     

**PUT /communities/{id}**     
Update community fields.


<figure markdown>
![Image title](/docs/img/seta_api_communities.png){ width="900" }
<figcaption>Communities</figcaption>
</figure>

## Community Change Requests

**GET /communities/change-requests/pending**     
Retrieve all pending change requests for communities, available to sysadmins.    


**GET /communities/{community_id}/change-requests/**      
Retrieve all change requests for a community


**POST /communities/{community_id}/change-requests/**      
Add new change request for a community field.    


**GET /communities/{community_id}/change-requests/{request_id}**      

Retrieve change request for the community.     



**PUT /communities/{community_id}/change-requests/{request_id}**     

Approve/reject request  


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


**DELETE /communities/{community_id}/memberships/{user_id}**     

Remove membership.


**GET /communities/{community_id}/memberships/{user_id}**    
Retrieve user membership


**PUT /communities/{community_id}/memberships/{user_id}**     
Update membership fields.


**POST  /communities/{community_id}/requests**    
Add new request for the community for the authorized user.    


**GET /communities/{community_id}/requests**      
Retrieve request list for this community.



**GET /communities/{community_id}/requests/{user_id}**      
Retrieve user request for the community.


**PUT /communities/{community_id}/requests/{user_id}**      
Approve/reject request.

<figure markdown>
![Image title](/docs/img/seta_api_communities_memberships.png){ width="900" }
<figcaption> Community Memberships</figcaption>
</figure>

## Community Invites

**POST  /communities/{community_id}/invites**    
Create new invites.    

**GET /communities/{community_id}/invites**       

Retrieve pending invites for this community.



## Invites

**GET /invites/{invite_id}**      
Retrieve invite.    

**PUT /invites/{invite_id}**       

Update an invite. Accept/reject invite.     

<figure markdown>
![Image title](/docs/img/seta_api_communities_invites.png){ width="900" }
<figcaption> Community Invites</figcaption>
</figure>


## Resources
**POST  /resources/community/{community_id}**    
Create new resource por given community.    


**GET  /resources/community/{community_id}**    
Retrieve resources for a given community.  


**DELETE  /resources/{id}**    
Delete all resource entries.  

**GET /resources/{id}**   
Retrieve resource.

**PUT /resources/{id}**      

Update resource fields.

## Resource Contributors

**POST  /resources/{resource_id}/contributors**    
Create new contributor por given resource.    


**GET /resources/{resource_id}/contributors**      
Retrieve contributors of a given resource.

## Resource Change Requests

**GET /resources/change-requests/pending**      

Retrieve pending change requests for resources.

**POST  /resources/{resource_id}/change-requests**    
Add new change request for a resource field.   


**GET  /resources/{resource_id}/change-requests/{request-id}**    
Retrieve change request for the resource. 



**PUT  /resources/{resource_id}/change-requests/{request-id}**    
Approve/reject request

<figure markdown>
![Image title](/docs/img/seta_api_communities_resources.png){ width="900" }
<figcaption>Resources, Contributors, Change Requests</figcaption>
</figure>

## Community User Permissions

**GET  /permissions/community/{community_id}**    
Retrieve user-scope list for given community. 

**POST  /permissions/community/{community_id}/user/{user-id}**    
Replace all user permissions for the community. 

**GET  /permissions/community/{community_id}/user/{user-id}**    
Retrieve user-scopes for given community. 

<figure markdown>
![Image title](/docs/img/seta_api_communities_usr_permissions.png){ width="900" }
<figcaption>Community User Permissions</figcaption>
</figure>

