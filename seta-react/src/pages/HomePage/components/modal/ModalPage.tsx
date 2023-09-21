import { useState } from 'react'
import { Group, Button } from '@mantine/core'
import { modals } from '@mantine/modals'
import { useNavigate } from 'react-router-dom'

import { useCurrentUser } from '~/contexts/user-context'

import { useStyles } from './style'

import CommunitiesPage from '../pages/communities'
import CommunityMembershipPage from '../pages/community-membership'
import DocumentUploadPage from '../pages/document-upload'
import FiltersPage from '../pages/filters'
import PendingCommunityPage from '../pages/pending-community'
import PresentationPage from '../pages/presentation'
import SearchPage from '../pages/search'
import SearchEnrichmentPage from '../pages/search-enrichment'

const ModalPage = () => {
  const navigate = useNavigate()
  const { classes } = useStyles()
  const [showButton, setShowButton] = useState(true)
  const [isCookie, setCookie] = useState(true)
  const hideModal = "Don't show this again"
  const COOKIE_NAME = 'intro_cookie'
  const rand_value = Math.random().toString(36).substring(3, 11).toUpperCase()
  const today = new Date()
  const time = today.getTime()
  const expireTime = time + 1000 * 86400
  const { user } = useCurrentUser()
  const authenticated = !!user

  today.setTime(expireTime)

  const toggleButton = () => {
    setShowButton(false)
  }

  const clickCheckbox = (
    <span className={classes.hideModal}>
      <input
        type="checkbox"
        onClick={() => {
          toggleButton()
          saveToCookie(COOKIE_NAME, rand_value)
        }}
      />
      {} {hideModal}
    </span>
  )

  const saveToCookie = (cookieName: string, cookieValue: string): void => {
    document.cookie = `${cookieName.trim()}=${cookieValue.trim()};expires=${today.toUTCString()};samesite=lax`
    setCookie(!isCookie)
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
                  <PresentationPage />
                  {clickCheckbox}
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
                      <CommunitiesPage />
                      {clickCheckbox}
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
                          <CommunityMembershipPage />
                          {clickCheckbox}
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
                              <PendingCommunityPage />
                              {clickCheckbox}
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
                                  <SearchPage />
                                  {clickCheckbox}
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
                                      <SearchEnrichmentPage />
                                      {clickCheckbox}
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
                                          <DocumentUploadPage />
                                          {clickCheckbox}
                                        </>
                                      ),
                                      onCancel: modals.closeAll,
                                      onConfirm: () =>
                                        modals.openConfirmModal({
                                          labels: {
                                            confirm: authenticated
                                              ? 'Start Searching'
                                              : 'Go to Login',
                                            cancel: 'Skip'
                                          },
                                          size: '70%',
                                          closeOnConfirm: false,
                                          withCloseButton: false,
                                          closeOnClickOutside: true,
                                          children: (
                                            <>
                                              <FiltersPage />
                                              {clickCheckbox}
                                            </>
                                          ),
                                          onCancel: modals.closeAll,
                                          onConfirm: () => {
                                            modals.closeAll()

                                            if (authenticated) {
                                              navigate(`/search`)
                                            } else {
                                              navigate(`/login`)
                                            }
                                          }
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
