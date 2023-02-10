import config
from factory import create_app

configuration = config.TestConfig() 
app = create_app(configuration)
app.testing = True
#app.logger.debug("seta-ui test run")