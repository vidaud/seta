import { Group, Button } from '@mantine/core'
import { useNavigate } from 'react-router-dom'

import * as S from './styles'

const CreateCommunity = () => {
  const navigate = useNavigate()

  return (
    <Group position="right" css={S.root}>
      <Button
        component="a"
        color="green"
        onClick={() => {
          navigate('/manage/my-communities/new')
        }}
      >
        + New Community
      </Button>
    </Group>
  )
}

export default CreateCommunity
