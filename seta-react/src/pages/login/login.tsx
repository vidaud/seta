import './style.css';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';

const Login = () => {
    const onLoadingClick = () => {
        window.location.href = "/login/ecas";
    }
    const loginGithub = () => {
        window.location.href = "/login/github";
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
                    <Button className="github p-1" aria-label="GitHub" onClick={loginGithub}>
                        <i className="pi pi-github px-2"></i>
                        <span className="px-3">GitHub</span>
                    </Button>
                </div>
            </Card>
        </div>
        );
    }
export default Login;