import React from 'react'
import { createStyles, Container, Title, Text, rem, Button, Image, Group } from '@mantine/core'
import { modals } from '@mantine/modals'
import TextTransition, { presets } from 'react-text-transition'

import image from '../../images/background.jpg'
import image7 from '../../images/communities_1.png'
import image8 from '../../images/communities_2.png'
import image9 from '../../images/communities_3.png'
import image1 from '../../images/search_1.png'
import image2 from '../../images/search_2.png'
import image4 from '../../images/search_results.png'
import image5 from '../../images/search_results_2.png'
import image6 from '../../images/search_results_3.png'
import image3 from '../../images/search_upload.png'

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
  },

  titleModal: {
    fontWeight: 800,
    fontSize: rem(40),
    letterSpacing: rem(-1),
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    color: theme.colors.blue,
    textAlign: 'center',
    fontFamily: `Greycliff CF, ${theme.fontFamily}`
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

  return (
    <>
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
              <Button
                className={classes.control}
                variant="white"
                size="lg"
                onClick={() =>
                  modals.openConfirmModal({
                    closeOnConfirm: false,
                    labels: { confirm: 'Next', cancel: 'Skip' },
                    size: '75%',
                    children: (
                      <>
                        <h1 className={classes.titleModal}> Welcome to SeTA</h1>
                        <Text size="md">
                          An online search engine tool designed to search for metadata on the SeTA
                          database based on the user's search query. It sorts the results, and makes
                          an ordered list of these results according to the search algorithms.
                        </Text>
                        <Image src={image1} alt="Search page" />
                        <input type="checkbox" /> Don't Show me again
                      </>
                    ),
                    onConfirm: () =>
                      modals.openConfirmModal({
                        labels: { confirm: 'Next', cancel: 'Back' },
                        size: '75%',
                        closeOnConfirm: false,
                        children: (
                          <>
                            <br />
                            <Image src={image2} alt="Communities" />
                          </>
                        ),
                        onConfirm: () =>
                          modals.openConfirmModal({
                            labels: { confirm: 'Next', cancel: 'Back' },
                            size: '75%',
                            closeOnConfirm: false,
                            children: (
                              <>
                                <br />
                                <Image src={image3} alt="Communities" />
                              </>
                            ),
                            onConfirm: () =>
                              modals.openConfirmModal({
                                title: 'Communities',
                                labels: { confirm: 'Close', cancel: 'Back' },
                                size: '75%',
                                closeOnConfirm: false,
                                children: (
                                  <>
                                    <Text size="md">
                                      The communities of the SeTA software application are a shared
                                      space where members engage with another to connect and learn
                                      about similar interests, opinions of different type of
                                      publications.
                                    </Text>
                                    <br />
                                    <Image src={image4} alt="Communities" />
                                  </>
                                ),
                                onConfirm: modals.closeAll
                              })
                          })
                      })
                  })
                }
              >
                Get Started
              </Button>
            </Group>
          </div>
        </Container>
      </div>
    </>
  )
}

export default HomePage
