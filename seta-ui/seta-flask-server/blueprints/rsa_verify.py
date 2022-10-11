
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
    res = pkcs1_15.new(public_key).verify(digest, signature)
    #print("res is:")
    #print(res)
except:
    validated = False 

print(validated)


