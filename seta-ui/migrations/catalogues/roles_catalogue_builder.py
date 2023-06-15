class RolesCatalogueBuilder:

    @staticmethod
    def build_app_roles(catalogue_name: str):
        return [
            {
                "catalogue": catalogue_name,
                "code":  "Administrator",
                "name": "SysAdmin",
                "description": "Administrator of SeTA system",
                "default_scopes":["/seta/community/change_request/approve", 
                                  "/seta/resource/change_request/approve", 
                                  "/seta/community/create"]
            },
            {
                "catalogue": catalogue_name,
                "code":  "User",
                "name": "User",
                "description": "Regular user of SeTA system",
                "default_scopes":["/seta/community/create"]
            },
        ]
    
    @staticmethod
    def build_community_roles(catalogue_name: str):
        return [
            {
                "catalogue": catalogue_name,
                "code":  "CommunityOwner",
                "name": "Owner",
                "description": "Owner of community",
                "default_scopes":["/seta/community/owner", 
                                  "/seta/community/manager",
                                  "/seta/community/invite", 
                                  "/seta/community/membership/approve", 
                                  "/seta/resource/create"]
            },
            {
                "catalogue": catalogue_name,
                "code":  "CommunityManager",
                "name": "Manager",
                "description": "Manager of community",
                "default_scopes":["/seta/community/manager",
                                  "/seta/community/invite", 
                                  "/seta/community/membership/approve", 
                                  "/seta/resource/create"]
            },
            {
                "catalogue": catalogue_name,
                "code":  "ResourceCreator",
                "name": "Resource manager",
                "description": "Resource manager",
                "default_scopes":["/seta/resource/edit", 
                                  "/seta/resource/data/add", 
                                  "/seta/resource/data/delete"]
            },
            {
                "catalogue": catalogue_name,
                "code":  "CommunityMember",
                "name": "Guest",
                "description": "Regular community member",
                "default_scopes":[]
            },
        ]
