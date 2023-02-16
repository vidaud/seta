from .config import TestConfig
from .factory import create_app

configuration = TestConfig() 
app = create_app(configuration)
app.testing = True
#app.logger.debug("seta-ui test run")