from bson import json_util, SON
from flask import json as flask_json
from six import iteritems, string_types
from bson.json_util import RELAXED_JSON_OPTIONS
from Crypto.Hash import SHA256
from Crypto.PublicKey import RSA
from Crypto.Signature import pkcs1_15
import binascii

class JSONEncoder(flask_json.JSONEncoder):

    """A JSON encoder that uses :mod:`bson.json_util` for MongoDB documents. """

    def __init__(self, json_options=None, *args, **kwargs):
        if json_options is None:
            json_options = RELAXED_JSON_OPTIONS
        if json_options is not None:
            self._default_kwargs = {"json_options": json_options}
        else:
            self._default_kwargs = {}

        super(JSONEncoder, self).__init__(*args, **kwargs)

    def default(self, obj):
        if hasattr(obj, "iteritems") or hasattr(obj, "items"):
            return SON((k, self.default(v)) for k, v in iteritems(obj))
        elif hasattr(obj, "__iter__") and not isinstance(obj, string_types):
            return [self.default(v) for v in obj]
        else:
            try:
                return json_util.default(obj, **self._default_kwargs)
            except TypeError:
                return obj
            
'''
from bson import ObjectId, datetime

class JSONEncoder(flask_json.JSONEncoder):
    """extend json-encoder class"""

    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        if isinstance(o, datetime.datetime):
            return str(o)
        return json.JSONEncoder.default(self, o)
'''     

def validate_public_key(public, message, signature):        
    public_key = RSA.import_key(public)
    digest = SHA256.new(message.encode())
    try:
        pkcs1_15.new(public_key).verify(digest, binascii.unhexlify(signature))
    except Exception as e:
        return False
    return True