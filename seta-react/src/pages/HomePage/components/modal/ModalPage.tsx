import { useState } from 'react'
import { createStyles, Group, Button, Image, Progress, rem, Text } from '@mantine/core'
import { modals } from '@mantine/modals'

import image1 from '~/images/page_1.png'
import image2 from '~/images/page_2.png'
import image3 from '~/images/page_3.png'
import image4 from '~/images/page_4.png'
import image5 from '~/images/page_5.png'
import image6 from '~/images/page_6.png'
import image7 from '~/images/page_7.png'
import image8 from '~/images/page_8.png'

const useStyles = createStyles(theme => ({
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
    paddingTop: rem(15),
    paddingLeft: rem(40)
  },

  indicatorBar: {
    float: 'left',
    paddingTop: rem(10),
    paddingLeft: rem(100)
  }
}))

const ModalPage = () => {
  const { classes } = useStyles()
  const [showButton, setShowButton] = useState(true)

  const toggleButton = () => {
    if (showButton) {
      setShowButton(!showButton)
    } else {
      setShowButton(showButton)
    }
  }

  return (
    <Group position="center">
      {showButton && (
        <Button
          className={classes.control}
          variant="white"
          size="lg"
          onClick={() =>
            modals.openConfirmModal({
              closeOnConfirm: false,
              withCloseButton: false,
              closeOnClickOutside: true,
              labels: { confirm: 'Next', cancel: 'Skip' },
              size: '70%',
              children: (
                <>
                  <Text className={classes.titleModal}> Welcome to SeTA! </Text>
                  <br />
                  <Image src={image1} alt="Presentation" />
                  <Progress color="gray" value={12.5} size="md" radius="xl" />
                  <span className={classes.dontShowMe}>
                    <input type="checkbox" onClick={toggleButton} /> Don't show this again
                  </span>
                </>
              ),
              onCancel: modals.closeAll,
              onConfirm: () =>
                modals.openConfirmModal({
                  closeOnConfirm: false,
                  withCloseButton: false,
                  closeOnClickOutside: true,
                  labels: { confirm: 'Next', cancel: 'Skip' },
                  size: '70%',
                  children: (
                    <>
                      <Text className={classes.titleModal}>
                        SeTA communities offers a shared place, where users can have the possibility
                        to interact with others users about specific areas of interest.
                      </Text>
                      <br />
                      <Image src={image2} alt="Communities" />
                      <Progress color="gray" value={25} size="md" radius="xl" />
                      <span className={classes.dontShowMe}>
                        <input type="checkbox" onClick={toggleButton} /> Don't show this again
                      </span>
                    </>
                  ),
                  onCancel: modals.closeAll,
                  onConfirm: () =>
                    modals.openConfirmModal({
                      labels: { confirm: 'Next', cancel: 'Skip' },
                      size: '70%',
                      closeOnConfirm: false,
                      withCloseButton: false,
                      closeOnClickOutside: true,
                      children: (
                        <>
                          <Text className={classes.titleModal}>
                            In SeTA there are two types of communities: Public Communities and
                            Private Communities
                          </Text>
                          <br />
                          <Image src={image3} alt="Communities" />
                          <Progress color="gray" value={37.5} size="md" radius="xl" />
                          <span className={classes.dontShowMe}>
                            <input type="checkbox" onClick={toggleButton} /> Don't show this again
                          </span>
                        </>
                      ),
                      onCancel: modals.closeAll,
                      onConfirm: () =>
                        modals.openConfirmModal({
                          labels: { confirm: 'Next', cancel: 'Skip' },
                          size: '70%',
                          closeOnConfirm: false,
                          withCloseButton: false,
                          closeOnClickOutside: true,
                          children: (
                            <>
                              <Text className={classes.titleModal}>
                                The status of the request remains “Pending” until the Community
                                Owner accepts the request.
                              </Text>
                              <br />
                              <Image src={image4} />
                              <Progress color="gray" value={50} size="md" radius="xl" />
                              <span className={classes.dontShowMe}>
                                <input type="checkbox" onClick={toggleButton} /> Don't show this
                                again
                              </span>
                            </>
                          ),
                          onCancel: modals.closeAll,
                          onConfirm: () =>
                            modals.openConfirmModal({
                              closeOnClickOutside: true,
                              labels: { confirm: 'Next', cancel: 'Skip' },
                              size: '70%',
                              closeOnConfirm: false,
                              withCloseButton: false,
                              children: (
                                <>
                                  <Text className={classes.titleModal}>
                                    As part of the access to the community data, it is possible to
                                    use the search functionality in large document collections.
                                  </Text>
                                  <br />
                                  <Image src={image5} />
                                  <Progress color="gray" value={62.5} size="md" radius="xl" />
                                  <span className={classes.dontShowMe}>
                                    <input type="checkbox" onClick={toggleButton} /> Don't show this
                                    again
                                  </span>
                                </>
                              ),
                              onCancel: modals.closeAll,
                              onConfirm: () =>
                                modals.openConfirmModal({
                                  labels: { confirm: 'Next', cancel: 'Skip' },
                                  size: '70%',
                                  closeOnConfirm: false,
                                  withCloseButton: false,
                                  closeOnClickOutside: true,
                                  children: (
                                    <>
                                      <Text className={classes.titleModal}>
                                        In the search by terms or phrase it is possible to apply a
                                        wizard so the search is enriched automatically by clicking
                                        on the wizard icon.
                                      </Text>
                                      <br />
                                      <Image src={image6} />
                                      <Progress color="gray" value={75} size="md" radius="xl" />
                                      <span className={classes.dontShowMe}>
                                        <input type="checkbox" onClick={toggleButton} />
                                        &nbsp;Don't show this again
                                      </span>
                                    </>
                                  ),
                                  onCancel: modals.closeAll,
                                  onConfirm: () =>
                                    modals.openConfirmModal({
                                      labels: { confirm: 'Next', cancel: 'Skip' },
                                      size: '70%',
                                      closeOnConfirm: false,
                                      withCloseButton: false,
                                      closeOnClickOutside: true,
                                      children: (
                                        <>
                                          <Text className={classes.titleModal}>
                                            With the option of search by document or text, you can
                                            upload the elements with the cloud icon.
                                          </Text>
                                          <br />
                                          <Image src={image7} alt="Search" />
                                          <Progress
                                            color="gray"
                                            value={87.5}
                                            size="md"
                                            radius="xl"
                                          />
                                          <span className={classes.dontShowMe}>
                                            <input type="checkbox" onClick={toggleButton} />
                                            &nbsp;Don't show this again
                                          </span>
                                        </>
                                      ),
                                      onCancel: modals.closeAll,
                                      onConfirm: () =>
                                        modals.openConfirmModal({
                                          labels: { confirm: 'Close', cancel: 'Skip' },
                                          size: '70%',
                                          closeOnConfirm: false,
                                          withCloseButton: false,
                                          closeOnClickOutside: true,
                                          children: (
                                            <>
                                              <Text className={classes.titleModal}>
                                                The search results can be easily screened and
                                                filtered by the user with the help of the tool.
                                              </Text>
                                              <br />
                                              <Image src={image8} alt="Search" />
                                              <Progress
                                                color="gray"
                                                value={100}
                                                size="md"
                                                radius="xl"
                                              />
                                              <span className={classes.dontShowMe}>
                                                <input type="checkbox" onClick={toggleButton} />
                                                &nbsp;Don't show this again
                                              </span>
                                            </>
                                          ),
                                          onCancel: modals.closeAll,
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
  )
}

export default ModalPage
