from flask import session
from interface import implements
from injector import inject

from seta_flask_server.repository.interfaces import IDbConfig, IUsersQueryBroker
from .db_users_broker import UsersBroker

from seta_flask_server.repository.models import SetaUser, SetaUserExt, ExternalProvider, UserClaim, AccountInfo
from seta_flask_server.infrastructure.constants import UserStatusConstants

from datetime import datetime
import pytz

class UsersQueryBroker(implements(IUsersQueryBroker)):
    @inject
    def __init__(self, config: IDbConfig) -> None:
        self.config = config
        self.db = config.get_db()
        self.collection = self.db["users"]

        self.usersBroker = UsersBroker(config)

    def get_all(self, load_scopes: bool = False) -> list[SetaUser]:
        users = self.collection.find({"email": {"$exists" : True}, "status": {"$ne": UserStatusConstants.Deleted}}, {"user_id": 1})

        seta_users = []
        for user in users:
            seta_user = self.usersBroker.get_user_by_id(user_id=user["user_id"], load_scopes=load_scopes)
            seta_users.append(seta_user)

        return seta_users

    def get_all_by_status(self, status: str) -> list[SetaUser]:
        users = self.collection.find({"email": {"$exists" : True}, "status": status}, {"user_id": 1})

        seta_users = []
        for user in users:
            seta_user = self.usersBroker.get_user_by_id(user_id=user["user_id"], load_scopes=False)
            seta_users.append(seta_user)

        return seta_users
    
    def get_account_details(self) -> list[AccountInfo]:
        users = self.collection.find({"email": {"$exists" : True}, "status": {"$ne": UserStatusConstants.Deleted}}, {"user_id": 1})
        rsa_keys =  [entry["user_id"] for entry in self.collection.find({"rsa_value": {"$exists" : True}}, {"user_id": 1})]

        app_pipeline = [
            {"$match":{ "app_name": {"$exists" : 1}}},
            {"$group" : { "_id" : "$user_id" , "count": {"$sum":1}}}
        ]
        apps = self.collection.aggregate(app_pipeline)

        session_pipeline = [
            {"$group" : { "_id" : "$user_id" , "last_active": {"$max": "$created_at"}}}
        ]
        sessions = self.db["sessions"].aggregate(session_pipeline)

        infos = []

        for user in users:
            user_id = user["user_id"]

            app_count = 0
            for app in apps:
                if user_id == app["_id"]:
                    app_count = app["count"]
                    break

            last_active = None
            for session in sessions:
                if user_id == session["_id"]:
                    last_active = session["last_active"]
                    break
            
            info = AccountInfo(user_id=user_id, 
                               has_rsa_key=(user_id in rsa_keys), 
                               applications_count=app_count,
                               last_active=last_active)

            infos.append(info)

        return infos
    
    def get_account_detail(self, user_id: str) -> AccountInfo:
        info = AccountInfo(user_id=user_id)

        info.has_rsa_key = (self.collection.count_documents({"user_id": user_id, "rsa_value": {"$exists" : True}}) > 0)
        info.applications_count = self.collection.count_documents({"user_id": user_id, "app_name": {"$exists" : True}})

        session_pipeline = [
            {"$match": {"user_id": user_id}},
            {"$group" : { "_id" : "$user_id" , "last_active": {"$max": "$created_at"}}}
        ]
        sessions = self.db["sessions"].aggregate(session_pipeline)
        
        if sessions:
            session = next(sessions, None)
            if session:
                info.last_active = session["last_active"]

        return info