from flask_jwt_extended import get_jwt_identity, jwt_required
from seta_flask_server.infrastructure.constants import NotificationTypeConstants, NotificationPriorityEnum, UserRoleConstants
from flask_restx import Namespace, Resource, abort

from injector import inject
from http import HTTPStatus

from seta_flask_server.repository.interfaces import (IUsersBroker, INotificationsBroker)

from .models.notification_dto import notification_model

notifications_ns = Namespace('Notifications', validate=True, description='SETA User Notifications')
notifications_ns.models[notification_model.name] = notification_model

@notifications_ns.route("/", endpoint="user_notifications", methods=['GET'])
class Notifications(Resource):

    """Handles HTTP requests to URL: /notifications."""

    @inject
    def __init__(self, usersBroker: IUsersBroker, notificationsBroker: INotificationsBroker, api=None, *args, **kwargs):
        self.usersBroker = usersBroker
        self.notificationsBroker = notificationsBroker
        
        super().__init__(api, *args, **kwargs)

    @notifications_ns.doc(description='Retrieve all user notifications',
        responses={
                    int(HTTPStatus.OK): "'Retrieved notifications.",
                    int(HTTPStatus.FORBIDDEN): "Insufficient rights, user not active"
                },
        
        security='CSRF')
    @notifications_ns.marshal_list_with(notification_model)
    @jwt_required()
    def get(self):
        '''
        Retrieve all user notifications, available to any user
        '''
        
        identity = get_jwt_identity()
        user_id = identity["user_id"]
        
        #verify scope
        user = self.usersBroker.get_user_by_id(user_id)        
        if user is None or user.is_not_active():
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        result = []

        #get pending invites
        count_invites = self.notificationsBroker.count_pending_invites(user_id)

        if count_invites > 0:
            result.append(
                {
                    "label": "Pending invites",
                    "description": f"You have {count_invites} pending " + ("invite" if count_invites == 1 else "invites."),
                    "count": count_invites,
                    "type": NotificationTypeConstants.PendingInvite,
                    "priority": NotificationPriorityEnum.Low
                }
            )

        #get pending membership requests (the method check for owner or manager scopes):
        count_requests = self.notificationsBroker.count_membership_requests(user_id)
        if count_requests > 0:
            result.append(
                {
                    "label": "Pending membership requests",
                    "description": f"You have {count_requests} pending membership " + ("request" if count_requests == 1 else "requests."),
                    "count": count_requests,
                    "type": NotificationTypeConstants.MembershipRequest,
                    "priority": NotificationPriorityEnum.Normal
                }
            )

        #get change request for sysadmins:
        if user.role.lower() == UserRoleConstants.Admin.lower():
            count_change_requests = self.notificationsBroker.count_change_requests()
            if count_change_requests > 0:
                result.append(
                    {
                        "label": "Pending change requests",
                        "description": f"There are {count_change_requests} pending change " + ("request" if count_change_requests == 1 else "requests."),
                        "count": count_change_requests,
                        "type": NotificationTypeConstants.CommunityChangeRequest,
                        "priority": NotificationPriorityEnum.High
                    }
                )
        return result