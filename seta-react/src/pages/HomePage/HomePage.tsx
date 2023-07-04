import React, { useState } from 'react'
import { createStyles, Container, Title, Text, rem, Button, Image, Group } from '@mantine/core'
import { modals } from '@mantine/modals'
import TextTransition, { presets } from 'react-text-transition'

import image from '../../images/background.jpg'
import image1 from '../../images/communities_1_join_badge.png'
import image2 from '../../images/communities_1_join_msg_badge.png'
import image3 from '../../images/communities_2_accepted_badge.png'
import image0 from '../../images/introduction.png'
import image4 from '../../images/search_1_badge.png'
import image5 from '../../images/search_3_border.png'
import image7 from '../../images/search_4_badge.png'
import image6 from '../../images/search_5_upload_text_badge.png'

const useStyles = createStyles(theme => ({
  wrapper: {
    position: 'relative',
    paddingTop: rem(190),
    paddingBottom: rem(210),
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
    color: theme.white,
    textAlign: 'center',
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    backgroundColor: `rgba(118, 113, 113)`,
    borderTopRightRadius: rem(10),
    borderTopLeftRadius: rem(10),
    borderBottomLeftRadius: rem(10),
    borderBottomRightRadius: rem(10)
  },

  titleText: {
    fontWeight: 400,
    fontSize: rem(15),
    letterSpacing: rem(-1),
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    color: theme.white,
    textAlign: 'center',
    fontFamily: `Greycliff CF, ${theme.fontFamily}`
  },

  dontShowMe: {
    float: 'left',
    paddingTop: rem(10),
    paddingLeft: rem(30)
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
  const [showButton, setShowButton] = useState(true)

  React.useEffect(() => {
    const intervalId = setInterval(
      () => setIndex(index => index + 1),
      5000 // every  seconds
    )

    return () => clearTimeout(intervalId)
  }, [])

  const toggleButton = () => {
    setShowButton(!showButton)
  }

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
              {showButton && (
                <Button
                  className={classes.control}
                  variant="white"
                  size="lg"
                  onClick={() =>
                    modals.openConfirmModal({
                      closeOnConfirm: false,
                      withCloseButton: true,
                      labels: { confirm: 'Next', cancel: 'Skip' },
                      size: '70%',
                      className: classes.titleText,
                      children: (
                        <>
                          <Image src={image0} alt="Presentation" />
                          <span className={classes.dontShowMe}>
                            <input type="checkbox" onClick={toggleButton} /> Don't Show me again
                          </span>
                        </>
                      ),
                      onConfirm: () =>
                        modals.openConfirmModal({
                          closeOnConfirm: false,
                          withCloseButton: true,
                          labels: { confirm: 'Next', cancel: 'Back' },
                          size: '70%',
                          children: (
                            <>
                              <Text className={classes.titleModal}>
                                SeTA communities offers a shared place, where users can have the
                                possibility to interact with others users about specific areas of
                                interest.
                              </Text>
                              <br />
                              <Image src={image1} alt="Communities" />
                              <span className={classes.dontShowMe}>
                                <input type="checkbox" onClick={toggleButton} /> Don't Show me again
                              </span>
                            </>
                          ),
                          onConfirm: () =>
                            modals.openConfirmModal({
                              labels: { confirm: 'Next', cancel: 'Back' },
                              size: '70%',
                              closeOnConfirm: false,
                              withCloseButton: true,
                              children: (
                                <>
                                  <Text className={classes.titleModal}>
                                    In SeTA there two types of communities: Public Communities and
                                    Private Communities
                                  </Text>
                                  <br />
                                  <Image src={image2} alt="Communities" />
                                  <span className={classes.dontShowMe}>
                                    <input type="checkbox" onClick={toggleButton} /> Don't Show me
                                    again
                                  </span>
                                </>
                              ),
                              onConfirm: () =>
                                modals.openConfirmModal({
                                  labels: { confirm: 'Next', cancel: 'Back' },
                                  size: '70%',
                                  closeOnConfirm: false,
                                  withCloseButton: true,
                                  children: (
                                    <>
                                      <Text className={classes.titleModal}>
                                        The status of the request remains “Pending” until the
                                        Community Owner accepts the request.
                                      </Text>
                                      <br />
                                      <Image src={image3} alt="Search" />
                                      <span className={classes.dontShowMe}>
                                        <input type="checkbox" onClick={toggleButton} /> Don't Show
                                        me again
                                      </span>
                                    </>
                                  ),
                                  onConfirm: () =>
                                    modals.openConfirmModal({
                                      closeOnClickOutside: false,
                                      labels: { confirm: 'Next', cancel: 'Back' },
                                      size: '70%',
                                      closeOnConfirm: false,
                                      withCloseButton: true,
                                      children: (
                                        <>
                                          <Text className={classes.titleModal}>
                                            As part of the access to the community data, it is
                                            possible to use the search functionality in large
                                            document collections.
                                          </Text>
                                          <br />
                                          <Image src={image4} alt="Search" />
                                        </>
                                      ),
                                      onConfirm: () =>
                                        modals.openConfirmModal({
                                          labels: { confirm: 'Next', cancel: 'Back' },
                                          size: '70%',
                                          closeOnConfirm: false,
                                          withCloseButton: true,
                                          children: (
                                            <>
                                              <Text className={classes.titleModal}>
                                                In the search by terms or phrase it is possible to
                                                apply a wizard so the search is enriched
                                                automatically by clicking on the wizard icon.
                                              </Text>
                                              <br />
                                              <Image src={image5} alt="Search" />
                                            </>
                                          ),
                                          onConfirm: () =>
                                            modals.openConfirmModal({
                                              labels: { confirm: 'Next', cancel: 'Back' },
                                              size: '70%',
                                              closeOnConfirm: false,
                                              withCloseButton: true,
                                              children: (
                                                <>
                                                  <Text className={classes.titleModal}>
                                                    With the option of search by document or text,
                                                    you can upload the elements with the cloud icon.
                                                  </Text>
                                                  <br />
                                                  <Image src={image6} alt="Search" />
                                                </>
                                              ),
                                              onConfirm: () =>
                                                modals.openConfirmModal({
                                                  labels: { confirm: 'Next', cancel: 'Back' },
                                                  size: '70%',
                                                  closeOnConfirm: false,
                                                  withCloseButton: true,
                                                  children: (
                                                    <>
                                                      <Text className={classes.titleModal}>
                                                        With the option of search by document or
                                                        text, you can upload the elements with the
                                                        cloud icon.
                                                      </Text>
                                                      <br />
                                                      <Image src={image6} alt="Search" />
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
                    })
                  }
                >
                  Get Started
                </Button>
              )}
            </Group>
          </div>
        </Container>
      </div>
    </>
  )
}

export default HomePage
