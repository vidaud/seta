from flask_restx import Model, fields
from flask_restx.reqparse import RequestParser

from infrastructure.constants import (RequestStatusConstants, ResourceRequestFieldConstants)

from .models_dto import (request_status_list)

def request_field(value):
    '''Validation method for field name in list'''    
    value = value.lower()
    
    if value not in ResourceRequestFieldConstants.List:
        raise ValueError(
            "Field name has to be one of '" + str(ResourceRequestFieldConstants.List) + "'."
        )
        
    return value

new_change_request_parser = RequestParser(bundle_errors=True)
new_change_request_parser.add_argument("field_name", 
                                  type=request_field,
                                  location="form",
                                  required=True,
                                  nullable=False,
                                  help=f"Requested field, one of {ResourceRequestFieldConstants.List}")
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
                                 "resource_id": fields.String(description="Community identifier"),
                                 "field_name": fields.String(description="Requested field", enum=ResourceRequestFieldConstants.List),
                                 "new_value": fields.String(description="New value for field"),
                                 "old_value": fields.String(description="Current value at request"),
                                 "requested_by": fields.String(description="User identifier that intiated the request"),
                                 "status": fields.String(description="Request status", enum=RequestStatusConstants.List),
                                 "initiated_date": fields.DateTime(description="Request intiated date", attribute="initiated_date"),
                                 "reviewed_by": fields.String(description="User identifier that reviewed the request"),
                                 "review_date": fields.DateTime(description="Reviewed date", attribute="review_date")
                             })    