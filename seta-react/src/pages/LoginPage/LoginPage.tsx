import { useEffect, useState } from 'react'
import {
  Box,
  Container,
  Title,
  Text,
  Paper,
  Group,
  Button,
  Divider,
  createStyles
} from '@mantine/core'
import { FaSignInAlt } from 'react-icons/fa'
import { RxAvatar } from 'react-icons/rx'

import './style.css'

import { useThirdPartyAuthenticators } from '~/api/authentication/third-party-authenticators'

import GithubButton from './component/GithubButton'

const useStyles = createStyles(() => ({
  box: { backgroundColor: '#eaedf1' },
  icon: {
    width: '100%'
  },
  group: {
    justify: 'space-between',
    justifyContent: 'center'
  }
}))

const LoginPage = () => {
  const { classes } = useStyles()
  const { data } = useThirdPartyAuthenticators()
  const [hasGit, setHasGit] = useState(false)

  useEffect(() => {
    let result

    if (data != null) {
      result = data.find(authenticator => authenticator.name.includes('GitHub'))
      setHasGit(result?.name === 'GitHub' ? true : false)
    }
  }, [hasGit, data])

  const loginEcas = () => {
    login('/authentication/v1/login/ecas')
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
    <Box className={classes.box}>
      <Container size={330} my={40}>
        <Title ta="center">Welcome</Title>

        <Paper mih={300} withBorder shadow="md" p={30} mt={30} radius="md" id="login_page">
          <RxAvatar size={100} className={classes.icon} color="#228be6" />
          <Group className={classes.group} mt="lg">
            <Text c="dimmed">Login With</Text>
          </Group>
          <Button fullWidth mt="xl" leftIcon={<FaSignInAlt size={14} />} onClick={loginEcas}>
            EU Login
          </Button>
          {hasGit ? (
            <>
              <Divider label="Or continue with" labelPosition="center" my="lg" />
              <Group grow mb="md" mt="md">
                <GithubButton radius="xl">Github</GithubButton>
              </Group>
            </>
          ) : null}
        </Paper>
      </Container>
    </Box>
  )
}

export default LoginPage
