from interface import Interface


class IRsaKeysBroker(Interface):
    def get_rsa_key(self, user_id: str):
        """RSA key for user."""
        pass

    def set_rsa_key(self, user_id: str, value: str):
        """Set value for user RSA."""
        pass

    def delete_by_user_id(self, user_id: str):
        """Delete RSA for user."""
        pass
