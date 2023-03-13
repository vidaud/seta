#TODO disable warning to be deleted when certificate for elasticsearch are fixed
import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
urllib3.disable_warnings(urllib3.exceptions.SecurityWarning)
#TODO end

from seta_api.config import DevConfig
from seta_api.factory import create_app

configuration = DevConfig() 
app = create_app(configuration)

app.logger.info(app.url_map)

app.logger.debug(f"seta-api dev run")