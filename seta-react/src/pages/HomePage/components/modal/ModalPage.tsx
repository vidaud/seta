import { useState } from 'react'
import { createStyles, Group, Button, Image, Pagination, rem, Text } from '@mantine/core'
import { modals } from '@mantine/modals'

import image1 from '~/images/communities_1_join_badge.png'
import image2 from '~/images/communities_1_join_msg_badge.png'
import image3 from '~/images/communities_2_accepted_badge.png'
import image0 from '~/images/introduction.png'
import image4 from '~/images/search_1_badge.png'
import image5 from '~/images/search_3_border.png'
import image7 from '~/images/search_4_badge.png'
import image6 from '~/images/search_5_upload_text_badge.png'

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
    paddingTop: rem(10),
    paddingLeft: rem(30)
  }
}))

const ModalPage = () => {
  const { classes } = useStyles()
  const [showButton, setShowButton] = useState(true)

  const toggleButton = () => {
    setShowButton(!showButton)
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
                  <span className={classes.dontShowMe}>
                    <Pagination total={8} siblings={1} defaultValue={1} />
                  </span>
                </>
              ),
              onCancel: modals.closeAll,
              onConfirm: () =>
                modals.openConfirmModal({
                  closeOnConfirm: false,
                  withCloseButton: true,
                  labels: { confirm: 'Next', cancel: 'Skip' },
                  size: '70%',
                  children: (
                    <>
                      <Text className={classes.titleModal}>
                        SeTA communities offers a shared place, where users can have the possibility
                        to interact with others users about specific areas of interest.
                      </Text>
                      <br />
                      <Image src={image1} alt="Communities" />
                      <span className={classes.dontShowMe}>
                        <input type="checkbox" onClick={toggleButton} /> Don't Show me again
                      </span>
                      <span className={classes.dontShowMe}>
                        <Pagination total={8} siblings={2} defaultValue={2} />
                      </span>
                    </>
                  ),
                  onCancel: modals.closeAll,
                  onConfirm: () =>
                    modals.openConfirmModal({
                      labels: { confirm: 'Next', cancel: 'Skip' },
                      size: '70%',
                      closeOnConfirm: false,
                      withCloseButton: true,
                      children: (
                        <>
                          <Text className={classes.titleModal}>
                            In SeTA there two types of communities: Public Communities and Private
                            Communities
                          </Text>
                          <br />
                          <Image src={image2} alt="Communities" />
                          <span className={classes.dontShowMe}>
                            <input type="checkbox" onClick={toggleButton} /> Don't Show me again
                          </span>
                          <span className={classes.dontShowMe}>
                            <Pagination total={8} siblings={3} defaultValue={3} />
                          </span>
                        </>
                      ),
                      onCancel: modals.closeAll,
                      onConfirm: () =>
                        modals.openConfirmModal({
                          labels: { confirm: 'Next', cancel: 'Skip' },
                          size: '70%',
                          closeOnConfirm: false,
                          withCloseButton: true,
                          children: (
                            <>
                              <Text className={classes.titleModal}>
                                The status of the request remains “Pending” until the Community
                                Owner accepts the request.
                              </Text>
                              <br />
                              <Image src={image3} alt="Search" />
                              <span className={classes.dontShowMe}>
                                <input type="checkbox" onClick={toggleButton} /> Don't Show me again
                              </span>
                              <span className={classes.dontShowMe}>
                                <Pagination siblings={1} defaultValue={4} total={8} />
                              </span>
                            </>
                          ),
                          onCancel: modals.closeAll,
                          onConfirm: () =>
                            modals.openConfirmModal({
                              closeOnClickOutside: false,
                              labels: { confirm: 'Next', cancel: 'Skip' },
                              size: '70%',
                              closeOnConfirm: false,
                              withCloseButton: true,
                              children: (
                                <>
                                  <Text className={classes.titleModal}>
                                    As part of the access to the community data, it is possible to
                                    use the search functionality in large document collections.
                                  </Text>
                                  <br />
                                  <Image src={image4} alt="Search" />
                                  <span className={classes.dontShowMe}>
                                    <input type="checkbox" onClick={toggleButton} /> Don't Show me
                                    again
                                  </span>
                                  <span className={classes.dontShowMe}>
                                    <Pagination siblings={1} defaultValue={5} total={8} />
                                  </span>
                                </>
                              ),
                              onCancel: modals.closeAll,
                              onConfirm: () =>
                                modals.openConfirmModal({
                                  labels: { confirm: 'Next', cancel: 'Skip' },
                                  size: '70%',
                                  closeOnConfirm: false,
                                  withCloseButton: true,
                                  children: (
                                    <>
                                      <Text className={classes.titleModal}>
                                        In the search by terms or phrase it is possible to apply a
                                        wizard so the search is enriched automatically by clicking
                                        on the wizard icon.
                                      </Text>
                                      <br />
                                      <Image src={image5} alt="Search" />
                                      <span className={classes.dontShowMe}>
                                        <input type="checkbox" onClick={toggleButton} />
                                        Don't Show me again
                                      </span>
                                      <span className={classes.dontShowMe}>
                                        <Pagination siblings={1} defaultValue={6} total={8} />
                                      </span>
                                    </>
                                  ),
                                  onCancel: modals.closeAll,
                                  onConfirm: () =>
                                    modals.openConfirmModal({
                                      labels: { confirm: 'Next', cancel: 'Skip' },
                                      size: '70%',
                                      closeOnConfirm: false,
                                      withCloseButton: true,
                                      children: (
                                        <>
                                          <Text className={classes.titleModal}>
                                            With the option of search by document or text, you can
                                            upload the elements with the cloud icon.
                                          </Text>
                                          <br />
                                          <Image src={image6} alt="Search" />
                                          <span className={classes.dontShowMe}>
                                            <input type="checkbox" onClick={toggleButton} />
                                            Don't Show me again
                                          </span>
                                          <span className={classes.dontShowMe}>
                                            <Pagination siblings={1} defaultValue={7} total={8} />
                                          </span>
                                        </>
                                      ),
                                      onCancel: modals.closeAll,
                                      onConfirm: () =>
                                        modals.openConfirmModal({
                                          labels: { confirm: 'Close', cancel: 'Skip' },
                                          size: '70%',
                                          closeOnConfirm: false,
                                          withCloseButton: true,
                                          children: (
                                            <>
                                              <Text className={classes.titleModal}>
                                                With the option of search by document or text, you
                                                can upload the elements with the cloud icon.
                                              </Text>
                                              <br />
                                              <Image src={image7} alt="Search" />
                                              <span className={classes.dontShowMe}>
                                                <input type="checkbox" onClick={toggleButton} />
                                                Don't Show me again
                                              </span>
                                              <span className={classes.dontShowMe}>
                                                <Pagination
                                                  siblings={1}
                                                  defaultValue={8}
                                                  total={8}
                                                />
                                              </span>
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
  )
}

export default ModalPage
