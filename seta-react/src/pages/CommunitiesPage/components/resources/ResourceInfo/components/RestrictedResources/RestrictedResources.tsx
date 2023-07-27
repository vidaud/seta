import { useEffect, useState } from 'react'
import { createStyles, Switch, useMantineTheme } from '@mantine/core'
import { CgSearchFound } from 'react-icons/cg'
import { MdOutlineSearchOff } from 'react-icons/md'

import type { ResourceScopes } from '~/pages/CommunitiesPage/contexts/scope-context'

import {
  manageRestrictedResources,
  useAllResources
} from '~/api/communities/discover/discover-resources'
import type { ResourceResponse } from '~/api/types/resource-types'

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
  resource_scopes?: ResourceScopes[] | undefined
}

const RestrictedResource = ({ resource }: Props) => {
  const { data, refetch } = useAllResources()
  const { classes } = useStyles()
  const theme = useMantineTheme()
  const [checked, setChecked] = useState(resource.searchable)

  useEffect(() => {
    if (resource) {
      // form.setValues(props)
    }
  }, [resource, data])

  const handleSwitch = (value: React.ChangeEvent<HTMLInputElement>, id: string) => {
    setChecked(value.currentTarget.checked)

    if (!value.currentTarget.checked) {
      const form = new FormData()

      const index = data?.filter(item => item.searchable === false).map(item => item.resource_id)

      index?.forEach(element => form.append('resource', element))
      form.append('resource', id)
      manageRestrictedResources(form).then(() => {
        refetch()
      })
    } else {
      const form = new FormData()

      const index = data
        ?.filter(item => item.searchable === false && item.resource_id !== id)
        .map(item => item.resource_id)

      index?.forEach(element => form.append('resource', element))

      manageRestrictedResources(form).then(() => {
        refetch()
      })
    }
  }

  return (
    <>
      <Switch
        className={classes.button}
        checked={checked}
        onChange={event => handleSwitch(event, resource.resource_id)}
        color="teal"
        size="md"
        // label={checked ? 'Switch to Searchable' : 'Switch to Not Searchable'}
        thumbIcon={
          checked ? (
            <CgSearchFound size="0.8rem" color={theme.colors.teal[theme.fn.primaryShade()]} />
          ) : (
            <MdOutlineSearchOff
              size="0.8rem"
              color={theme.colors.orange[theme.fn.primaryShade()]}
            />
          )
        }
      />
    </>
  )
}

export default RestrictedResource
