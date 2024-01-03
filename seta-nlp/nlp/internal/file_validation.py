import tempfile
import magic

MIME_BLACKLIST = [
    "Zip archive data",
    "POSIX tar archive",
    "7-zip archive data",
    "bzip2 compressed data",
    "XZ compressed data",
    "gzip compressed data",
    "executable",
]


def allowed_extension(file_content: bytes) -> (bool, str):
    """Validates file extension."""

    with tempfile.NamedTemporaryFile(delete=False) as fp:
        # the temporary file will be automatically removed at the end of this block
        fp.write(file_content)
        fp.close()

        mime = magic.from_file(fp.name)

    if any(mb in mime for mb in MIME_BLACKLIST):
        return False, mime

    return True, mime
