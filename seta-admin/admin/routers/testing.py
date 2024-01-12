import logging
from fastapi import APIRouter, Depends, HTTPException, status

from admin.models.response_message import ResponseStatus, ResponseMessage
from admin.internal import opensearch

router = APIRouter()

logger = logging.getLogger(__name__)


@router.post(
    "/cleanup",
    status_code=status.HTTP_201_CREATED,
    response_model=ResponseMessage,
    responses={
        status.HTTP_409_CONFLICT: {
            "description": "Index name already exists.",
        }
    },
)
async def cleanup(
    client: opensearch.OpenSearchEngine = Depends(opensearch.get_search_client),
):
    """Cleanups Search data for testing."""

    try:
        await client.cleanup()
        return ResponseMessage(
            status=ResponseStatus.SUCCESS, message="Search data cleaned up."
        )
    except Exception as ex:
        logger.exception(ex)

        # pylint: disable-next=raise-missing-from
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=ResponseMessage(
                status=ResponseStatus.ERROR, message="Internal server error."
            ),
        )
