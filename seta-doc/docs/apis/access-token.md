# JWT Access Tokens

The [SeTA Token API]({{ setaUrls.jwtToken }}/doc) exposes functionality of creating an access token to be used in Web API calls on behalf of users and applications.

The generated access token has a limited lifespan of one hour. To obtain a new token after this period, you can use the `refresh_token` from the response. For more details, refer to the [refresh section](#refresh-access-token).

This guide assumes that you stored the public [authentication key](/docs/user-guide/user-profile/authentication-key/) or you created an [application](/docs/user-guide/user-profile/applications/) using the user profile web console.

## Access Token

```
POST {{ setaUrls.jwtToken }}/token
```

### Python code sample

Requirements:

```
requests
pycryptodome
```

The following example written in python gets the access token and sets it in the 'Authorization' header of the [Search API](/seta-search/doc) */corpus* call.

```
"""
Example code obtaining SeTA access token.

Usage: python auth_example.py
"""

import sys
import random
import string

import requests
from Crypto.Hash import SHA256
from Crypto.PublicKey import RSA
from Crypto.Signature import pkcs1_15


AUTH_URL = "https://hostname/authentication/v1/token"
API_URL = "https://hostname/seta-search/api/v1"

####################################################################
# AUTHENTICATION signature with private key
####################################################################

RSA_KEY_FULL_PATH = 'path\to\your\rsa-key.private'
with open(RSA_KEY_FULL_PATH, "r", encoding="utf-8") as f:
    key = RSA.import_key(f.read())

# create a message
RANDOM_MESSAGE = "".join((random.choice(string.ascii_lowercase) for x in range(20)))
# Signing
digest = SHA256.new(RANDOM_MESSAGE.encode())
signature = pkcs1_15.new(key).sign(digest)

####################################################################
# AUTHORIZATION - get JWT token
####################################################################

# request token with authorization
payload = {
    "username": "your_username",
    "provider": "provider_name",
    "rsa_original_message": RANDOM_MESSAGE,
    "rsa_message_signature": signature.hex(),
}
token_request = requests.post(AUTH_URL, json=payload, timeout=30)

if not token_request.ok:
    print("auth failed: %s", token_request.text)
    sys.exit()

token_json = token_request.json()

####################################################################
# AUTHORIZATION - use JWT token in api
####################################################################

# put token in Authorization header
headers = {"Authorization": f"Bearer {token_json['access_token']}"}
payload = {"term": "data", "n_docs": 10, "from_doc": 0}
# perform your request(in this case corpus api)
r = requests.post(f"{API_URL}/corpus", json=payload, headers=headers, timeout=30)

```

## Refresh Access Token

Access tokens are configured with a limited lifespan; new tokens can be obtained by providing the original refresh token.

```
POST {{ setaUrls.jwtToken }}/token/refresh
```

You must include the following header in your API call:

* Header parameter: _Authorization_
* Value: _Bearer  &lt;Refresh Token_&gt;