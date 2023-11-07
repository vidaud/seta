from urllib.parse import urljoin
import urllib3
from cas import CASClientV3, logger


class SetaCasClient(CASClientV3):
    def get_verification_response(self, ticket):
        params = {"ticket": ticket, "service": self.service_url}
        if self.proxy_callback:
            params.update({"pgtUrl": self.proxy_callback})
        base_url = urljoin(self.server_url, self.url_suffix)

        page = None
        try:
            http = urllib3.PoolManager()
            page = http.request("GET", base_url, fields=params)

            return page.data
        except Exception:
            logger.exception("SetaCasClient")
        finally:
            if page is not None:
                page.close()

        return None
