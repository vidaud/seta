import { useState } from 'react'
import { Tooltip, UnstyledButton, Group } from '@mantine/core'
import { BsPlayFill } from 'react-icons/bs'
import Joyride, { STATUS } from 'react-joyride'
import { useNavigate } from 'react-router-dom'

import { useCurrentUser } from '~/contexts/user-context'

import { no_login_steps, steps } from './steps'
import * as S from './styles'

const GetStarted = ({ onChange }) => {
  const { user } = useCurrentUser()
  const [runTour, setRunTour] = useState(false)
  const authenticated = !!user

  const navigate = useNavigate()

  const openTour = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    onChange(false)
    setRunTour(true)
  }

  const handleCallback = data => {
    const { action, index, type, status } = data
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED]

    if (finishedStatuses.includes(status)) {
      setRunTour(false)
    }

    if (authenticated && type === 'tooltip' && index === 2) {
      setRunTour(true)
      navigate('/community')
    }

    if (authenticated && type === 'tooltip' && index === 5) {
      setRunTour(true)
      navigate('/community/resources/')
    }

    if (authenticated && type === 'tooltip' && index === 6) {
      setRunTour(true)
      navigate('/search')
    }

    if (!authenticated && index === 2) {
      setRunTour(true)
    }

    if (action === 'stop' && index === 0) {
      onChange(true)
    }
  }

  return (
    <>
      <Tooltip label="Get Started">
        <UnstyledButton onClick={openTour} css={S.menuItem}>
          <Group sx={{ gap: '0.3rem' }}>
            Take a Tour
            <BsPlayFill size="1rem" />
          </Group>
        </UnstyledButton>
      </Tooltip>

      <Joyride
        run={runTour}
        disableCloseOnEsc={true}
        callback={handleCallback}
        steps={authenticated ? steps : no_login_steps}
        showProgress={true}
        continuous={true}
        showSkipButton={true}
        styles={{
          options: {
            primaryColor: '#228be6'
          }
        }}
        locale={{
          skip: 'Skip',
          last: 'Close',
          next: 'Next',
          back: 'Back'
        }}
      />
    </>
  )
}

export default GetStarted
