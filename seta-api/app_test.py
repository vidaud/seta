from seta_api.config import TestConfig
from seta_api.factory import create_app

configuration = TestConfig() 
app = create_app(configuration)

app.logger.debug(app.url_map)

app.logger.info("seta-ui test running")