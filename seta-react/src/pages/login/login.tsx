import './style.css';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import LoginGithub from 'react-login-github';
import authentificationService from '../../services/authentification.service';
import {User} from './../../models/user.model'
import { useEffect } from 'react';

const Login = () => {
    const currentUser: User = null!;
    const onSuccess = response => console.log(response);
    const onFailure = response => console.error(response);
    const onLoadingClick = () => {
        window.location.href = "/login/ecas";
    }
    useEffect(() => {
        // authentificationService.currentUserSubject.asObservable().subscribe((currentUser: User) => {
        //     currentUser = currentUser
        //   })
    }, []);

    function logout() {
        authentificationService.setaLogout();

      }
    return (
        <div className='card-position'>
            <Card title="Account Login" className='card-style'>
                <Button label="EU Login" className="p-button-rounded" onClick={onLoadingClick}/>
                <div>
                    <h5>OR</h5>
                    <hr className="solid"></hr>
                </div>
                <div>
                    <h5>Sign in with your social account</h5>
                    <LoginGithub
                        clientId="4bf0eaaa735edb646c68"
                        clientSecret='ee706005fd81dada822b10fdd389ebc3caeca79f'
                        redirectUri='http://localhost:3000/seta-ui/login'
                        onSuccess={onSuccess}
                        onFailure={onFailure}
                    />
                </div>
            </Card>
        </div>
        );
    }
export default Login;