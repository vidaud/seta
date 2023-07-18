# SETA-API Communities

The SeTA API Communities exposes the data and functionality of the management in the communities. It has various methods that can be performed on them over HTTP, like *GET, POST, PUT, and DELETE*. 

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

### POST /communities
Create a new community and add this user as a member with elevated scopes.     
Any new user added to the system have the '/seta/community/create' scope, but it can be revoked by the sysadmin.         

### GET /communities
Retrive the communities where this authenticated user is a member, available for any user.         

### GET /communities/{id}
Retrieve community details, available to any user.    

### DELETE /communities/{id}
Delete community, available to community managers.           

### PUT /communities/{id}  
Update a community, available to community managers.       

<figure markdown>
![Image title](/docs/img/seta_api_communities.png)
<figcaption>Communities</figcaption>
</figure>

## Community Change Requests

### POST /communities/{community_id}/change-requests/
Create a community change request, available to community managers.      

### GET /communities/{community_id}/change-requests/
Retrieve all change requests for a community and its resources, available to community managers.         

### GET /communities/{community_id}/change-requests/{request_id}
Retrieve a community change request, available to sysadmins and initiator.      

<figure markdown>
![Image title](/docs/img/seta_api_communities_change_requests.png)
<figcaption> Communities Change Requests</figcaption>
</figure>

## Community Memberships

### POST /communities/{community_id}/memberships
Create a member for an opened community, available to any user.        

### GET /communities/{community_id}/memberships
Retrieve community memberships, available to any member of this community.                            

### GET /communities/{community_id}/memberships/{user_id}
Retrieve membership, available to community managers.                                  

### DELETE /communities/{community_id}/memberships/{user_id}
Remove a membership, available to community managers.                           

### PUT /communities/{community_id}/memberships/{user_id}
Update a community membership, available to community managers.                      

<figure markdown>
![Image title](/docs/img/seta_api_communities_memberships.png)
<figcaption> Community Memberships</figcaption>
</figure>

## Community Membership Requests

### POST /communities/{community_id}/requests
Create a community membership request, available to any user.       

### GET /communities/{community_id}/requests
Retrieve pending community requests, available to community managers.                         

### GET /communities/{community_id}/requests/{user_id}
Retrieve user request, available to community managers.                          

### PUT /communities/{community_id}/requests/{user_id}
Approve/reject a membership request, available to community managers.                       

<figure markdown>
![Image title](/docs/img/seta_api_communities_membership_request.png)
<figcaption> Community Membership Requests</figcaption>
</figure>

## Community My Membership
### GET /communities/membership-requests
Retrieve my membership requests, available to any user.                     

### GET /communities/{community_id}/membership
Retrieve membership, available to community managers.                       

### DELETE /communities/{community_id}/membership
Remove a membership, available to any community member.                    

<figure markdown>
![Image title](/docs/img/seta_api_communities_my_membership.png)
<figcaption> Community My Membership</figcaption>
</figure>

## Community Invites

### POST /communities/{community_id}/invites
Create invites, available to community managers.                   

### GET /communities/{community_id}/invites
Retrieve pending invites, available to community managers.                  

## Community Resources

### POST /communities/{community_id}/resources
Create resource, available to community members.      

### GET /communities/{community_id}/resources
Retrieve community resources, available to any user.                      

<figure markdown>
![Image title](/docs/img/seta_api_communities_invites.png)
<figcaption>Community Invites and Community Resources</figcaption>
</figure>

## Invites
### GET /invites/
Retrieve my pending invites, available to any user.                

### GET /invites/{invite_id}
Retrieve invite, available to initiator and invitee.       

### PUT /invites/{invite_id}
Update an invite, available to invitee.     

## Resources
### GET /resources/
Retrieve list of accessible resources for this authorized user.             

### GET /resources/{id}
Retrieve resource, available to any user.          

### DELETE /resources/{id}
Delete resource, available to resource editor and community managers.       

### PUT /resources/{id}
Update a resource, available to resource editor and community managers.                  


<figure markdown>
![Image title](/docs/img/communities_api_invites_resources.png)
<figcaption>Invites and  Resources</figcaption>
</figure>

## Resource Change Requests

### POST /resources/{resource_id}/change-requests
Create a resource change request, available to resource editors.       

### GET /resources/{resource_id}/change-requests
Retrieve all change requests for a resource, available to community managers and resource editors.                  

### GET /resources/{resource_id}/change-requests/{request-id}
Retrieve resource request, available to sysadmins and initiator.                  


<figure markdown>
![Image title](/docs/img/seta_api_communities_resource_change_request.png)
<figcaption>Resources Change Requests</figcaption>
</figure>


## Community User Permissions

### GET /permissions/community/{community_id}
Retrieve all community user permissions, available to community managers.                    

### POST /permissions/community/{community_id}/user/{user-id}
Add/Replace user permissions, available to community managers.                            

### GET /permissions/community/{community_id}/user/{user-id}
Retrieve user permissions for community, available to community managers.                


<figure markdown>
![Image title](/docs/img/seta_api_communities_usr_permissions.png)
<figcaption>Community User Permissions</figcaption>
</figure>

## Resource User Permissions

### GET /permissions/resource/{resource_id}
Retrieve all resource permissions, available to community managers.                    

### POST /permissions/resource/{resource_id}/user/{user-id}
Add/Replace user permissions, available to community managers.                    

### GET /permissions/resource/{resource_id}/user/{user-id}
Retrieve user permissions for resource, available to community managers.                


## Discovery

### GET /discovery/communities
Discover communities, accessible to any user.                    

### GET /discovery/resources
Discover resources, accessible to any user.                

<figure markdown>
![Image title](/docs/img/seta_api_communities_resource_discovery.png)
<figcaption>Resource User Permissions and Discovery</figcaption>
</figure>

