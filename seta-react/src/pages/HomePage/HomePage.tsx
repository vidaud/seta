import React from 'react'
import { createStyles, Container, Title, Text, rem, Group, BackgroundImage } from '@mantine/core'
import TextTransition, { presets } from 'react-text-transition'

import ModalPage from './components/modal/ModalPage'

import image from '../../images/background.jpg'

const useStyles = createStyles(theme => ({
  wrapper: {
    position: 'relative',
    paddingTop: `calc(${theme.spacing.xl} * 5)`,
    paddingBottom: `calc(${theme.spacing.xl} * 5)`,
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  },

  title: {
    fontWeight: 800,
    fontSize: rem(40),
    letterSpacing: rem(-1),
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    color: theme.white,
    marginBottom: 100,
    textAlign: 'center',
    fontFamily: `Greycliff CF, ${theme.fontFamily}`
  },

  controls: {
    marginTop: 100,
    display: 'flex',
    justifyContent: 'center',
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,

    [theme.fn.smallerThan('xs')]: {
      flexDirection: 'column'
    }
  }
}))
const TEXTS = [
  "Connect, Share and Learn: Explore SeTA's Thriving Communities",
  'Revolutionize Document Analysis with SeTA: Visualize Concepts and Track Development Over Time',
  "Unlock the Power of Textual Data with SeTA's Advanced Text Analysis Techniques"
]

const HomePage = () => {
  const { classes } = useStyles()
  const [index, setIndex] = React.useState(0)
  const [isCookie, setCookie] = React.useState(true)
  const COOKIE_NAME = 'intro_cookie'

  React.useEffect(() => {
    const intervalId = setInterval(
      () => setIndex(index => index + 1),
      5000 // every  seconds
    )

    return () => clearTimeout(intervalId)
  }, [])

  React.useEffect(() => {
    const cookies = document.cookie.split(';')

    cookies.forEach(cookie => {
      if (cookie.trim().includes(`${COOKIE_NAME}`)) {
        console.log('there is a cookie')
        setCookie(false)
      }
    })
  }, [])

  return (
    <>
      <div className={classes.wrapper}>
        <BackgroundImage src={image} radius="xs">
          <Container size={940}>
            <Title className={classes.title}>
              <TextTransition springConfig={presets.stiff}>
                <Text
                  component="span"
                  inherit
                  variant="gradient"
                  gradient={{ from: 'blue', to: 'white' }}
                >
                  {TEXTS[index % TEXTS.length]}
                </Text>
              </TextTransition>
            </Title>
            {isCookie && (
              <div className={classes.controls}>
                <Group position="center">
                  <ModalPage />
                </Group>
              </div>
            )}
          </Container>
        </BackgroundImage>
      </div>
    </>
  )
}

export default HomePage
