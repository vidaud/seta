from seta_auth.config import TestConfig
from seta_auth.factory import create_app

configuration = TestConfig()  
app = create_app(configuration)

app.logger.debug(app.url_map)

app.logger.info("seta-auth test running")