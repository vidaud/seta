import { Box, Button, Paper, Group, Title, Text, Container, createStyles } from '@mantine/core'
import { FaSignInAlt } from 'react-icons/fa'
import { RxAvatar } from 'react-icons/rx'
import '../../style.css'

const useStyles = createStyles(() => ({
  box: { backgroundColor: '#eaedf1' },
  icon: {
    marginTop: 'inherit',
    width: '100%'
  },
  group: {
    justify: 'space-between',
    justifyContent: 'center'
  }
}))

const LoginPage = () => {
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
        </Paper>
      </Container>
    </Box>
  )
}

export default LoginPage
