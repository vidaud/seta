import config
from factory import create_app

configuration = config.ProdConfig()  
app = create_app(configuration)

app.logger.debug("seta-ui production run")