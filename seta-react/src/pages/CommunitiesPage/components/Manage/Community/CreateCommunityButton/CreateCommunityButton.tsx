import { useEffect, useState } from 'react'
import { Group, Button, createStyles } from '@mantine/core'
import { Link } from 'react-router-dom'

import * as S from './styles'

import { useCurrentUserPermissions } from '../../scope-context'

const useStyles = createStyles({
  link: {
    color: 'white'
  }
})

const CreateCommunity = () => {
  const { classes } = useStyles()
  const { system_scopes } = useCurrentUserPermissions()
  const [scopes, setScopes] = useState<string | undefined>('')

  useEffect(() => {
    setScopes(system_scopes ? system_scopes[0].scope : '')
  }, [system_scopes])

  return (
    <>
      {scopes === '/seta/community/create' ? (
        <Group position="right" css={S.root}>
          <Link className={classes.link} to="/my-communities/new">
            <Button color="green">+ New Community</Button>
          </Link>
        </Group>
      ) : null}
    </>
  )
}

export default CreateCommunity
