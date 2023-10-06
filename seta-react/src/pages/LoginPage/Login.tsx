import './style.css'
import LoginPage from './LoginPage'
import LoginWithGitHubPage from './LoginWithGitHubPage'

const Login = () => {
  const hasGitHub = import.meta.env.VITE_IDENTITY_PROVIDERS?.split(',').includes('GitHub')

  return <>{hasGitHub ? <LoginWithGitHubPage /> : <LoginPage />}</>
}

export default Login
