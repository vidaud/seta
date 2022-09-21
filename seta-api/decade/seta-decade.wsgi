activate_this = '/home/seta/venvs/seta-api/bin/activate_this.py'
with open(activate_this) as file_:
    exec(file_.read(), dict(__file__=activate_this))

from decade_server import app as application
