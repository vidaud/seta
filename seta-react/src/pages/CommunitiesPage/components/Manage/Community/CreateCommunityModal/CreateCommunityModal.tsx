import { Group, Button } from '@mantine/core'

import * as S from './styles'

const CreateCommunity = () => {
  return (
    <Group position="right" css={S.root}>
      <Button component="a" color="green" href="/communities/new">
        + New Community
      </Button>
    </Group>
  )
}

export default CreateCommunity
