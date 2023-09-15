class ClaimTypeConstants:
    RoleClaimType = "roles"
    
class ResourceScopeConstants:    
    Edit = "/seta/resource/edit"
    DataAdd = "/seta/resource/data/add"
    DataDelete = "/seta/resource/data/delete"
    
class CommunityStatusConstants:
    Active = "active"
    Blocked = "blocked"

class ResourceStatusConstants:
    Active = "active"
    Blocked = "blocked" 

class ResourceTypeConstants:
    Discoverable = "discoverable"
    Representative = "representative" 
    
class AuthorizedArea:
    Resources = "resources"    
    List=[Resources]
    
class UserStatusConstants:
    Active = "active"
    Disabled = "disabled"
    Blocked = "blocked"
    Deleted = "deleted"    