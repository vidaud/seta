from flask_restx import Api
from flask import Blueprint
from .community import communities_ns
from .community_membership import membership_ns
from .community_change_requests import community_change_request_ns
from .invites import invite_ns
from .community_invite import community_invite_ns
from .resource import resources_ns
from .resource_contributor import resource_contributors_ns
from .resource_change_request import resource_change_request_ns

authorizations = {
    'Bearer': {
        'type': 'apiKey',
        'in': 'header',
        'name': 'Authorization',
        'description': "Type in the *'Value'* input box below: **'Bearer &lt;JWT&gt;'**, where JWT is the token"
    },
    'CSRF': {
        'type': 'apiKey',
        'in': 'header',
        'name': 'X-CSRF-TOKEN',
        'description': "Type in the *'Value'* input box below: **'&lt;CSRF&gt;'**, where CSRF is the CSRF token"
    }
}

communities_bp_v1 = Blueprint('communities-api-v1', __name__)

api = Api(communities_bp_v1,
         title='SeTA Communities API',
         version='1.0',
         description='SeTA Communities API',
         doc='/doc',
         authorizations=authorizations
         )

api.add_namespace(communities_ns, path="/communities")
api.add_namespace(community_change_request_ns, path="/communities")
api.add_namespace(membership_ns, path="/communities")
api.add_namespace(community_invite_ns, path="/communities")
api.add_namespace(invite_ns, path="/invites")
api.add_namespace(resources_ns, path="/resources")
api.add_namespace(resource_contributors_ns, path="/resources")
api.add_namespace(resource_change_request_ns, path="/resources")