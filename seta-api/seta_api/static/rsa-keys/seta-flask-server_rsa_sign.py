import binascii
from base64 import b64encode
from hashlib import sha512

from Crypto.Cipher import PKCS1_OAEP
from Crypto.Hash import SHA256
from Crypto.PublicKey import RSA
from Crypto.Signature import pkcs1_15

# create a message
message = b'duh message'

# load private key
with open('rsa_private_key.pem', 'r') as f:
    key = RSA.import_key(f.read())

# Signing
digest = SHA256.new(message)
signature = pkcs1_15.new(key).sign(digest)

fileOut = open("rsa_original_message.txt", "wb")
fileOut.write(message)
fileOut.close()

fileOut = open("rsa_message_signature_hex.txt", "wb")
fileOut.write(signature.hex().encode())
fileOut.close()
