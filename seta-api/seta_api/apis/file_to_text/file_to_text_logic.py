# import magic
from subprocess import Popen, PIPE
from flask_restx import abort
from http import HTTPStatus

mime_blacklist = ["application/x-zip-compressed", "application/octet-stream", "application/x-tar"]


def allowed_extension(file):
    mime = file.mimetype
    if mime in mime_blacklist:
        return False, mime
    return True, mime


def extract_text(file, tika_path):
    resp = {"text": ""}
    is_allowed, mime = allowed_extension(file)
    if is_allowed:
        file.seek(0)
        p = Popen(['java', '-jar', tika_path, '--text'], stdout=PIPE, stdin=PIPE, stderr=PIPE)
        parsed_file = p.communicate(input=file.read(), timeout=300)[0]
        resp["text"] = parsed_file.decode('utf-8')
    else:
        abort_msg = "File not allowed: " + mime
        abort(HTTPStatus.FORBIDDEN, abort_msg)
    return resp
