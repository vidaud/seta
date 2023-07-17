from interface import implements

from injector import inject
from seta_flask_server.repository.interfaces.config import IDbConfig

from datetime import datetime
import pytz

from flask import current_app

from seta_flask_server.repository.interfaces import INotificationsBroker
from seta_flask_server.infrastructure.constants import InviteStatusConstants, RequestStatusConstants
from seta_flask_server.infrastructure.scope_constants import CommunityScopeConstants

class NotificationsBroker(implements(INotificationsBroker)):
    @inject
    def __init__(self, config: IDbConfig) -> bool:
        self.config = config
        
        self.db = config.get_db()

    def count_pending_invites(self, user_id: str) -> int:
        collection = self.db["communities"]
        now = datetime.now(tz=pytz.utc)

        filter = {
                    "invited_user": user_id, 
                    "status": InviteStatusConstants.Pending, 
                    "expire_date": {"$gte": now},
                    "invite_id": {"$exists" : True}
                }
        
        return collection.count_documents(filter)

    def count_membership_requests(self, user_id: str) -> int:
        
        #get managed communities by manager or owner scopes:
        filter = {"user_id": user_id, "community_scope":{"$in": [CommunityScopeConstants.Owner, CommunityScopeConstants.Manager]}}
        result = self.db["users"].find(filter, {"community_id": 1})
        community_ids = [i["community_id"] for i in result]

        if len(community_ids) == 0:
            return 0

        #count pending request for community_ids:
        filter =  {
            "community_id": {"$in": [c for c in community_ids]}, 
            "requested_by": {"$exists" : True}, 
            "field_name": {"$exists" : False},
            "status": RequestStatusConstants.Pending
            }
        
        return self.db["communities"].count_documents(filter)

    def count_change_requests(self) -> int:
        #count community change requests
        filter =  {"status": RequestStatusConstants.Pending, "field_name": {"$exists" : 1}}
        count = self.db["communities"].count_documents(filter)

        #count resource change requests
        filter =  {"status": RequestStatusConstants.Pending, "request_id": {"$exists" : 1}}
        count += self.db["resources"].count_documents(filter)

        return count

