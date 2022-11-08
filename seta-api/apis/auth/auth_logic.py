from Crypto.Hash import SHA256
from Crypto.PublicKey import RSA
from Crypto.Signature import pkcs1_15
import binascii

def validate_public_key(public, message, signature):        
    public_key = RSA.import_key(public)
    digest = SHA256.new(message.encode())
    try:
        pkcs1_15.new(public_key).verify(digest, binascii.unhexlify(signature))
    except Exception as e:
        return False
    return True