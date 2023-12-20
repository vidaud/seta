from typing import Any, Dict, Optional
import logging
import httpx

from fastapi.security import APIKeyCookie, HTTPBearer
from fastapi.exceptions import HTTPException
from fastapi_jwt import JwtAccessBearerCookie
from starlette.status import HTTP_401_UNAUTHORIZED

logger = logging.getLogger(__name__)


class JwtDecodedToken(dict):
    def __init__(self, payload: Dict[str, Any]):
        super().__init__(payload)


class SetaJwtAccessBearerCookie(JwtAccessBearerCookie):
    token_info_url = None

    def __init__(self, token_info_url):
        self.token_info_url = token_info_url
        super().__init__(secret_key="ignored")

    async def _get_credentials(self, bearer, cookie) -> Optional[JwtDecodedToken]:
        payload = await self._get_payload(bearer, cookie)

        if payload:
            return JwtDecodedToken(payload=payload)
        return None

    async def _get_payload(
        self, bearer: HTTPBearer | None, cookie: APIKeyCookie | None
    ) -> Dict[str, Any] | None:
        token: Optional[str] = None
        if bearer:
            token = str(bearer.credentials)  # type: ignore
        elif cookie:
            token = str(cookie)

        # Check token exist
        if not token:
            if self.auto_error:
                raise HTTPException(
                    status_code=HTTP_401_UNAUTHORIZED,
                    detail="Credentials are not provided",
                )

            return None

        # Try to decode jwt token. auto_error on error
        if self.token_info_url is None:
            return None

        try:
            headers = {"Content-Type": "application/json"}
            json = {"token": token, "authorizationAreas": ["data-sources"]}

            async with httpx.AsyncClient(headers=headers) as client:
                r = await client.post(url=self.token_info_url, json=json)
                r.raise_for_status()

            payload = r.json()
            return payload
        except httpx.RequestError as re:
            logger.exception(re)

            if self.auto_error:
                raise HTTPException(
                    status_code=HTTP_401_UNAUTHORIZED,
                    detail="An error occurred while requesting internal authorization endpoint",
                ) from re

            return None
        except httpx.HTTPStatusError as exc:
            logger.exception(exc)

            if self.auto_error:
                if exc.response.status_code == HTTP_401_UNAUTHORIZED:
                    message = str(exc.response.text)
                else:
                    message = "An error occurred while requesting internal authorization endpoint"

                raise HTTPException(
                    status_code=HTTP_401_UNAUTHORIZED,
                    detail=message,
                ) from exc

            return None
