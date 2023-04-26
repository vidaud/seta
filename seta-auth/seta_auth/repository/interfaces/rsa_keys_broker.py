from interface import Interface

class IRsaKeysBroker(Interface):
    def get_rsa_key(self, user_id: str) -> str:
        pass