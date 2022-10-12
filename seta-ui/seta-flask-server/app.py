import os
import config
from factory import create_app

FLASK_ENV = os.environ.get('FLASK_ENV', 'development')
configuration = None

if FLASK_ENV == "production":    
    configuration = config.ProdConfig()
elif FLASK_ENV == "test":
    configuration = config.TestConfig()
else: 
    configuration = config.DevConfig()

#TODO: create different files for each app environment (production, test, development)    
app = create_app(configuration)