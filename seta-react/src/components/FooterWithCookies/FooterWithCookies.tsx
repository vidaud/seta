import { useEffect } from 'react'

import * as S from './styles'
import { createCookie, loadCookie } from './util'

const FooterWithCookies = () => {
  const existingScript = document.getElementById('footer')

  useEffect(() => {
    if (!existingScript) {
      loadCookie('https://europa.eu/webtools/load.js')

      createCookie(
        'cookie',
        '{"utility" : "cck", "url": {"en": "https://commission.europa.eu/cookies-policy_en"}}'
      )

      createCookie(
        'analytic',
        '{"utility" : "analytics", "siteID": "b240c41b-yyyyy-40af-96ef-xxxxxxxx", "instance": "europa.eu", "explicit": true}'
      )
    }
  }, [existingScript])

  return (
    <>
      <div id="footer" css={S.footer}>
        <div className="flex">
          <ul css={S.section}>
            <li className="title">SeTA JRC</li>
            <li className="description">
              This site is managed by the Directorate-General for "DG identification"
            </li>
          </ul>

          <ul css={S.section}>
            <li className="header">Contact Us</li>
            <li>Contact information of the DG</li>
            <li>Accessibility</li>
          </ul>

          <ul css={S.section}>
            <li className="header">About Us</li>
            <li>Information about the DG</li>
          </ul>
        </div>

        <div className="flex">
          <ul css={[S.section, S.withDivider]}>
            <li>
              <img
                alt="logo"
                src="https://ec.europa.eu/component-library/playground/ec/static/media/logo-ec--en.4369895b.svg"
                height="40"
                className="mr-2"
              />
            </li>
          </ul>

          <ul css={[S.section, S.withDivider]}>
            <li>
              <a href="https://ec.europa.eu/info/about-european-commission/contact_en">
                Contact the European Commission
              </a>
            </li>
            <li>
              <a href="https://european-union.europa.eu/contact-eu/social-media-channels_en#/search?page=0&institutions=european_commission">
                Follow the European Commission on social media
              </a>
            </li>
            <li>
              <a href="https://ec.europa.eu/info/resources-partners_en">Resources for partners</a>
            </li>
          </ul>

          <ul css={[S.section, S.withDivider]}>
            <li>
              <a href="https://ec.europa.eu/info/languages-our-websites_en">
                Languages on our website
              </a>
            </li>
            <li>
              <a href="https://ec.europa.eu/info/cookies_en">Cookies</a>
            </li>
            <li>
              <a href="https://ec.europa.eu/info/privacy-policy_en">Privacy Policy</a>
            </li>
            <li>
              <a href="https://ec.europa.eu/info/legal-notice_en">Legal notice</a>
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}

export default FooterWithCookies
