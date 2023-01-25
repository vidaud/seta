from flask_restx import Model, fields
from flask_restx.reqparse import RequestParser

from infrastructure.constants import (CommunityScopeConstants, CommunityStatusConstants, CommunityMembershipConstants, CommunityDataTypeConstants)

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
                                  help="Community id cannot be blank!")
new_community_parser.add_argument("title", 
                                  location="form",
                                  required=True,
                                  nullable=False,
                                  help="Title cannot be blank!")
new_community_parser.add_argument("description", 
                                  location="form",
                                  required=True,
                                  nullable=False,
                                  help="Description cannot be blank!")
#new_community_parser.add_argument('membership')
new_community_parser.add_argument("data_type",
                                  type=data_type_list,
                                  location="form",
                                  required=True,
                                  nullable=False,
                                  help="Data type cannot be blank!")

update_community_parser = new_community_parser.copy()
update_community_parser.remove_argument("community_id")
update_community_parser.add_argument("status",
                                  type=status_list,
                                  location="form",
                                  required=True,
                                  nullable=False,
                                  help="Status cannot be blank!")

community_model = Model("Community",
        {
            "community_id": fields.String,
            "title": fields.String,
            "description": fields.String,
            "membership": fields.String,
            "data_type": fields.String,
            "status": fields.String,
            "creator": fields.String,
            "created_at": fields.DateTime(attribute="created_at")
        })