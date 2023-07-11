from interface import implements

from injector import inject
from seta_flask_server.repository.interfaces.config import IDbConfig

from datetime import datetime, timedelta
import pytz
import shortuuid

from seta_flask_server.repository.models import CommunityInviteModel, MembershipModel, EntityScope
from seta_flask_server.repository.interfaces import ICommunityInvitesBroker

from seta_flask_server.infrastructure.constants import (InviteStatusConstants, INVITE_EXPIRE_DAYS, 
                                                        CommunityRoleConstants, CommunityStatusConstants)
from seta_flask_server.infrastructure.scope_constants import CommunityScopeConstants
from .db_membership_broker import MembershipsBroker

class CommunityInvitesBroker(implements(ICommunityInvitesBroker)):
    @inject
    def __init__(self, config: IDbConfig) -> bool:
        self.config = config
        
        self.db = config.get_db()
        self.collection = self.db["communities"]
        self.membershipBroker = MembershipsBroker(config = self.config)
       
    def create(self, model: CommunityInviteModel) -> bool:
        '''Create community invite json objects in mongo db'''
        
        if self._user_has_pending_invite_for_community(user_id=model.invited_user, community_id=model.community_id):
            return False
        
        if self.membershipBroker.membership_exists(community_id=model.community_id, user_id=model.invited_user):
            return False
        
        now = datetime.now(tz=pytz.utc)
        
        model.invite_id = CommunityInvitesBroker.generate_uuid()
        model.status = InviteStatusConstants.Pending
        model.initiated_date = now
        model.expire_date = now + timedelta(days=INVITE_EXPIRE_DAYS)
        
        self.collection.insert_one(model.to_json())
        
        return True

    def update(self, model: CommunityInviteModel) -> None:
        '''Update invite'''
        
        now = datetime.now(tz=pytz.utc)
        model.modified_at = now
        
        filter={"invite_id": model.invite_id}
        uq={"$set": model.to_json_update() }
        
        with self.db.client.start_session(causal_consistency=True) as session:
            self.collection.update_one(filter, uq, session=session)     
                               
            #add membership
            if model.status == InviteStatusConstants.Accepted:
                invite = self.get_by_invite_id(model.invite_id)
                
                membership = MembershipModel(community_id=invite.community_id, user_id=invite.invited_user, 
                                             role=CommunityRoleConstants.Member, join_date=now, status=CommunityStatusConstants.Active)
            
                self.membershipBroker.create_membership(model=membership)
                    

    def get_by_invite_id(self, invite_id: str) -> CommunityInviteModel:
        dict = self.collection.find_one({"invite_id": invite_id})
        
        if dict is None:
            return None
        
        model = CommunityInviteModel.from_db_json(dict) 
        
        #check if the invited expired and set status as 'Expired' if yes
        now = datetime.now(tz=pytz.utc)
        if model.expire_date.replace(tzinfo=pytz.utc) < now:
            model.status = InviteStatusConstants.Expired
            self.update(model)
               
        return model
    
    def get_all_by_status_and_invited_user_id(self, user_id: str, status: str) -> list[CommunityInviteModel]:
        filter = {"invited_user": user_id, "status": status, "invite_id": {"$exists" : True}}
        invites = self.collection.find(filter)
        
        return [CommunityInviteModel.from_db_json(c) for c in invites]
    
    def get_all_by_initiated_by(self, user_id: str) -> list[CommunityInviteModel]:
        filter = {"initiated_by": user_id, "invite_id": {"$exists" : True}}
        invites = self.collection.find(filter)
        
        return [CommunityInviteModel.from_db_json(c) for c in invites]
    
    def get_all_by_status_and_community_id(self, community_id: str, status: str) -> list[CommunityInviteModel]:
        filter = {"community_id": community_id, "status": status, "invite_id": {"$exists" : True}}
        invites = self.collection.find(filter)
        
        return [CommunityInviteModel.from_db_json(c) for c in invites]
    
    def _user_has_pending_invite_for_community(self, user_id: str, community_id: str) -> bool:
        filter = {"invited_user": user_id, "community_id": community_id, "status": InviteStatusConstants.Pending, "invite_id": {"$exists" : True}}
        
        exists_count = self.collection.count_documents(filter)
        return exists_count > 0
    
    @staticmethod
    def generate_uuid() -> str:
        return shortuuid.ShortUUID().random(length=20)     