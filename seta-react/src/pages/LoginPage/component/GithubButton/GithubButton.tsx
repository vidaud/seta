import type { ButtonProps } from '@mantine/core'
import { Button } from '@mantine/core'
import { FaGithub } from 'react-icons/fa'

const GithubButton = (props: ButtonProps & React.ComponentPropsWithoutRef<'button'>) => {
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
    <Button
      leftIcon={<FaGithub style={{ width: '1rem', height: '1rem' }} color="#172b4d" />}
      variant="default"
      {...props}
      onClick={loginGithub}
    />
  )
}

export default GithubButton
