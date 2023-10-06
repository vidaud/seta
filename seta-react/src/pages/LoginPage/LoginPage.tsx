import { Button, Paper, Text, Title, Group, Box, createStyles, Image } from '@mantine/core'
import { FaSignInAlt } from 'react-icons/fa'
import { RxAvatar } from 'react-icons/rx'

import image from '../../images/login-image.png'

import './style.css'

const useStyles = createStyles(() => ({
  login: {
    width: '100%',
    margin: 'auto',
    justifyContent: 'center',
    display: 'inline-grid'
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
    <div className="card-position">
      <Paper radius="xs" shadow="sm" p="md" className="card-style" h="auto" withBorder>
        <Group sx={{ display: 'inline-flex' }}>
          <Box>
            <Image src={image} radius="sm" w={284} h={200} />
          </Box>
          <Group w="55%" sx={{ placeContent: 'center' }}>
            <Title order={2} mt="sm" ta="center">
              Account Login
            </Title>

            <Text color="gray" pb="sm">
              Login to SeTA using your ECAS credentials
            </Text>

            <Group className={classes.login}>
              <RxAvatar size={50} color="#228be6" style={{ width: '100%' }} />
              <Button
                className="p-button-rounded"
                onClick={loginEcas}
                leftIcon={<FaSignInAlt size={14} />}
              >
                EU Login
              </Button>
            </Group>
          </Group>
        </Group>
      </Paper>
    </div>
  )
}

export default LoginPage
