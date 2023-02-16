from flask_restx import Model, fields
from flask_restx.reqparse import RequestParser

from seta_flask_server.infrastructure.constants import (CommunityStatusConstants, CommunityDataTypeConstants, 
                                      CommunityMembershipConstants, CommunityRequestFieldConstants,
                                      RequestStatusConstants)

from .models_dto import (status_list, request_status_list, user_info_model)

def data_type_list(value):
    '''Validation method for data_type value in list'''    
    value = value.lower()
    
    if value not in CommunityDataTypeConstants.List:
        raise ValueError(
            "Data type has to be one of '" + str(CommunityDataTypeConstants.List) + "'."
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


community_model = Model("Community",
        {
            "community_id": fields.String(description="Community identifier"),
            "title": fields.String(description="Community title"),
            "description": fields.String(description="Community relevant description"),
            "membership": fields.String(description="The membership status", enum=CommunityMembershipConstants.List),
            "data_type": fields.String(description="The community data type", enum=CommunityDataTypeConstants.List),
            "status": fields.String(description="The community status", enum=CommunityStatusConstants.List),
            "creator": fields.Nested(model=user_info_model),
            "created_at": fields.DateTime(description="Creation date", attribute="created_at")
        })


def request_field(value):
    '''Validation method for filed name in list'''    
    value = value.lower()
    
    if value not in CommunityRequestFieldConstants.List:
        raise ValueError(
            "Field name has to be one of '" + str(CommunityRequestFieldConstants.List) + "'."
        )
        
    return value

new_change_request_parser = RequestParser(bundle_errors=True)
new_change_request_parser.add_argument("field_name", 
                                  type=request_field,
                                  location="form",
                                  required=True,
                                  nullable=False,
                                  help=f"Requested field, one of {CommunityRequestFieldConstants.List}")
new_change_request_parser.add_argument("new_value", 
                                  location="form",
                                  required=True,
                                  nullable=False,
                                  help="New value for field")
new_change_request_parser.add_argument("old_value", 
                                  location="form",
                                  required=True,
                                  nullable=False,
                                  help="Current value at request")

update_change_request_parser = RequestParser(bundle_errors=True)
update_change_request_parser.add_argument("status",
                                  type=request_status_list,
                                  location="form",
                                  required=True,
                                  nullable=False,
                                  help=f"Status, one of {RequestStatusConstants.EditList}")


change_request_model = Model("CommunityChangeRequest",
                             {
                                 "request_id": fields.String(description="Request identifier"),
                                 "community_id": fields.String(description="Community identifier"),
                                 "field_name": fields.String(description="Requested field", enum=CommunityRequestFieldConstants.List),
                                 "new_value": fields.String(description="New value for field"),
                                 "old_value": fields.String(description="Current value at request"),
                                 "requested_by": fields.String(description="User identifier that intiated the request"),
                                 "status": fields.String(description="Request status", enum=RequestStatusConstants.List),
                                 "initiated_date": fields.DateTime(description="Request intiated date", attribute="initiated_date"),
                                 "reviewed_by": fields.String(description="User identifier that reviewed the request"),
                                 "review_date": fields.DateTime(description="Reviewed date", attribute="review_date")
                             })
