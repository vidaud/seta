from flask_restx import Api, Resource, fields
from flask import abort, Blueprint
from flask_jwt_extended import create_access_token, create_refresh_token
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_cors import CORS
from flask import current_app

from seta_auth.infrastructure.helpers import validate_public_key
from seta_auth.infrastructure.constants import UserStatusConstants

from injector import inject
from seta_auth.repository.interfaces import IUsersBroker, IRsaKeysBroker

from http import HTTPStatus

token_auth = Blueprint('token_auth', __name__)
CORS(token_auth)

auth_api = Api(token_auth,
               version="1.0",
               title="JWT token authentication",
               doc="/doc",
               description="JWT authetication for user and guests"
               )
ns_auth = auth_api.namespace("", "Authentication endpoints")

AUTH_PROVIDERS=['ECAS','GitHub','SeTA']

auth_data = ns_auth.parser()
auth_data.add_argument("username",
                        required=True,
                        nullable=False,
                        case_sensitive=False,
                        location='json',
                        help="User or application name")
auth_data.add_argument("provider",
                        choices=AUTH_PROVIDERS,
                        case_sensitive=False,
                        required=True,
                        nullable=False,
                        location='json',
                        help="User or application name")
auth_data.add_argument("rsa_original_message",
                        required=True,
                        nullable=False,
                        location='json',
                        help="Any random message")
auth_data.add_argument("rsa_message_signature",
                        required=True,
                        nullable=False,
                        location='json',
                        help="Signature using hex format, string of hexadecimal numbers.")

access_model = ns_auth.model("AccessToken",
                           {
                               "access_token": fields.String(description="JWT access token")
                           })
auth_model = ns_auth.inherit("AuthTokens", access_model,{
                    "refresh_token": fields.String(description="JWT refresh token")
                })

@ns_auth.route("/user/token", methods=['POST'])
class JWTUserToken(Resource):    
    @inject
    def __init__(self, usersBroker: IUsersBroker, rsaBroker: IRsaKeysBroker, api=None, *args, **kwargs):
        self.usersBroker = usersBroker
        self.rsaBroker = rsaBroker
        super().__init__(api, *args, **kwargs)

    @ns_auth.doc(description="JWT token for users",
            responses={int(HTTPStatus.OK): 'Success',
                       int(HTTPStatus.UNAUTHORIZED): 'Invalid User',
                       int(HTTPStatus.FORBIDDEN): 'Invalid Signature'}) 
    @ns_auth.expect(auth_data)   
    @ns_auth.marshal_with(auth_model)
    def post(self):
        args = auth_data.parse_args()
            
        user = self.usersBroker.get_user_by_provider(provider_uid=args["username"].lower(), provider=args["provider"].lower())
        if not user or user.status != UserStatusConstants.Active:
            abort(HTTPStatus.UNAUTHORIZED, "Invalid user")            
            
        public_key = self.rsaBroker.get_rsa_key(user.user_id)
        if public_key is None:
            #return 'Public Key Unset', 503            
            current_app.logger.error("Public Key Unset for user id " + user.user_id)
            abort(HTTPStatus.UNAUTHORIZED, "Invalid user")
            
        if not validate_public_key(public_key, args['rsa_original_message'], args['rsa_message_signature']):
            #return 'Invalid Signature', 502     
            abort(HTTPStatus.FORBIDDEN, "Invalid Signature")
            
        identity = user.to_identity_json()
        additional_claims = {
                "role": user.role,
                "user_type": user.user_type
            }       
       
        access_token = create_access_token(identity=identity, fresh=True, additional_claims=additional_claims)
        refresh_token = create_refresh_token(identity=identity, additional_claims=additional_claims)
                
        return {"access_token": access_token, "refresh_token": refresh_token}

refresh_parser = ns_auth.parser()
refresh_parser.add_argument("Authorization", location="headers", required=False, type="apiKey", help="Bearer JWT refresh token")
#refresh_parser.add_argument("X-CSRF-TOKEN", location="headers", required=False, type="string")

@ns_auth.route("/refresh", methods=['POST']) 
class JWTRefreshToken(Resource):
    @inject
    def __init__(self, usersBroker: IUsersBroker, api=None, *args, **kwargs):
        self.usersBroker = usersBroker
        super().__init__(api, *args, **kwargs)
    
    
    @ns_auth.doc(description="JWT refresh access token",
            responses={int(HTTPStatus.OK): 'Success', int(HTTPStatus.UNAUTHORIZED): "Refresh token verification failed"})
    @ns_auth.expect(refresh_parser)
    @ns_auth.marshal_with(access_model)        
    @jwt_required(refresh=True)
    def post(self):
        identity = get_jwt_identity()              
        
        user = self.usersBroker.get_user_by_id(identity["user_id"])
            
        if user is None or user.status != UserStatusConstants.Active:
            abort(HTTPStatus.UNAUTHORIZED, "Invalid User")
            
        #other additional_claims are added via additional_claims_loader method: factory->add_claims_to_access_token
        additional_claims = {
                "role": user.role
            }
        
        access_token = create_access_token(identity=identity, fresh=False, additional_claims=additional_claims)
        return {"access_token": access_token}