import type { CallBackProps } from 'react-joyride'
import Joyride, { ACTIONS, STATUS } from 'react-joyride'
import { useNavigate } from 'react-router-dom'

import { useTourContext } from '~/contexts/tour-context'
import { useCurrentUser } from '~/contexts/user-context'

import { no_login_steps, steps } from '../steps'

const Tour = () => {
  const { runTour, handleRunTour } = useTourContext()
  const { user } = useCurrentUser()
  const authenticated = !!user
  const navigate = useNavigate()

  const handleAuthenticatedCallback = (data: CallBackProps) => {
    const { action, index, type, status, lifecycle } = data
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED, STATUS.PAUSED]
    const stopActions: string[] = [ACTIONS.CLOSE, ACTIONS.SKIP, ACTIONS.STOP]

    if (finishedStatuses.includes(status) || stopActions.includes(action)) {
      handleRunTour(false)
    }

    if (type === 'tooltip' && index === 2) {
      handleRunTour(true)
      navigate('/datasources')
    }

    if (type === 'tooltip' && action === 'update' && index === 5) {
      handleRunTour(true)
      navigate('/search')
    }

    if (action === 'prev' && lifecycle === 'init') {
      if (index === 4) {
        navigate('/datasources')
      }
    }
  }

  const handleCallback = (data: CallBackProps) => {
    const { action, index, type, status } = data
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED, STATUS.PAUSED]
    const stopActions: string[] = [ACTIONS.CLOSE, ACTIONS.SKIP, ACTIONS.STOP]

    if (finishedStatuses.includes(status) || stopActions.includes(action)) {
      handleRunTour(false)
    }

    if (type === 'tooltip' && index === 2) {
      handleRunTour(true)
      navigate('/login')
    }
  }

  return (
    <Joyride
      run={runTour}
      disableCloseOnEsc={true}
      callback={authenticated ? handleAuthenticatedCallback : handleCallback}
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
        close: 'Close',
        skip: 'Close',
        last: 'Close',
        next: 'Next',
        back: 'Back'
      }}
    />
  )
}

export default Tour
