from flask_restx import Model, fields

rsa_model = Model("PublicRsaKey", 
                {
                    "username": fields.String(description="Internal SETA user identifier"),
                    "value": fields.String(description="Rsa key")
                })

rsa_pair_model = Model("RsaKeysPair",
                    {
                        "publicKey": fields.String(description="Public RSA key"),
                        "privateKey": fields.String(description="Private RSA key")
                    })