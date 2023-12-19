from nlp.internal.seta_jwt import SetaJwtAccessBearerCookie
from .configuration import configuration

# Read access token from bearer header and cookie (bearer priority)
access_security = SetaJwtAccessBearerCookie(
    token_info_url=configuration.JWT_TOKEN_INFO_URL
)
