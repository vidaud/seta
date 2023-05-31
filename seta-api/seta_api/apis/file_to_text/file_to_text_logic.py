import magic
import tempfile
from subprocess import Popen, PIPE
from flask_restx import abort
from http import HTTPStatus
import os
import shutil
from werkzeug.utils import secure_filename


def mime_is_in_blacklist(mime):
    mime_blacklist = ["Zip archive data", "POSIX tar archive", "7-zip archive data", "bzip2 compressed data",
                      "XZ compressed data", "gzip compressed data", "executable"]
    for m in mime_blacklist:
        if m in mime:
            return True
    return False


def allowed_extension(file):
    temp_dir = tempfile.TemporaryDirectory()
    filename = secure_filename(file.filename)
    file.save(os.path.join(temp_dir.name, filename))
    mime = magic.from_file(os.path.join(temp_dir.name, filename))
    shutil.rmtree(temp_dir.name)
    if mime_is_in_blacklist(mime):
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
