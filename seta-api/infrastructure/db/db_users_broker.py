from .db_config import get_db
from werkzeug.local import LocalProxy
from flask import current_app as app

db = LocalProxy(get_db)

def getDbUser(username):
    """ Find user in the the database and return: exists(bool), role(str), public_key(str), source_limit(dict) """
    
    usersCollection = db["users"]
    user_key = usersCollection.find_one({"username": username, "is-rsa-key": True, "is-public-key": True, "is-private-key": False})
    
    if user_key is None:
        return False, None, None, None
        
    public = user_key.get('value')
    
    user_info = usersCollection.find_one({"username": username, "email":{"$exists" : True}})    
    role = user_info.get('role', 'user')
    # TODO update source and limit with mongodb fields
    source_limit = {"source": username, "limit": 5}
    
    return True, role, public, source_limit
    