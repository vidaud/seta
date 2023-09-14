from interface import Interface

class IResourcesBroker(Interface):    
    def get_all_queryable_by_user_id(self, user_id:str) -> list[str]:
        '''Retrieve all resource ids that can be queried by user id'''
        pass

    def get_all_by_user_id_and_type(self, user_id:str, type: str) -> list[str]:
        '''Retrieve all resource ids within user memberships filter by type'''
        pass