class ScopesCatalogueBuilder:

    @staticmethod
    def build_system_scopes(catalogue_name: str) -> list:
        return [
            {
                "catalogue": catalogue_name,
                "code":  "/seta/community/create",
                "name": "Create community",
                "description": "Create community having all scopes assigned by default",
                "elevated": False
            },
            {
                "catalogue": catalogue_name,
                "code": "/seta/community/change_request/approve",
                "name": "Approve community CRs",
                "description": "Approve change requests for communities",
                "elevated": True
            },
            {
                "catalogue": catalogue_name,
                "code": "/seta/resource/change_request/approve",
                "name": "Approve resource CRs",
                "description": "Approve change request for resources",
                "elevated": True
            },
        ]
    
    @staticmethod
    def build_community_scopes(catalogue_name: str) -> list:
        return [
            {
                "catalogue": catalogue_name,
                "code": "/seta/community/owner",
                "name": "Community owner",
                "description": "Indicates community ownership; only an owner can delete a community along with all its resources data."
            },
            {
                "catalogue": catalogue_name,
                "code": "/seta/community/manager",
                "name": "Community manager",
                "description": "Management of community members and their permissions."
            },
            {
                "catalogue": catalogue_name,
                "code": "/seta/community/invite",
                "name": "Send invite",
                "description": "Send invites to registered email accounts to join the community."
            },
            {
                "catalogue": catalogue_name,
                "code": "/seta/community/membership/approve",
                "name": "Approve membership",
                "description": "Approve new membership requests for the community."
            },
            {
                "catalogue": catalogue_name,
                "code": "/seta/resource/create",
                "name": "Create resources",
                "description": "Create resources for data ingestion attached to the community."
            },
        ]
    
    @staticmethod
    def build_resource_scopes(catalogue_name: str) -> list:
        return [
            {
                "catalogue": catalogue_name,
                "code": "/seta/resource/edit",
                "name": "Edit resource",
                "description": "Edit resource properties, raise change request for protected properties (ex: limits)."
            },
            {
                "catalogue": catalogue_name,
                "code": "/seta/resource/data/add",
                "name": "Add data",
                "description": "Upload documents for the resource."
            },
            {
                "catalogue": catalogue_name,
                "code": "/seta/resource/data/delete",
                "name": "Delete data",
                "description": "Delete documents or drop entire resource."
            },
        ]
