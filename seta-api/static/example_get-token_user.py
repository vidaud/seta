import requests
import json
from Crypto.Hash import SHA256
from Crypto.PublicKey import RSA
from Crypto.Signature import pkcs1_15
import random
import string

api_url = "https://seta.emm4u.eu/seta-api/seta/api/v1/"

##########################################################################################################
# AUTHENTICATION singnature with private key
##########################################################################################################

rsa_key_path = 'your\path\\to\\rsa-keys\\'
with open(rsa_key_path + 'rsa_private_key.pem', 'r') as f:
    key = RSA.import_key(f.read())

# create a message
random_string = ''.join((random.choice(string.ascii_lowercase) for x in range(20)))
# Signing
digest = SHA256.new(random_string.encode())
signature = pkcs1_15.new(key).sign(digest)

##########################################################################################################
# AUTHORIZATION - get JWT token
##########################################################################################################

# request token with authorization
payload = {"username": "yourusername",
    "rsa_original_message": random_string,
    "rsa_message_signature": signature.hex()}
guest_token = requests.post(api_url + "get-token", data=json.dumps(payload))
token_json = json.loads(guest_token.text)

##########################################################################################################
# AUTHORIZATION - use JWT token in api
##########################################################################################################

# put token in Authorization header
headers = {"Authorization": token_json['access_token']}
payload = {
    "term": "data",
    "n_docs": 10,
    "from_doc": 0
}
# perform your request(in this case corpus api)
r = requests.post(api_url + "corpus", data=json.dumps(payload), headers=headers)
