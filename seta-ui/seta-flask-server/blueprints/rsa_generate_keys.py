
from Crypto.PublicKey import RSA

keyPair = RSA.generate(bits=4096)

# Mathematics behind the keys
publicKey = f"(n={hex(keyPair.n)}, e={hex(keyPair.e)})"
privateKey = f"(n={hex(keyPair.n)}, d={hex(keyPair.d)})"

# Practical keys:

# public key 
pubKey = keyPair.publickey()
pubKeyPEM = pubKey.exportKey()
decodedPubKeyPEM = pubKeyPEM.decode('ascii')

# private key
privKeyPEM = keyPair.exportKey()
decodedPrivKeyPEM = privKeyPEM.decode('ascii')

fileOut = open("rsa_public_key.pem", "wb")
fileOut.write(pubKeyPEM)
fileOut.close()

fileOut = open("rsa_private_key.pem", "wb")
fileOut.write(privKeyPEM)
fileOut.close()

