from infrastructure.constants import (CommunityStatusConstants, RequestStatusConstants)
from flask_restx import Model, fields

def status_list(value):
    '''Validation method for status value in list'''    
    value = value.lower()
    
    if value not in CommunityStatusConstants.List:
        raise ValueError(
            "Status has to be one of '" + str(CommunityStatusConstants.List) + "'."
        )
        
    return value

def request_status_list(value):
    '''Validation method for status value in list'''    
    value = value.lower()
    
    if value not in RequestStatusConstants.EditList:
        raise ValueError(
            "Status has to be one of '" + str(RequestStatusConstants.EditList) + "'."
        )
        
    return value

user_info_model = Model("User Info", 
                {
                    "user_id": fields.String(description="Internal SETA user identifier"),
                    "full_name": fields.String(description="User full name"),
                    "email": fields.String(description="User email address")
                })