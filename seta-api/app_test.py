from seta_api.config import TestConfig
from seta_api.factory import create_app

configuration = TestConfig() 
app = create_app(configuration)

app.logger.debug("seta-ui test run")