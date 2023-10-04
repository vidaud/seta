import { Button } from 'primereact/button'
import { Card } from 'primereact/card'

import './style.css'

const LoginWithGitHubPage = () => {
  const loginEcas = () => {
    login('/seta-ui/api/v1/login/ecas')
  }
  const loginGithub = () => {
    login('/seta-ui/api/v1/login/github')
  }

  const login = (url: string) => {
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)

    if (urlParams.has('redirect')) {
      window.location.href = url + '?redirect=' + urlParams.get('redirect')
    } else {
      window.location.href = url
    }
  }

  return (
    <div className="card-position">
      <Card title="Account Login" className="card-style">
        <Button label="EU Login" className="p-button-rounded" onClick={loginEcas} />
        <div>
          <h5>OR</h5>
          <hr className="solid" />
        </div>
        <div>
          <h5>Sign in with your social account</h5>
          <Button className="github p-1" aria-label="GitHub" onClick={loginGithub}>
            <i className="pi pi-github px-2" />
            <span className="px-3">GitHub</span>
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default LoginWithGitHubPage
