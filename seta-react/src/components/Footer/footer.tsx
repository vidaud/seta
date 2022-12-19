//footer
// import React from 'react';
import './style.css';

const Footer = () => {

    return (
        <div className="footer">
            <div className="footer-section">
                <ul className="section">
                    <li className="title">SeTA JRC</li>
                    <li className="description">This site is managed by the Directorate-General for "DG identification"</li>
                </ul>
                <ul className="section">
                    <li className="listHeader">Contact Us</li>
                    <li className="listUl">Contact information of the DG</li>
                    <li className="listUl">Accessibility</li>
                </ul>
                <ul className="section">
                    <li className="listHeader">About Us</li>
                    <li className="listUl">Information about the DG</li>
                </ul>
            </div>
            <div className="footer-section">
                <ul className="section footer__divider">
                    <img alt="logo" src="https://ec.europa.eu/component-library/playground/ec/static/media/logo-ec--en.4369895b.svg" height="40" className="mr-2"></img>
                </ul>
                <ul className="section footer__divider">
                    <li><a className="listUl" href="https://ec.europa.eu/info/about-european-commission/contact_en">Contact the European Commission</a></li>
                    <li><a className="listUl" href="https://european-union.europa.eu/contact-eu/social-media-channels_en#/search?page=0&institutions=european_commission">Follow the European Commission on social media</a></li>
                    <li><a className="listUl" href="https://ec.europa.eu/info/resources-partners_en">Resources for partners</a></li>
                </ul>
                <ul className="section footer__divider">
                    <li><a className="listUl" href="https://ec.europa.eu/info/languages-our-websites_en">Languages on our website</a></li>
                    <li><a className="listUl" href="https://ec.europa.eu/info/cookies_en">Cookies</a></li>
                    <li><a className="listUl" href="https://ec.europa.eu/info/privacy-policy_en">Privacy Policy</a></li>
                    <li><a className="listUl" href="https://ec.europa.eu/info/legal-notice_en">Legal notice</a></li>
                </ul>
            </div>
        </div>
    );
}
export default Footer;