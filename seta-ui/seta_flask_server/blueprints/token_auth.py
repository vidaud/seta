from flask_restx import Api, Resource, fields
from flask import jsonify, abort, make_response, Blueprint
from flask_jwt_extended import create_access_token, create_refresh_token
from flask_jwt_extended import set_access_cookies, set_refresh_cookies
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_cors import CORS

from seta_flask_server.infrastructure.helpers import validate_public_key

from injector import inject
from seta_flask_server.repository.interfaces import IUsersBroker, IRsaKeysBroker

from datetime import timedelta



#do not use JWT_ACCESS_TOKEN_EXPIRES & JWT_REFRESH_TOKEN_EXPIRES from config
TOKEN_EXPIRES_DELTA = timedelta(minutes=15)
REFRESH_TOKEN_EXPIRES_DELTA = timedelta(minutes=60)

token_auth = Blueprint('token_auth', __name__)
CORS(token_auth)
auth_api = Api(token_auth,
               version="1.0",
               title="JWT token authentication",
               doc="/doc",
               description="JWT authetication for user and guests"
               )
ns_auth = auth_api.namespace("", "Authentication endpoints")


auth_data = ns_auth.model(
    "token_params",
    {'user_id': fields.String(required=True, description="SETA generated user id"),
     'rsa_original_message': fields.String(required=True, description="Original message"),
     'rsa_message_signature': fields.String(required=True, description="Signature using hex format, string of hexadecimal numbers.")
     }
)

@ns_auth.route("/user/token", methods=['POST'])
class JWTUserToken(Resource):    
    @inject
    def __init__(self, usersBroker: IUsersBroker, rsaBroker: IRsaKeysBroker, api=None, *args, **kwargs):
        self.usersBroker = usersBroker
        self.rsaBroker = rsaBroker
        super().__init__(api, *args, **kwargs)

    @ns_auth.doc(description="JWT token for users",
            responses={200: 'Success',
                       501: 'Invalid User',
                       502: 'Invalid Signature',
                       503: 'Public Key Unset'})
    @ns_auth.expect(auth_data, validate=True)
    def post(self):
        args = auth_api.payload
        
        user_id = args['user_id']
        user = self.usersBroker.get_user_by_id(user_id)
        if not user:
            return 'Invalid User', 501            
            
        public_key = self.rsaBroker.get_rsa_key(user_id)
        if public_key is None:
            return 'Public Key Unset', 503            
            
        if not validate_public_key(public_key, args['rsa_original_message'], args['rsa_message_signature']):
            return 'Invalid Signature', 502             
            
        identity = user.to_identity_json()
        additional_claims = {
                "role": user.role
            }       
       
        access_token = create_access_token(identity=identity, fresh=True, additional_claims=additional_claims, expires_delta=TOKEN_EXPIRES_DELTA)
        refresh_token = create_refresh_token(identity=identity, additional_claims=additional_claims, expires_delta=REFRESH_TOKEN_EXPIRES_DELTA)
        
        response = make_response(jsonify(access_token=access_token, refresh_token=refresh_token))

        set_access_cookies(response, access_token)
        set_refresh_cookies(response, refresh_token)
                
        return response

refresh_parser = ns_auth.parser()
refresh_parser.add_argument("Authorization", location="headers", required=False, type="apiKey")
refresh_parser.add_argument("X-CSRF-TOKEN", location="headers", required=False, type="string")

@ns_auth.route("/refresh", methods=['POST']) 
@ns_auth.expect(refresh_parser)   
class JWTRefreshToken(Resource):
    @inject
    def __init__(self, usersBroker: IUsersBroker, api=None, *args, **kwargs):
        self.usersBroker = usersBroker
        super().__init__(api, *args, **kwargs)
    
    
    @ns_auth.doc(description="JWT refresh access token",
            responses={200: 'Success', 401: "Refresh token verification failed"})

    @jwt_required(refresh=True)
    def post(self):
        identity = get_jwt_identity()              
        
        user = self.usersBroker.get_user_by_id(identity["user_id"])
            
        if user is None:
            abort(401, "Invalid User")
            
        additional_claims = {
                "role": user.role
            }
        
        access_token = create_access_token(identity=identity, fresh=False, additional_claims=additional_claims, expires_delta=TOKEN_EXPIRES_DELTA)
        return jsonify(access_token=access_token)        
    

    
