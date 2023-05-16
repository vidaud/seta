
# Community Change Requests

**GET /communities/change-requests/pending**     
Retrieve pending change requests for communitites.    


<!-- ![Screenshot](/docs/img/get_communities_change_request_pending.png){ width="900" } -->

<figure markdown>
![Image title](/docs/img/get_communities_change_request_pending.png){ width="900" }
<figcaption>GET /communities change request</figcaption>
</figure>


**POST /communities/{community_id}/change-requests/**      
Add new change request for a community field.    
<!-- ![Screenshot](/docs/img/post_communities_community_id.png){ width="900" } -->
<!-- ![Screenshot](/docs/img/post_communities_community_id_result.png){ width="900" } -->

<figure markdown>
![Image title](/docs/img/post_communities_community_id.png){ width="900" }
<figcaption>POST /communities{community_id} change requests</figcaption>
</figure>

<figure markdown>
![Image title](/docs/img/post_communities_community_id_result.png){ width="900" }
<figcaption>POST /communities{community_id} change requests (result)</figcaption>
</figure>



**GET /communities/{community_id}/change-requests/{request_id}**      

Retrieve change request for the community.     
<figure markdown>
![Image title](/docs/img/get_communities_change_request_request_id.png){ width="900" }
<figcaption>GET /communities{community_id} change requests{request_id}</figcaption>
</figure>

<!-- ![Screenshot](/docs/img/get_communities_change_request_request_id.png){ width="900" } -->


**PUT /communities/{community_id}/change-requests/{request_id}**     

Approve/reject request  
<figure markdown>
![Image title](/docs/img/put_communities_id_change_request_id.png){ width="900" }
<figcaption>PUT /communities{community_id} change requests{request_id}</figcaption>
</figure>  
<!-- ![Screenshot](/docs/img/put_communities_id_change_request_id.png){ width="900" } -->