from flask_restx import Model, fields
from flask_restx.reqparse import RequestParser

from infrastructure.constants import (CommunityStatusConstants, CommunityDataTypeConstants, CommunityMembershipConstants)

def data_type_list(value):
    '''Validation method for data_type value in list'''    
    value = value.lower()
    
    if value not in CommunityDataTypeConstants.List:
        raise ValueError(
            "Data type has to be one of '" + str(CommunityDataTypeConstants.List) + "'."
        )
        
    return value

def status_list(value):
    '''Validation method for status value in list'''    
    value = value.lower()
    
    if value not in CommunityStatusConstants.List:
        raise ValueError(
            "Status has to be one of '" + str(CommunityStatusConstants.List) + "'."
        )
        
    return value

new_community_parser = RequestParser(bundle_errors=True)
new_community_parser.add_argument("community_id",
                                  location="form", 
                                  required=True,
                                  nullable=False,                                  
                                  help="Unique community identifier")
new_community_parser.add_argument("title", 
                                  location="form",
                                  required=True,
                                  nullable=False,
                                  help="Short title")
new_community_parser.add_argument("description", 
                                  location="form",
                                  required=True,
                                  nullable=False,
                                  help="Relevand information about this community")
#new_community_parser.add_argument('membership')
new_community_parser.add_argument("data_type",
                                  type=data_type_list,
                                  location="form",
                                  required=True,
                                  nullable=False,
                                  help=f"Data type, one of {CommunityDataTypeConstants.List}")

update_community_parser = new_community_parser.copy()
update_community_parser.remove_argument("community_id")
update_community_parser.add_argument("status",
                                  type=status_list,
                                  location="form",
                                  required=True,
                                  nullable=False,
                                  help=f"Status, one of {CommunityStatusConstants.List}")

community_creator_model = Model("Community Creator", 
                        {
                            "user_id": fields.String(description="Internal SETA user identifier"),
                            "full_name": fields.String(description="User full name"),
                            "email": fields.String(description="User email address")
                        })

community_model = Model("Community",
        {
            "community_id": fields.String(description="Community identifier"),
            "title": fields.String(description="Community title"),
            "description": fields.String(description="Community relevant description"),
            "membership": fields.String(description="The membership status", enum=CommunityMembershipConstants.List),
            "data_type": fields.String(description="The community data type", enum=CommunityDataTypeConstants.List),
            "status": fields.String(description="The community status", enum=CommunityStatusConstants.List),
            "creator": fields.Nested(model=community_creator_model),
            "created_at": fields.DateTime(description="Creation date", attribute="created_at")
        })
