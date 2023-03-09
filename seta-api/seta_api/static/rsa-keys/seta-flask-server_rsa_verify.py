import binascii
from base64 import b64encode
from hashlib import sha512

from Crypto.Cipher import PKCS1_OAEP
from Crypto.Hash import SHA256
from Crypto.PublicKey import RSA
from Crypto.Signature import pkcs1_15

message = open("rsa_original_message.txt", "rb").read()
signature = open("rsa_message_signature.txt", "rb").read()

# hash the message
digest = SHA256.new(message)

# load public key
with open('rsa_public_key.pem', 'r') as f:
    public_key = RSA.import_key(f.read())

validated = True

try:
    pkcs1_15.new(public_key).verify(digest, signature)
except:
    validated = False

print(validated)


