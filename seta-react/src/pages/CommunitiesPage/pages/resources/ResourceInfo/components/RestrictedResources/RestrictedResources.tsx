import { useEffect, useState } from 'react'
import { createStyles, Switch, useMantineTheme } from '@mantine/core'
import { IconCheck, IconX } from '@tabler/icons-react'

import type { ResourceScopes } from '~/pages/CommunitiesPage/pages/contexts/scope-context'

import {
  manageRestrictedResources,
  useAllResources
} from '../../../../../../../api/resources/discover/discover-resources'
import type { ResourceResponse } from '../../../../../../../api/types/resource-types'

const useStyles = createStyles(theme => ({
  form: {
    marginTop: '20px'
  },
  divider: {
    paddingBottom: theme.spacing.md
  },
  text: {
    textAlign: 'center'
  },
  dropdown: {
    background: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white
  },
  button: {
    padding: '0.625rem 0.75rem',
    color: '#868e96',
    width: '100%',
    borderRadius: '4px',
    ':hover': { background: '#f1f3f5' }
  }
}))

type Props = {
  resource: ResourceResponse
  resource_scopes: ResourceScopes[] | undefined
}

const RestrictedResource = ({ resource, resource_scopes }: Props) => {
  const { data, refetch } = useAllResources()
  const { classes } = useStyles()
  const [scopes, setScopes] = useState<string[] | undefined>([])
  const [idResources, setIdResources] = useState<string[]>([])
  const theme = useMantineTheme()
  const [checked, setChecked] = useState(resource.searchable)

  useEffect(() => {
    if (resource) {
      // form.setValues(props)
      const findResource = resource_scopes?.filter(
        scope => scope.resource_id === resource.resource_id
      )

      findResource ? setScopes(findResource[0]?.scopes) : setScopes([])

      const list: string[] = []

      data
        ?.filter(item => item.searchable === true)
        .forEach(item => {
          list.push(...[item.resource_id])
          setIdResources(...[list])
        })
    }
  }, [resource, data, resource_scopes])

  const handleSwitch = (value: boolean) => {
    setChecked(value)

    if (!value) {
      // const list: Props = { resource: resource.resource_id }
      const list: string[] = []

      idResources.forEach(element => {
        list.push(element)
      })

      list.push(resource.resource_id)
      // manageRestrictedResources(list)
      manageRestrictedResources(resource.resource_id)
    } else {
      const list: string[] = []

      idResources.forEach(element => {
        list.push(element)
      })

      list.filter(item => item !== resource.resource_id)

      // manageRestrictedResources(list)
      manageRestrictedResources('')
    }

    refetch()
  }

  return (
    <>
      {scopes?.includes('/seta/resource/edit') ? (
        <Switch
          className={classes.button}
          checked={checked}
          onChange={event => handleSwitch(event.currentTarget.checked)}
          color="teal"
          size="md"
          label={checked ? 'Switch to Not Searchable' : 'Switch to Searchable'}
          thumbIcon={
            checked ? (
              <IconCheck
                size="0.8rem"
                color={theme.colors.teal[theme.fn.primaryShade()]}
                stroke={3}
              />
            ) : (
              <IconX size="0.8rem" color={theme.colors.red[theme.fn.primaryShade()]} stroke={3} />
            )
          }
        />
      ) : null}
    </>
  )
}

export default RestrictedResource
