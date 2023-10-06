import './style.css'
import LoginPage from './component/LoginPage'
import LoginWithGitHubPage from './component/LoginWithGitHubPage/LoginWithGitHubPage'

const Login = () => {
  const hasGitHub = import.meta.env.VITE_IDENTITY_PROVIDERS?.split(',').includes('Github')

  return <>{hasGitHub ? <LoginWithGitHubPage /> : <LoginPage />}</>
}

export default Login
