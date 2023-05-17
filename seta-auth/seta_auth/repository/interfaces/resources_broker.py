from interface import Interface

class IResourcesBroker(Interface):    
    def get_all_queryable_by_user_id(self, user_id:str) -> list[str]:
        pass