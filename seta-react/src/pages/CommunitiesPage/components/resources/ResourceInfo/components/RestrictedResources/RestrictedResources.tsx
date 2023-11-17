import { useEffect, useState } from 'react'
import { createStyles, Switch, useMantineTheme } from '@mantine/core'
import { CgSearchFound } from 'react-icons/cg'
import { MdOutlineSearchOff } from 'react-icons/md'

import type { ResourceScopes } from '~/pages/CommunitiesPage/contexts/scope-context'

import { useAllResources } from '~/api/communities/resources/discover-resources'
import { useRestrictedResource } from '~/api/communities/resources/restricted-resources'
import type { ResourceResponse } from '~/api/types/resource-types'
import { notifications } from '~/utils/notifications'

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
  searchable: boolean
}

const RestrictedResource = ({ resource, searchable }: Props) => {
  const { data } = useAllResources()
  const { classes } = useStyles()
  const theme = useMantineTheme()

  const setRestrictedResourceMutation = useRestrictedResource()
  const [selection, setSelection] = useState<string[]>(
    data ? data?.filter(item => item.searchable === false).map(item => item.resource_id) : []
  )
  const selected = selection.includes(resource.resource_id)

  useEffect(() => {
    setSelection(
      data ? data?.filter(item => item.searchable === false).map(item => item.resource_id) : []
    )
  }, [data])

  const toggleRow = (code: string) => {
    const form = new FormData()
    const values = selection?.includes(code)
      ? selection?.filter(item => item !== code)
      : [...selection, code]

    setSelection(values)
    values?.forEach(element => form.append('resource', element))

    setRestrictedResourceMutation.mutate(form, {
      onSuccess: () => {
        notifications.showSuccess(`Resource is now not searchable!`, { autoClose: true })
      },
      onError: () => {
        notifications.showError('The resource update failed!', { autoClose: true })
      }
    })
  }

  return (
    <>
      <Switch
        className={classes.button}
        checked={!selected}
        onChange={() => toggleRow?.(resource.resource_id)}
        color="teal"
        size="md"
        thumbIcon={
          searchable ? (
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
