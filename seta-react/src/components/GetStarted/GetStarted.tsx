import { UnstyledButton, Group } from '@mantine/core'
import { BsPlayFill } from 'react-icons/bs'

import { useTourContext } from '~/contexts/tour-context'

import Tour from './components/Tour'
import * as S from './styles'

const GetStarted = () => {
  const { openTour } = useTourContext()

  return (
    <>
      <UnstyledButton onClick={openTour} css={S.menuItem}>
        <Group sx={{ gap: '0.3rem' }}>
          Take a Tour
          <BsPlayFill size="1rem" />
        </Group>
      </UnstyledButton>
      <Tour />
    </>
  )
}

export default GetStarted
