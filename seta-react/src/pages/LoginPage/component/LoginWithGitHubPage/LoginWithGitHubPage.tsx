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

import '../../style.css'
import GithubButton from '../GithubButton'

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

const LoginWithGitHubPage = () => {
  const { classes } = useStyles()
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
    <Box className={classes.box}>
      <Container size={330} my={40}>
        <Title ta="center">Welcome</Title>

        <Paper mih={300} withBorder shadow="md" p={30} mt={30} radius="md">
          <RxAvatar size={100} className={classes.icon} color="#228be6" />
          <Group className={classes.group} mt="lg">
            <Text c="dimmed">Login With</Text>
          </Group>
          <Button fullWidth mt="xl" leftIcon={<FaSignInAlt size={14} />} onClick={loginEcas}>
            EU Login
          </Button>
          <Divider label="Or continue with" labelPosition="center" my="lg" />
          <Group grow mb="md" mt="md">
            <GithubButton radius="xl">Github</GithubButton>
          </Group>
        </Paper>
      </Container>
    </Box>
  )
}

export default LoginWithGitHubPage
