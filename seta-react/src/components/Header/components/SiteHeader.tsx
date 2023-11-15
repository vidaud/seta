import { useEffect } from 'react'

import { createScript, loadWebTool } from '~/components/Header/util'

import { environment } from '~/environments/environment'

const SiteHeader = () => {
  useEffect(() => {
    if (!document.getElementById('analytic') && !document.getElementById('cookie')) {
      loadWebTool('https://europa.eu/webtools/load.js')

      createScript(
        'cookie',
        '{"utility" : "cck", "url": {"en": "https://commission.europa.eu/cookies-policy_en"}}'
      )

      createScript(
        'analytic',
        `{"utility" : "analytics", "siteID": ${environment.EU_Analytics_Site_ID}, "instance": "europa.eu", "explicit": true}`
      )
    }
  }, [])

  return (
    <div className="site-header">
      <div className="container-fluid">
        <a href="https://ec.europa.eu/info/index_en">
          <img
            alt="EC Logo"
            src="https://commission.europa.eu/themes/contrib/oe_theme/dist/ec/images/logo/positive/logo-ec--en.svg"
            height="50"
            className="mr-2"
          />
        </a>
      </div>
    </div>
  )
}

export default SiteHeader
