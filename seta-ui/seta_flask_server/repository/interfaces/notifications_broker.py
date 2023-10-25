from interface import Interface


class INotificationsBroker(Interface):
    def count_pending_invites(self, user_id: str) -> int:
        """Count of pending invites sent to the user."""

        pass

    def count_membership_requests(self, user_id: str) -> int:
        """Count membership requests sent to the communities that user manages."""

        pass

    def count_change_requests(self) -> int:
        """Count pending change requests for communities or resources."""

        pass
