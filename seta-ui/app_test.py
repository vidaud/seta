from seta_flask_server.config_test import TestConfig
from seta_flask_server.factory import create_app

configuration = TestConfig()  
app = create_app(configuration)

app.logger.debug("seta-ui test run")