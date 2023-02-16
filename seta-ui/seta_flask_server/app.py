from .config import ProdConfig
from .factory import create_app

configuration = ProdConfig()  
app = create_app(configuration)

app.logger.debug("seta-ui production run")