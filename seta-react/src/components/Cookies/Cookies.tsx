import { useEffect, useState } from 'react'
import { Button, Text, Group, createStyles, Dialog, Box, Anchor, ActionIcon } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { FaInfo } from 'react-icons/fa'

import { formatCookie, hasCookie } from '~/utils/cookie'

const useStyles = createStyles(() => ({
  button: {
    backgroundColor: '#004494',
    color: 'white',
    padding: '10px 16px',
    font: 'normal normal 400 16px/20px arial, sans-serif',
    fontWeight: 700,
    borderRadius: 0,
    borderWidth: 0,
    '&:hover': {
      backgroundColor: '#002f67'
    }
  },
  div: {
    backgroundColor: '#ebebeb',
    width: '100%',
    bottom: 0,
    right: 0,
    maxWidth: '100%',
    position: 'fixed',
    zIndex: 100,
    left: 0,
    borderRadius: 0,
    padding: '24px !important'
  },
  box: {
    display: 'flex',
    gap: '2rem',
    [`@media (max-width: 89em)`]: {
      padding: '0 2rem'
    },
    [`@media (min-width: 90em)`]: {
      padding: '0 8rem'
    }
  },
  group: {
    [`@media (max-width: 89em)`]: {
      display: 'contents'
    }
  }
}))
const CookiesBanner = () => {
  const { classes } = useStyles()
  const [opened, { toggle, close }] = useDisclosure(true)
  const [isCookie, setCookies] = useState(false)
  const ALL_COOKIE_NAME = 'acck'
  const ESSENTIAL_COOKIE_NAME = 'ecck'
  const rand_value = Math.random().toString(36).substring(3, 11).toUpperCase()

  useEffect(() => {
    if (hasCookie(ALL_COOKIE_NAME) || hasCookie(ESSENTIAL_COOKIE_NAME)) {
      setCookies(false)
    } else {
      setCookies(true)
    }
  }, [])

  const setCookie = function (value: string) {
    document.cookie = value
  }

  return (
    <>
      {isCookie ? (
        <Dialog
          opened={opened}
          withCloseButton={false}
          onClose={close}
          radius="md"
          className={classes.div}
          bottom={0}
          right={0}
        >
          <Box className={classes.box}>
            <Group position="apart" mb="xs" className={classes.group}>
              {/* <IconInfoCircle size={32} strokeWidth={3} fill="#004494" color="white" /> */}
              <ActionIcon
                variant="filled"
                size={32}
                style={{ borderRadius: '25px', backgroundColor: '#004494' }}
              >
                <FaInfo size="sx" style={{ padding: '6px' }} />
              </ActionIcon>
              <Text fz="md" color="black">
                This site uses cookies to offer you a better browsing experience. Find out more on{' '}
                <Anchor href="https://commission.europa.eu/cookies-policy_en" target="_blank">
                  how we use cookies.
                </Anchor>
              </Text>
              {/* <CloseButton /> */}
            </Group>

            <Group position="right" className={classes.group}>
              <Button
                variant="default"
                className={classes.button}
                onClick={() => {
                  toggle()
                  const formatted = formatCookie(ALL_COOKIE_NAME, rand_value, { expiryDays: 180 })

                  setCookie(formatted)
                }}
              >
                Accept all cookies
              </Button>
              <Button
                variant="outline"
                className={classes.button}
                onClick={() => {
                  toggle()
                  const formatted = formatCookie(ESSENTIAL_COOKIE_NAME, rand_value, {
                    expiryDays: 180
                  })

                  setCookie(formatted)
                }}
              >
                Accept only essential cookies
              </Button>
            </Group>
          </Box>
        </Dialog>
      ) : null}
    </>
  )
}

export default CookiesBanner
