from seta_flask_server.config import TestConfig
from seta_flask_server.factory_auth import create_app

configuration = TestConfig()  
app = create_app(configuration)

app.logger.debug(app.url_map)

app.logger.info("seta-auth test running")