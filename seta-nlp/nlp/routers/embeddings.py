import logging
from fastapi import APIRouter, HTTPException, Depends, Security, status

from nlp import models
from nlp.internal import sentence_transformer_embeddings as ste
from nlp.internal import seta_jwt
from nlp.configuration import configuration
from nlp.access_security import access_security

router = APIRouter(tags=["Embeddings"])

logger = logging.getLogger(__name__)


async def get_embeddings_client():
    """Creates embeddings client using SetaTransformer"""

    return ste.SentenceTransformerEmbeddings(
        use_workers=configuration.USE_EMBEDDINGS_WORKER
    )


@router.post(
    "/compute_embeddings",
    summary="Embeddings from plain text.",
    description="Given a plain text, related embeddings are provided using Doc2vec.",
)
async def embeddings_from_text(
    text: models.ParserText,
    client: ste.SentenceTransformerEmbeddings = Depends(get_embeddings_client),
    decoded_token: seta_jwt.JwtDecodedToken = Security(access_security),
) -> models.Chunks:
    """Extracts embeddings from text."""

    # auto_error=False, fo we should check manually
    if not decoded_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized"
        )

    try:
        return await client.chunks_and_embeddings_from_text(text=text.text)
    except Exception as e:
        logger.exception(e)

        # pylint: disable-next=raise-missing-from
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=e)


@router.post(
    "/compute_embedding",
    summary="Vector from text",
    description="Given a plain text, related embeddings vector is provided.",
)
async def vector_from_text(
    text: models.ParserText,
    client: ste.SentenceTransformerEmbeddings = Depends(get_embeddings_client),
    decoded_token: seta_jwt.JwtDecodedToken = Security(access_security),
) -> models.Vector:
    """Extracts embedding vector from text."""

    # auto_error=False, fo we should check manually
    if not decoded_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized"
        )

    try:
        return await client.embedding_vector_from_text(text.text)
    except Exception as e:
        logger.exception(e)

        # pylint: disable-next=raise-missing-from
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=e)
