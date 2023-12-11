import logging
from fastapi import APIRouter, HTTPException, Security, UploadFile, Depends, status

from fastapi.responses import PlainTextResponse

from nlp.internal import tika_parser
from nlp.internal import seta_jwt
from nlp.access_security import access_security

router = APIRouter(tags=["File Parser"])

logger = logging.getLogger(__name__)


@router.post(
    "/file_to_text",
    response_class=PlainTextResponse,
    summary="Extract text",
    description="Extracts text from uploaded file.",
)
async def parse_text(
    file: UploadFile,
    parser: tika_parser.TikaParser = Depends(tika_parser.get_file_parser),
    decoded_token: seta_jwt.JwtDecodedToken = Security(access_security),
):
    """Extracts text from uploaded file."""

    try:
        # auto_error=False, fo we should check manually
        if not decoded_token:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized"
            )

        file_content = await file.read()
        text = await parser.extract_text(content=file_content)

        return text
    except HTTPException:
        raise
    except Exception as e:
        logger.exception(e)

        # pylint: disable-next=raise-missing-from
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during extracting text from file.",
        )
    finally:
        await file.close()
