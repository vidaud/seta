
# Resources
### POST  /resources/community/{community_id}    
Create new resource por given community.    

![Screenshot](/docs/img/post_resources_community_id.png){ width="900" }

![Screenshot](/docs/img/post_resources_community_id_result.png){ width="900" }

### GET  /resources/community/{community_id}    
Retrieve resources for a given community.  

![Screenshot](/docs/img/get_resources_community_id.png){ width="900" }
![Screenshot](/docs/img/get_resources_community_id_results.png){ width="900" }


### DELETE  /resources/{id}    
Delete all resource entries.  

![Screenshot](/docs/img/delete_resources_id.png){ width="900" }

### GET /resources/{id}
Retrieve resource.
![Screenshot](/docs/img/get_invites_id.png){ width="900" }

### PUT /resources/{id} 

Update resource fields.

![Screenshot](/docs/img/put_resources_id.png){ width="900" }
![Screenshot](/docs/img/put_resources_id_results.png){ width="900" }

## Resource Contributors

### POST  /resources/{resource_id}/contributors    
Create new contributor por given resource.    

![Screenshot](/docs/img/post_resources_id_contributors.png){ width="900" }

![Screenshot](/docs/img/post_resources_id_contributors_result.png){ width="900" }

### GET /resources/{resource_id}/contributors
Retrieve contributors of a given resource.
![Screenshot](/docs/img/get_resources_id_contributors.png){ width="900" }


## Resource Change Requests

### GET /resources/change-requests/pending

Retrieve pending change requests for resources.

![Screenshot](/docs/img/get_resources_change_requests_pending.png){ width="900" }

### POST  /resources/{resource_id}/change-requests    
Add new change request for a resource field.   

![Screenshot](/docs/img/post_resources_id_change-requests.png){ width="900" }


### GET  /resources/{resource_id}/change-requests/{request-id}    
Retrieve change request for the resource. 

![Screenshot](/docs/img/get_resources_id_change_requests_id.png){ width="900" }



### PUT  /resources/{resource_id}/change-requests/{request-id}    
Approve/reject request

![Screenshot](/docs/img/put_resources_id_change_requests_id.png){ width="900" }