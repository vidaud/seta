import os
from search.config import Config
from search.factory import create_app

stage = os.environ.get("STAGE", default="Production")
    
configuration = Config(stage)

app = create_app(configuration)

if stage == "Development":
    app.logger.debug(app.url_map)


app.logger.info("seta-api running in " + stage)