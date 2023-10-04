import { RiShareBoxFill } from 'react-icons/ri'
import { useNavigate } from 'react-router-dom'

import * as S from './styles'

const Footer = () => {
  const navigate = useNavigate()
  const doc_link = window.location.origin + '/docs/'

  return (
    <div css={S.footer}>
      <div className="flex">
        <ul css={S.section}>
          <li className="title">Joint Research Centre Semantic Text Analysis (SeTA)</li>
          <li />
          <li className="description">This site is managed by the Joint Research Centre</li>
        </ul>

        <ul css={S.section}>
          <li className="header">Contact Us</li>
          <li className="link" onClick={() => navigate(`/contact`)}>
            Contact information
          </li>

          <li className="column">Documentation</li>
          <li>
            <a href={doc_link}>SeTA Docs</a>
          </li>
        </ul>

        <ul css={S.section}>
          <li className="header">About Us</li>
          <li>
            <a href="https://joint-research-centre.ec.europa.eu/select-language?destination=/node/1">
              EU Science Hub
            </a>
          </li>

          <li className="column">Related Sites</li>
          <li>
            <a href="https://data.jrc.ec.europa.eu/">JRC Data Catalogue</a>
          </li>
        </ul>
      </div>

      <div className="flex">
        <ul css={[S.section, S.withDivider]}>
          <li>
            <a href="https://commission.europa.eu/index_en">
              <img
                alt="logo"
                src="https://ec.europa.eu/component-library/playground/ec/static/media/logo-ec--en.4369895b.svg"
                height="40"
                className="mr-2"
              />
            </a>
          </li>
        </ul>

        <ul css={[S.section, S.withDivider]}>
          <li>
            <a href="https://commission.europa.eu/about-european-commission/contact_en">
              Contact the European Commission
            </a>
          </li>
          <li>
            <a href="https://european-union.europa.eu/contact-eu/social-media-channels_en">
              Follow the European Commission on social media{' '}
              <RiShareBoxFill size={20} color="white" />
            </a>
          </li>
          <li>
            <a href="https://commission.europa.eu/resources-partners_en">Resources for partners</a>
          </li>
        </ul>

        <ul css={[S.section, S.withDivider]}>
          <li>
            <a href="https://commission.europa.eu/languages-our-websites_en">Language policy</a>
          </li>
          <li>
            <a href="https://commission.europa.eu/cookies-policy_en">Cookies</a>
          </li>
          <li>
            <a href="https://commission.europa.eu/privacy-policy-websites-managed-european-commission_en">
              Privacy Policy
            </a>
          </li>
          <li>
            <a href="https://commission.europa.eu/legal-notice_en">Legal notice</a>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Footer
