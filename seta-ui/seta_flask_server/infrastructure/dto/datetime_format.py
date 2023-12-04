import datetime as dt
from flask_restx import fields


class DateISOFormat(fields.Raw):
    def format(self, value: dt.datetime):
        return value.isoformat()
