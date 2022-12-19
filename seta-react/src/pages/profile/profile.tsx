import { useEffect, useState } from 'react'
import authentificationService from '../../services/authentification.service';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import './style.css';
import storageService from '../../services/storage.service';
import { User } from '../../models/user.model';

function Profile(props) {
  let currentUser: User | any = null;

  //const currentUser = authentificationService.loadProfile();
  useEffect(() => {
    if(storageService.isLoggedIn()){
        // const [user, setUser] = useState<User | null>(null);
        //currentUser = authentificationService.currentUserSubject;
        currentUser = storageService.getUser();
        // setUser(currentUser);
        console.log(currentUser);
        // console.log(user);
    }
    console.log(currentUser);
    }, []);
    console.log(currentUser);

  return (
    <div className="page">
        <div className="card">
                <div>
                    <div className="p-fluid grid">
                        <div className="field col-12 md:col-6">
                            <div className="p-inputgroup">
                                <span className="p-inputgroup-addon">
                                    <i className="pi pi-user"></i>
                                </span>
                                <span className="p-float-label">
                                    <InputText id="email" type="text" value={'Adriana.LLESHI@ext.ec.europa.eu'} disabled />
                                    <label htmlFor="email">Email</label>
                                </span>
                            </div>
                        </div>
                        <div className="field col-12 md:col-6">
                            <span className="p-float-label">
                                <InputText id="username" type="text" value={'llesadr'} disabled />
                                <label htmlFor="username">Username</label>
                            </span>
                        </div>
                        <div className="field col-12 md:col-6">
                            <span className="p-float-label">
                            <InputText id="firstName" type="text" value={'Adriana'} disabled />
                                <label htmlFor="FirstName">First Name</label>
                            </span>
                        </div>
                        <div className="field col-12 md:col-6">
                            <span className="p-float-label">
                            <InputText id="lastName" type="text" value={'Lleshi'} disabled />
                                <label htmlFor="lastName">Last Name</label>
                            </span>
                        </div>
                        <div className='publicKey'>
                            <div className="field col-12 md:col-6">
                                <span className="p-float-label">
                                <InputText id="publicKey" type="text" value={'No Public Key'} disabled />
                                    <label htmlFor="publicKey">Public Key</label>
                                </span>
                            </div>
                            <Button icon="pi pi-trash" className="p-button-rounded p-button-text" aria-label="Delete Public Key" />
                            <Button icon="pi pi-refresh" className="p-button-rounded p-button-text" aria-label="Refresh Public Key" />
                        </div>
                    </div>
                    <div>
                        <Button icon='pi pi-user' className='p-button-icon-left'>Delete User</Button>
                    </div>
                </div>
            </div>
    </div>
  );
}

export default Profile;