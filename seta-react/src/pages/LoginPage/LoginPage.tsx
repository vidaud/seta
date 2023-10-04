import { Button, Paper, Text, Title, Divider } from '@mantine/core'
import { FaSignInAlt } from 'react-icons/fa'

import './style.css'

const LoginPage = () => {
  const loginEcas = () => {
    login('/seta-ui/api/v1/login/ecas')
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
      <Paper radius={0} shadow="sm" p="xs" className="card-style" h={200}>
        <Title order={2} mt="sm" mb="sm" ta="center">
          Account Login
        </Title>
        <Divider />
        <Text color="gray" pt="sm" pb="sm">
          Login to SeTA using your ECAS credentials
        </Text>
        <Button
          mt="md"
          className="p-button-rounded"
          onClick={loginEcas}
          leftIcon={<FaSignInAlt size={14} />}
        >
          EU Login
        </Button>
      </Paper>
    </div>
  )
}

export default LoginPage
