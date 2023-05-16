# Community Memberships

**POST  /communities/{community_id}/memberships**    
Add new member to an opened community.    


<figure markdown>
![Image title](/docs/img/post_communities_community_id_memberships.png){ width="900" }
<figcaption>POST /communities{community_id} memberships</figcaption>
</figure>


<!-- ![Screenshot](/docs/img/post_communities_community_id_memberships.png){ width="900" } -->


#### GET /communities/{community_id}/memberships
Retrieve membership list for this community.

<!-- ![Screenshot](/docs/img/get_communities_id_memberships.png){ width="900" } -->


#### DELETE /communities/{community_id}/memberships/{user_id}

Remove membership.

<!-- ![Screenshot](/docs/img/delete_communities_id_memberships_usr_id.png){ width="900" } -->


#### GET /communities/{community_id}/memberships/{user_id}
Retrieve user membership

<!-- ![Screenshot](/docs/img/get_communities_id_memberships_usr_id.png){ width="900" } -->


#### PUT /communities/{community_id}/memberships/{user_id}
Update membership fields.

<!-- ![Screenshot](/docs/img/put_communities_id_memberships_usr_id.png){ width="900" } -->



#### POST  /communities/{community_id}/requests    
Add new request for the community for the authorized user.    

<!-- ![Screenshot](/docs/img/post_communities_community_id_requests.png){ width="900" } -->


#### GET /communities/{community_id}/requests
Retrieve request list for this community.

<!-- ![Screenshot](/docs/img/get_communities_id_requests.png){ width="900" } -->



#### GET /communities/{community_id}/requests/{user_id}
Retrieve user request for the community.

<!-- ![Screenshot](/docs/img/get_communities_id_requests_usr_id.png){ width="900" } -->


#### PUT /communities/{community_id}/requests/{user_id}
Approve/reject request.

<!-- ![Screenshot](/docs/img/put_communities_id_requests_usr_id.png){ width="900" } -->