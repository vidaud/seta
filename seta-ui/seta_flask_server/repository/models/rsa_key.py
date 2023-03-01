from flask import json
from Crypto.Hash import SHA256
from Crypto.PublicKey import RSA
from Crypto.Signature import pkcs1_15
import binascii

class RsaKey:
    
    def __init__(self, user_id, rsa_value, created_at = None, modified_at = None):
        self.user_id = user_id
        self.rsa_value = rsa_value
        self.created_at = created_at
        self.modified_at = modified_at
        
    def __iter__(self):
        yield from {
            "user_id": self.user_id,
            "rsa_value": self.rsa_value,
            "created_at": self.created_at,
            "modified_at": self.modified_at
        }.items()
        
    def __str__(self):
        return json.dumps(self.to_json())
    
    def __repr__(self):
        return self.__str__()

    def to_json(self):
        return dict(self)
    
    def validate_public_key(self, message, signature):
        try:
            public_key = RSA.import_key(self.rsa_value)
            digest = SHA256.new(message.encode())
            pkcs1_15.new(public_key).verify(digest, binascii.unhexlify(signature))
        except Exception as e:
            return False
        return True