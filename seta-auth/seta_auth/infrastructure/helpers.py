from bson import json_util
from flask import Flask
from Crypto.Hash import SHA256
from Crypto.PublicKey import RSA
from Crypto.Signature import pkcs1_15
import binascii
import typing as t
from flask.json.provider import JSONProvider, _default

class MongodbJSONProvider(JSONProvider):
    def __init__(self, app: Flask) -> None:
        super().__init__(app)

    default: t.Callable[[t.Any], t.Any] = staticmethod(
        _default
    )

    def dumps(self, obj, **kwargs) -> str:
        """Serialize data as JSON.

        :param obj: The data to serialize.
        :param kwargs: May be passed to the underlying JSON library.
        """
        kwargs.setdefault("default", self.default)
        kwargs.setdefault("ensure_ascii", True)
        kwargs.setdefault("sort_keys", True)
        return json_util.dumps(obj, **kwargs)

    def loads(self, s, **kwargs):
        """Deserialize data as JSON.

        :param s: Text or UTF-8 bytes.
        :param kwargs: May be passed to the underlying JSON library.
        """
        return json_util.loads(s, **kwargs)
    
def validate_public_key(public, message, signature):
    try:
        public_key = RSA.import_key(public)
        digest = SHA256.new(message.encode())
        pkcs1_15.new(public_key).verify(digest, binascii.unhexlify(signature))
    except Exception as e:
        return False
    return True    