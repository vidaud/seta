import logging
from fastapi import APIRouter

from nlp import models
from nlp.internal import concordance

router = APIRouter(tags=["Concordance"])

logger = logging.getLogger(__name__)


@router.post(
    "/compute_concordance",
    summary="Compute concordance for document.",
    description="Given an opensearch document, related concordances are provided using nltk.",
)
async def compute_concordance(document: models.Document) -> list[tuple[str, str, str]]:
    """Extracts concordances from document."""

    concordances = await concordance.compute_concordance(
        abstract=document.abstract, term=document.term, text=document.text
    )

    return concordances
