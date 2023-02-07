from flask_restx import Api, Resource, fields

from flask import Blueprint
from flask import jsonify, abort
from flask_jwt_extended import decode_token
from flask_jwt_extended.exceptions import JWTExtendedException
from flask import current_app as app

from http import HTTPStatus

from repository.interfaces import IUsersBroker
from injector import inject

token_info = Blueprint("token_info", __name__)

authorization_api = Api(token_info, 
               version="1.0",
               title="JWT token authorization",
               doc="/doc",
               description="JWT authorization for seta apis"               
               )
ns_authorization = authorization_api.namespace("", "Authorization endpoints")

'''
request_parser = RequestParser()
request_parser.add_argument("token",
                            location="json", 
                            required=True,
                            nullable=False,                                  
                            help="Encoded token")
'''                        

request_parser = ns_authorization.model(
    "EncodedToken",
    {
        'token': fields.String(required=True, description="Encoded token"),
     }
)

@ns_authorization.route("/token_info", methods=['POST'])
class TokenInfo(Resource):
    @inject
    def __init__(self, usersBroker: IUsersBroker, api=None, *args, **kwargs):
        self.usersBroker = usersBroker
        super().__init__(api, *args, **kwargs)
    
    @ns_authorization.doc(description="Returns the decoded token including user community permissions",
            responses={int(HTTPStatus.OK): 'Decoded token as json',
                       int(HTTPStatus.BAD_REQUEST): 'No token provided',
                       int(HTTPStatus.UNAUTHORIZED): 'Unauthorized JWT',
                       int(HTTPStatus.UNPROCESSABLE_ENTITY): 'Invalid token',
                       })
    @ns_authorization.expect(request_parser, validate=True)
    def post(self):
        '''Decods the token and builds the community scopes for the user identity'''
        
        r = authorization_api.payload
        token = r["token"]
                
        #app.logger.debug("encoded_token: " + str(token))    
        decoded_token = None
        try:
            decoded_token = decode_token(token)
                    
            #get user resource scopes
            seta_id = decoded_token.get("seta_id")
            if seta_id:
                user = self.usersBroker.get_user_by_id(seta_id["user_id"])
                

                decoded_token["resource_scopes"] = []
                if user is not None:
                    if user.resource_scopes is not None:
                        decoded_token["resource_scopes"] = [obj.to_scope_json() for obj in user.resource_scopes]

                    if user.system_scopes is not None:
                        for ss in user.system_scopes:
                            if ss.area.lower() == "resource":
                                decoded_token["resource_scopes"].add({"id": "_any_", "scope": ss.scope})

                    #TODO: build readable scopes from the community membership and public resources
                

        except JWTExtendedException as e:
            message = str(e)
            app.logger.exception(message)
            abort(401, message)
        
        app.logger.debug(decoded_token)
        return jsonify(decoded_token)
