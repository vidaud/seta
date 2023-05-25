import { Group, Button, createStyles } from '@mantine/core'
import { Link } from 'react-router-dom'

import * as S from './styles'

const useStyles = createStyles({
  link: {
    color: 'white'
  }
})

const CreateCommunity = () => {
  const { classes } = useStyles()

  return (
    <Group position="right" css={S.root}>
      <Button color="green">
        <Link className={classes.link} to="/my-communities/new">
          + New Community
        </Link>
      </Button>
    </Group>
  )
}

export default CreateCommunity
