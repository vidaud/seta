from interface import Interface
from seta_flask_server.repository.models import SetaUser


class IUsersBroker(Interface):
    # ---------------- Get methods ----------------#

    def authenticate_user(self, auth_user: SetaUser) -> SetaUser:
        """Retrieves or inserts an application account."""
        pass

    def get_user_by_provider(
        self, provider_uid: str, provider: str, load_scopes: bool = False
    ) -> SetaUser:
        """Find user by external account."""
        pass

    def get_user_by_id(self, user_id: str, load_scopes: bool = True) -> SetaUser:
        """Find user by identifier."""
        pass

    def get_user_by_email(self, email: str) -> SetaUser:
        """Find user by email address."""
        pass

    def user_uid_exists(self, user_id: str) -> bool:
        """Check if identifier exists."""
        pass

    def update_status(self, user_id: str, status: str):
        """Updates account status."""
        pass

    def update_role(self, user_id: str, role: str):
        """Updates role claim."""
        pass

    def delete(self, user_id: str):
        """Removes user data.

        Anonymize sensitive data (email, name, etc) and cascade delete unusable data (user providers, scopes, etc).
        """
        pass
