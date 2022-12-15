import { Menubar } from 'primereact/menubar';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import './style.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import storageService from '../../services/storage.service';

const Header = () => {
    const [authenticated, setauthenticated] = useState<boolean>();
    //const [currentTime, setCurrentTime] = useState(null);

    // useEffect(() => {
    //     axios.get('/login/')
    //     .then(res => {
    //         const persons = res.data;
    //         setCurrentTime(persons);
    //   })
    // }, []);
    useEffect(() => {
        if(storageService.isLoggedIn()){
            setauthenticated(true);
            console.log(storageService.getUser());
        }
        else {
            setauthenticated(false);
        }
    }, []);
    const items_seta = [
        // {
        //     label: '',
        //     className: 'seta-item',
        //     url: '/',
        //     icon: () => <img alt="logo" src="https://raw.githubusercontent.com/AdrianaLleshi/new_deck.gl/master/images/SeTA-logocut-negative.png" height="40" className="mr-2"></img>
        // },
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
    // const start = <img alt="logo" src="https://ec.europa.eu/info/sites/default/themes/europa/images/svg/logo/logo--en.svg" height="40" className="mr-2"></img>;
    const start_seta = <img alt="logo" src="https://raw.githubusercontent.com/AdrianaLleshi/new_deck.gl/master/images/SeTA-logocut-negative.png" height="40" className="mr-2"></img>;
    // const end = <InputText placeholder="Search" type="text" />;
    const end_seta = <a href='/seta-ui/login-options'><span className="p-menuitem-icon pi pi-user p-menuitem p-menuitem-link" /></a>
    const logout = <a href='/logout/ecas'><span className="p-menuitem-icon pi pi-power-off p-menuitem p-menuitem-link" /></a>

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
                    {/* <InputText placeholder="Search" type="text" className='search-form'/> */}
                </div>
            </header>
            
            <header className="seta-header">
                <Menubar model={items_seta} start={start_seta} end={authenticated === true ? logout : end_seta} />
                <a href="/logout/ecas">
                    <button>Logout</button>
                </a>
            </header>
        </div>
    );
}
export default Header;