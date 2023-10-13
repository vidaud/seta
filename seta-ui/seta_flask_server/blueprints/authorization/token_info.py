from flask_restx import Api, Resource, reqparse

from flask import jsonify, abort, Blueprint
from flask_jwt_extended import decode_token
from flask import current_app as app

from http import HTTPStatus

from seta_flask_server.repository.interfaces import IUsersBroker, IResourcesBroker, ISessionsBroker
from injector import inject

from seta_flask_server.infrastructure.constants import AuthorizedArea, UserStatusConstants
from .logic.token_info_logic import get_resource_permissions


token_info = Blueprint("token_info", __name__)
authorization_api = Api(token_info,
               version="1.0",
               title="JWT token authorization",
               doc="/doc",
               description="JWT authorization for seta apis"               
               )
ns_authorization = authorization_api.namespace("", "Authorization endpoints")

request_parser = reqparse.RequestParser()
request_parser.add_argument("token",
                            location="json", 
                            required=True,
                            nullable=False,                                  
                            help="Encoded token")
request_parser.add_argument("auth_area", 
                            location="json",
                            required=False,
                            action='append',
                            help=f"Authorized areas, a list of {AuthorizedArea.List}")


@ns_authorization.route("/token_info", methods=['POST'])
class TokenInfo(Resource):
    @inject
    def __init__(self, usersBroker: IUsersBroker, resourcesBroker: IResourcesBroker, sessionBroker: ISessionsBroker, api=None, *args, **kwargs):
        self.usersBroker = usersBroker
        self.resourcesBroker = resourcesBroker
        self.sessionBroker = sessionBroker
        
        super().__init__(api, *args, **kwargs)
    
    @ns_authorization.doc(description="Returns the decoded token including user community permissions",
            responses={int(HTTPStatus.OK): 'Decoded token as json',
                       int(HTTPStatus.BAD_REQUEST): 'No token provided',
                       int(HTTPStatus.UNAUTHORIZED): 'Unauthorized JWT',
                       int(HTTPStatus.UNPROCESSABLE_ENTITY): 'Invalid token',
                       })
    @ns_authorization.expect(request_parser, validate=True)
    def post(self):
        '''Decodes the token and builds the community scopes for the user identity'''
        
        r = authorization_api.payload
        token = r["token"]
        areas = r["auth_area"]
                        
        decoded_token = None
        try:
            decoded_token = decode_token(encoded_token=token)
            
            jti = decoded_token.get("jti")
            if jti:
                if self.sessionBroker.session_token_is_blocked(jti):
                    abort(HTTPStatus.UNAUTHORIZED, "Blocked token")
                    
            if areas is not None and AuthorizedArea.Resources in areas:
                #get user permissions for all resources
                seta_id = decoded_token.get("seta_id")
                if seta_id:
                    user = self.usersBroker.get_user_by_id(seta_id["user_id"])
                    if user.status != UserStatusConstants.Active:
                        abort(HTTPStatus.UNAUTHORIZED, "User inactive!")
                        
                    decoded_token["resource_permissions"] = get_resource_permissions(user=user, resourcesBroker=self.resourcesBroker)
        
        except Exception as e:
            message = str(e)
            app.logger.exception(message)
            abort(HTTPStatus.UNAUTHORIZED, message)
        
        app.logger.debug(decoded_token)
        return jsonify(decoded_token)