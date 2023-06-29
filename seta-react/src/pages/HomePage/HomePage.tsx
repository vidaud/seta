import React from 'react'
import {
  createStyles,
  Container,
  Title,
  Text,
  rem,
  Button,
  Image,
  Group,
  Modal
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import TextTransition, { presets } from 'react-text-transition'

import image from '../../images/background.jpg'
import image1 from '../../images/search_features.gif'

const useStyles = createStyles(theme => ({
  wrapper: {
    position: 'relative',
    paddingTop: rem(180),
    paddingBottom: rem(200),
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
  },

  control: {
    height: rem(42),
    fontSize: theme.fontSizes.md,

    '&:not(:first-of-type)': {
      marginLeft: theme.spacing.md
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

  React.useEffect(() => {
    const intervalId = setInterval(
      () => setIndex(index => index + 1),
      5000 // every  seconds
    )

    return () => clearTimeout(intervalId)
  }, [])

  const [opened, { open, close }] = useDisclosure(false)

  return (
    <>
      <Modal opened={opened} onClose={close} withCloseButton={true} size="auto">
        <h1 className={classes.title}>Hello!</h1>
        <Image src={image1} alt="Search page" />
        <br />
        <input type="checkbox" /> Don't Show me again
      </Modal>
      <div className={classes.wrapper}>
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
          <div className={classes.controls}>
            <Group position="center">
              <Button onClick={open}>Get Started</Button>
            </Group>
          </div>
        </Container>
      </div>
    </>
  )
}

export default HomePage
