from flask_restx import Model, fields

from seta_flask_server.infrastructure.constants import (DiscoverCommunityStatus, CommunityMembershipConstants)
from .invite_dto import invite_model
from .membership_dto import request_model

discover_community_model = Model("DiscoverCommunity",
        {
            "community_id": fields.String(description="Community identifier"),
            "title": fields.String(description="Community title"),
            "description": fields.String(description="Community relevant description"),
            "membership": fields.String(description="The membership status", enum=CommunityMembershipConstants.List),            
            "status": fields.String(description="The community status", enum=DiscoverCommunityStatus.List),
            "created_at": fields.DateTime(description="Creation date"),
            "pending_invite": fields.Nested(model=invite_model, description="Pending invite, in case of 'invited' status", skip_none=True),
            "membership_request": fields.Nested(model=request_model, description="Pending request, in case of 'pending' or 'rejected' status", skip_none=True)
        })

discover_resource_model =  Model("DiscoverResource",
        {
            "resource_id": fields.String(description="Resource identifier"),
            "community_id": fields.String(description="Community identifier"),
            "community_title": fields.String(description="Community title"),
            "title": fields.String(description="Resource title"),
            "abstract": fields.String(description="Resource relevant description"),
            "searchable": fields.Boolean(description="Is searchable for the current user"),
            "created_at": fields.DateTime(description="Creation date")
        })