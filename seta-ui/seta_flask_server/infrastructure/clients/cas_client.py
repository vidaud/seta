from urllib.parse import urljoin
import urllib3
from cas import CASClientV3, logger

class SetaCasClient(CASClientV3):
    def get_verification_response(self, ticket):
        params = {
            'ticket': ticket,
            'service': self.service_url
        }        
        if self.proxy_callback:
            params.update({'pgtUrl': self.proxy_callback})
        base_url = urljoin(self.server_url, self.url_suffix)
        
        page = None  
        try:
            http = urllib3.PoolManager()
            page = http.request('GET', base_url, fields=params)
            
            '''
            #Andrei - this is not working in the docker container with python 3.10
            page = self.session.get(
                base_url,
                params=params,
                verify=self.verify_ssl_certificate,
                timeout=10
            )
            '''
            return page.data
        except Exception as e:
            logger.exception(e)            
        finally:
            if page is not None:
                page.close()
                
        return None