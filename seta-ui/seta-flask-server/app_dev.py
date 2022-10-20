import config
from factory import create_app

configuration = config.DevConfig() 
app = create_app(configuration)

app.logger.debug("seta-ui development run")