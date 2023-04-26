from interface import implements
from datetime import datetime
import pytz

from injector import inject
from seta_flask_server.repository.interfaces import IDbConfig, IAppsBroker

from seta_flask_server.repository.models import SetaApplication, SetaUser, RsaKey

class AppsBroker(implements(IAppsBroker)):
    @inject
    def __init__(self, config: IDbConfig) -> None:        
       self.db = config.get_db()
       self.collection = self.db["users"]
       
    def get_all_by_parent_id(self, parent_id: str) -> list[SetaApplication]:
        filter = {"parent_user_id": parent_id, "app_name": {"$exists" : True}}
        apps = self.collection.find(filter)
        
        return [SetaApplication.from_db_json(a) for a in apps]
    
    def get_by_parent_id_and_name(self, parent_id: str, name: str) -> SetaApplication:
        filter = {"parent_user_id": parent_id, "app_name": name}
        
        app = self.collection.find_one(filter)
        
        if app is None:
            return None
        
        return SetaApplication.from_db_json(app)
    
    def app_exists(self, parent_id: str, name: str) -> bool:
        filter = {"parent_user_id": parent_id, "app_name": name}
                
        return self.collection.count_documents(filter, limit = 1) > 0
    
    def get_by_user_id(self, user_id: str) -> SetaApplication:
        filter = {"user_id": user_id, "app_name": {"$exists" : True}}
        
        app = self.collection.find_one(filter)
        
        if app is None:
            return None
        
        return SetaApplication.from_db_json(app)
    
    def create(self, app: SetaApplication, copy_parent_scopes: True, copy_parent_rsa: bool = False):
        
        #double check the name uniqueness
        if self.app_exists(parent_id=app.parent_user_id, name=app.app_name):
            return
        
        now = datetime.now(tz=pytz.utc)
        user_id = SetaUser.generate_uuid()
        
        seta_user = SetaUser(user_id=user_id, user_type="application", email=None, status='active', created_at=now)
        app.user_id = user_id   
        
        rsa_key = None
        resource_scopes = None
        
        if copy_parent_scopes:
            cFilter = {"user_id": app.parent_user_id, "resource_scope":{"$exists" : True}}
            resource_scopes =  self.collection.find(cFilter)
            
            if resource_scopes:
                for rs in resource_scopes:
                    rs["user_id"] = user_id
        
        if copy_parent_rsa:
            q = {"user_id": app.parent_user_id, "rsa_value": {"$exists" : True}}
            parent_rsa = self.collection.find_one(q)
            
            if parent_rsa:
                rsa_key = RsaKey(user_id=user_id, 
                                 rsa_value=parent_rsa["rsa_value"],
                                 created_at=now)
        
        with self.db.client.start_session(causal_consistency=True) as session:
            #insert user record
            self.collection.insert_one(seta_user.to_json(), session=session)
            
            #insert app rescord
            self.collection.insert_one(app.to_json(), session=session)
            
            #insert rsa_key
            if rsa_key is not None:
                self.collection.insert_one(rsa_key.to_json(), session=session)
                
            if resource_scopes:
                self.collection.insert_many(resource_scopes, session=session)        
        
    
    def update(self, old: SetaApplication, new: SetaApplication):  
        
        if not new.app_name:
            new.app_name = old.app_name
            
        if new.app_name != old.app_name:
            #double check the name uniqueness
            if self.get_by_parent_id_and_name(user_id=new.parent_user_id, name=new.app_name):
                return
              
        filter = {"parent_user_id": old.parent_user_id, "app_name": old.app_name}
        set = {"$set": {"app_name": new.app_name, "app_description": new.app_description}}
        
        self.collection.update_one(filter, set)