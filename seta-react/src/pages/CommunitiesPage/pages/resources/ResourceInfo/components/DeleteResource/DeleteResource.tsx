import { useEffect, useState } from 'react'
import { Text, Popover, Button, Group, createStyles, UnstyledButton } from '@mantine/core'
import { IconTrash } from '@tabler/icons-react'

import type { ResourceScopes } from '~/pages/CommunitiesPage/pages/contexts/scope-context'

import { deleteResourceByID } from '../../../../../../../api/resources/manage/my-resource'

const useStyles = createStyles(theme => ({
  form: {
    marginTop: '20px'
  },
  text: { paddingBottom: theme.spacing.md },
  button: {
    padding: '0.625rem 0.75rem',
    color: '#868e96',
    width: '100%',
    borderRadius: '4px',
    ':hover': { background: '#f1f3f5' }
  }
}))

type Props = {
  id: string
  resource_scopes: ResourceScopes[] | undefined
}

const DeleteResource = ({ id, resource_scopes }: Props) => {
  const [scopes, setScopes] = useState<string[] | undefined>([])
  const { classes, cx } = useStyles()
  const [opened, setOpened] = useState(false)

  useEffect(() => {
    const findResource = resource_scopes?.filter(scope => scope.resource_id === id)

    findResource ? setScopes(findResource[0]?.scopes) : setScopes([])
  }, [resource_scopes, id])

  const deleteResource = () => {
    deleteResourceByID(id)
  }

  return (
    <Popover
      width={300}
      withinPortal={true}
      trapFocus
      position="bottom"
      withArrow
      shadow="md"
      opened={opened}
      onChange={setOpened}
    >
      {scopes?.includes('/seta/resource/edit') ? (
        <Popover.Target>
          <Group>
            <UnstyledButton
              className={classes.button}
              onClick={e => {
                e.stopPropagation()
                setOpened(o => !o)
              }}
            >
              <IconTrash size="1rem" stroke={1.5} />
              {'  '} Delete Resource
            </UnstyledButton>
          </Group>
        </Popover.Target>
      ) : null}
      <Popover.Dropdown
        sx={theme => ({
          background: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white
        })}
      >
        <Text weight={500} className={cx(classes.form)}>
          Are you sure you want to delete {id} resource?
        </Text>
        <Text size="sm" className={cx(classes.form)}>
          Press Confirm to proceed with the deletion or press Cancel to abort
        </Text>
        <Group className={cx(classes.form)} position="right">
          <Button variant="outline" size="xs" color="blue" onClick={() => setOpened(o => !o)}>
            Cancel
          </Button>
          <Button size="xs" color="blue" onClick={() => deleteResource()}>
            Confirm
          </Button>
        </Group>
      </Popover.Dropdown>
    </Popover>
  )
}

export default DeleteResource
