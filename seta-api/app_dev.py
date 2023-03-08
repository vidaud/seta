#TODO disable warning to be deleted when certificate for elasticsearch are fixed
import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
urllib3.disable_warnings(urllib3.exceptions.SecurityWarning)
#TODO end

import config
from factory import create_app

configuration = config.DevConfig() 
app = create_app(configuration)

app.logger.debug(f"seta-api dev run")