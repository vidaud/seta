import { Menubar, InputText } from 'primereact';
import { Button } from 'primereact/button';
import './style.css';
import { useEffect, useRef, useState } from 'react';
import storageService from '../../services/storage.service';
import { TieredMenu } from 'primereact/tieredmenu';
import authentificationService from '../../services/authentification.service';

const Header = () => {
    const dashboard = useRef<any>(null) ;
    const [authenticated, setauthenticated] = useState<boolean>();


    useEffect(() => {
        if(storageService.isLoggedIn()){
            setauthenticated(true);
        }
        else {
            setauthenticated(false);
        }
    }, []);

    const items_seta = [
        {
            label: 'Search',
            className: 'seta-item',
            url: '/seta-ui/search',
            visible: authenticated,
        },
        {
            label: 'About',
            className: 'seta-item',
            url: '/seta-ui/about',
        },
        {
            label: 'Contact',
            className: 'seta-item',
            url: '/seta-ui/contact',
        }
    ];

    const dashboard_menu = [
        {
            label:'Profile',
            icon:'pi pi-fw pi-user',
            url: '/seta-ui/profile',
        },
        {
            label:'Dashboard',
            icon:'pi pi-fw pi-wrench',
            url: '/seta-ui/dashboard',
        },
        {
            separator:true
        },
        {
            label:'Sign Out',
            icon:'pi pi-fw pi-sign-out',
            // url: '/logout/ecas',
            command: () => {
                authentificationService.setaLogout();
            }
        }
    ];
    const start_seta = <img alt="logo" src="https://raw.githubusercontent.com/AdrianaLleshi/new_deck.gl/master/images/SeTA-logocut-negative.png" height="40" className="mr-2"></img>;
    const end_seta = <a href='/seta-ui/login'><span className="p-menuitem-icon pi pi-sign-in p-menuitem p-menuitem-link" /></a>

    const logout = <div><TieredMenu model={dashboard_menu} popup ref={dashboard} id="overlay_tmenu" />
    <Button icon="pi pi-user" onClick={(event) => dashboard.current.toggle(event)} aria-haspopup aria-controls="overlay_tmenu"/></div>

    return (
        <div>
            <header className="site-header">
                <div className="container-fluid">
                    <a href="https://ec.europa.eu/info/index_en">
                        <img alt="logo" src="https://commission.europa.eu/themes/contrib/oe_theme/dist/ec/images/logo/positive/logo-ec--en.svg" height="40" className="mr-2"></img>
                    </a>
                    <div className="p-inputgroup searches">
                        <InputText placeholder="Search" type="text" className='search-form'/>
                        <Button label="Search" className='searchButton'/>
                    </div>
                </div>
            </header>
            
            <header className="seta-header">
                <Menubar model={items_seta} start={start_seta} end={authenticated === true ? logout : end_seta} />
            </header>
        </div>
    );
}
export default Header;