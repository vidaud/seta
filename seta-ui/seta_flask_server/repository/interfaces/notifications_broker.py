from interface import Interface

class INotificationsBroker(Interface):

    def count_pending_invites(self, user_id: str) -> int:
        """
        Get count of pending invites sent to the user

        :param user_id:
            User identifier
        """

        pass

    def count_membership_requests(self, user_id: str) -> int:
        """
        Get count of membership request sent to the communities that user manages

        :param user_id:
            User identifier
        """

        pass

    def count_change_requests(self) -> int:
        """
        Get count of pending change requests for communities or resources
        """

        pass