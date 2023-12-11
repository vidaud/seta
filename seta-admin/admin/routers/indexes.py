import logging
from fastapi import APIRouter, Depends, HTTPException, status

from admin.models.index import Index
from admin.models.response_message import ResponseStatus, ResponseMessage

from admin.internal import opensearch

router = APIRouter()

logger = logging.getLogger(__name__)


@router.post(
    "/indexes",
    status_code=status.HTTP_201_CREATED,
    response_model=ResponseMessage,
    responses={
        status.HTTP_409_CONFLICT: {
            "description": "Index name already exists.",
        }
    },
)
async def create_index(
    index: Index,
    client: opensearch.OpenSearchEngine = Depends(opensearch.get_search_client),
):
    """Creates a new index in the Search engine"""

    if await client.index_exists(name=index.name):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={"name": "Index already exists in the search storage."},
        )

    try:
        await client.create_index(name=index.name)

        return ResponseMessage(status=ResponseStatus.SUCCESS, message="Index created.")
    except Exception as ex:
        logger.exception(ex)

        # pylint: disable-next=raise-missing-from
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=ResponseMessage(
                status=ResponseStatus.ERROR, message="Internal server error."
            ),
        )


@router.delete(
    "/indexes",
    status_code=status.HTTP_200_OK,
    response_model=ResponseMessage,
    responses={
        status.HTTP_404_NOT_FOUND: {
            "description": "Index not found.",
        }
    },
)
async def delete_index(
    index: Index,
    client: opensearch.OpenSearchEngine = Depends(opensearch.get_search_client),
):
    """Deletes index and all its data from Search engine."""

    if not await client.index_exists(name=index.name):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"name": "Index not found."},
        )

    try:
        await client.delete_index(name=index.name)

        return ResponseMessage(status=ResponseStatus.SUCCESS, message="Index deleted.")
    except Exception as ex:
        logger.exception(ex)

        # pylint: disable-next=raise-missing-from
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=ResponseMessage(
                status=ResponseStatus.ERROR, message="Internal server error."
            ),
        )
