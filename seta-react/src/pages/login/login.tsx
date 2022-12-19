// import React from 'react';
import './style.css';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import LoginGithub from 'react-login-github';

const Login = () => {
    const onSuccess = response => console.log(response);
    const onFailure = response => console.error(response);
    const onLoadingClick = () => {
        window.location.href = "/login/ecas";
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
                    {/* <Button className="github p-0" aria-label="GitHub">
                        <i className="pi pi-github px-2"></i>
                        <span className="px-3">GitHub</span>
                    </Button> */}
                    <LoginGithub
                        clientId="4bf0eaaa735edb646c68"
                        clientSecret='ee706005fd81dada822b10fdd389ebc3caeca79f'
                        redirectUri='http://localhost:3000/seta-ui/login-options'
                        onSuccess={onSuccess}
                        onFailure={onFailure}
                    />
                </div>
            </Card>
        </div>
        );
    }
export default Login;