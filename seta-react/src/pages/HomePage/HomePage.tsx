import React from 'react'
import { createStyles, Container, Title, Text, rem } from '@mantine/core'
import TextTransition, { presets } from 'react-text-transition'

import image from '~/images/background.jpg'

const useStyles = createStyles(theme => ({
  wrapper: {
    position: 'relative',
    paddingTop: `calc(${theme.spacing.xl}*8)`,
    paddingBottom: `calc(${theme.spacing.xl}*7.4)`,
    backgroundImage: 'url(' + image + ')',
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
  "Connect, Share and Learn: Explore SeTA's Thriving Datasources",
  'Revolutionize Document Analysis with SeTA: Visualize Concepts and Track Development Over Time',
  "Unlock the Power of Textual Data with SeTA's Advanced Text Analysis Techniques"
]

const HomePage = () => {
  const { classes } = useStyles()
  const [index, setIndex] = React.useState(0)

  React.useEffect(() => {
    const intervalId = setInterval(
      // eslint-disable-next-line @typescript-eslint/no-shadow
      () => setIndex(index => index + 1),
      5000 // every  seconds
    )

    return () => clearTimeout(intervalId)
  }, [])

  return (
    <>
      <div className={classes.wrapper}>
        <Container size={1040}>
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
        </Container>
      </div>
    </>
  )
}

export default HomePage
