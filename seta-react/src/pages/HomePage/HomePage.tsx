import React from 'react'
import { createStyles, Container, Title, Text, rem, Button, Image, Group } from '@mantine/core'
import { modals } from '@mantine/modals'
import TextTransition, { presets } from 'react-text-transition'

import image from '../../images/background.jpg'
import image1 from '../../images/communities_1_join_badge.png'
import image2 from '../../images/communities_1_join_msg_badge.png'
import image3 from '../../images/communities_1_join_pending_badge.png'
import image4 from '../../images/search_1_badge.png'
import image5 from '../../images/search_2_badge.png'
import image6 from '../../images/search_3_badge.png'
import image7 from '../../images/search_4_badge.png'

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
    fontWeight: 600,
    fontSize: rem(20),
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
                    withCloseButton: true,
                    labels: { confirm: 'Next', cancel: 'Skip' },
                    size: '65%',
                    children: (
                      <>
                        <Text className={classes.titleModal}>
                          SeTA communities offers a shared place, where users can have the
                          possibility to interact with others users about specific areas of
                          interest.
                        </Text>
                        <Image src={image1} alt="Communities page" />
                        <div style={{ float: 'right' }}>
                          <input type="checkbox" /> Don't Show me again
                        </div>
                      </>
                    ),
                    onConfirm: () =>
                      modals.openConfirmModal({
                        labels: { confirm: 'Next', cancel: 'Back' },
                        size: '65%',
                        closeOnConfirm: false,
                        children: (
                          <>
                            <Text className={classes.titleModal}>
                              SeTA communities offers a shared place, where users can have the
                              possibility to interact with others users about specific areas of
                              interest.
                            </Text>
                            <Image src={image2} alt="Communities" />
                          </>
                        ),
                        onConfirm: () =>
                          modals.openConfirmModal({
                            labels: { confirm: 'Next', cancel: 'Back' },
                            size: '65%',
                            closeOnConfirm: false,
                            children: (
                              <>
                                <Image src={image3} alt="Communities" />
                              </>
                            ),
                            onConfirm: () =>
                              modals.openConfirmModal({
                                labels: { confirm: 'Next', cancel: 'Back' },
                                size: '65%',
                                closeOnConfirm: false,
                                children: (
                                  <>
                                    <Text className={classes.titleModal}>
                                      SeTA offers a search functionality in large document
                                      collections.
                                    </Text>
                                    <Image src={image4} alt="Search" />
                                  </>
                                ),
                                onConfirm: () =>
                                  modals.openConfirmModal({
                                    labels: { confirm: 'Next', cancel: 'Back' },
                                    size: '65%',
                                    closeOnConfirm: false,
                                    children: (
                                      <>
                                        <Image src={image5} alt="Search" />
                                      </>
                                    ),
                                    onConfirm: () =>
                                      modals.openConfirmModal({
                                        labels: { confirm: 'Next', cancel: 'Back' },
                                        size: '65%',
                                        closeOnConfirm: false,
                                        children: (
                                          <>
                                            <Image src={image6} alt="Search" />
                                          </>
                                        ),
                                        onConfirm: () =>
                                          modals.openConfirmModal({
                                            labels: { confirm: 'Close', cancel: 'Back' },
                                            size: '65%',
                                            closeOnConfirm: false,
                                            children: (
                                              <>
                                                <Image src={image7} alt="Search" />
                                              </>
                                            ),
                                            onConfirm: modals.closeAll
                                          })
                                      })
                                  })
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
