import { useEffect } from 'react'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'

import { createScript, loadWebTool } from '~/components/Header/util'

import { environment } from '~/environments/environment'

const SiteHeader = () => {
  const existingScript = document.getElementById('header')

  useEffect(() => {
    if (!existingScript) {
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
  }, [existingScript])

  return (
    <div className="site-header">
      <div className="container-fluid">
        <a href="https://ec.europa.eu/info/index_en">
          <img
            alt="EC Logo"
            src="https://commission.europa.eu/themes/contrib/oe_theme/dist/ec/images/logo/positive/logo-ec--en.svg"
            height="40"
            className="mr-2"
          />
        </a>

        <div className="p-inputgroup searches">
          <InputText placeholder="Search" type="text" className="search-form" />
          <Button
            label="Search"
            className="searchButton"
            tooltip="Search on the website"
            tooltipOptions={{ className: 'blue-tooltip', position: 'right' }}
          />
        </div>
      </div>
    </div>
  )
}

export default SiteHeader
