import { useEffect, useState } from 'react'
import { createStyles, Switch, useMantineTheme } from '@mantine/core'
import { VscSearch, VscSearchStop } from 'react-icons/vsc'

import { useAllResources } from '~/api/communities/resources/discover-resources'
import { useRestrictedResource } from '~/api/communities/resources/restricted-resources'
import type { DatasourceResponse } from '~/api/types/datasource-types'
import { notifications } from '~/utils/notifications'

const useStyles = createStyles(() => ({
  button: {
    padding: '0.625rem 0.75rem',
    color: '#868e96',
    width: '100%',
    borderRadius: '4px'
  }
}))

type Props = {
  datasource: DatasourceResponse
  searchable: boolean
}

const RestrictedDatasource = ({ datasource }: Props) => {
  const { data } = useAllResources()
  const { classes } = useStyles()
  const theme = useMantineTheme()
  const setRestrictedDatasourceMutation = useRestrictedResource()
  const [selection, setSelection] = useState<string[]>(
    data ? data?.filter(item => item.searchable === false).map(item => item.resource_id) : []
  )
  const selected = selection.includes(datasource.resource_id)
  const [isChecked, setIsChecked] = useState<boolean>(datasource.searchable)

  useEffect(() => {
    setSelection(
      data ? data?.filter(item => item.searchable === false).map(item => item.resource_id) : []
    )
  }, [data, isChecked])

  const toggleRow = (code: string) => {
    const form = new FormData()
    const values = selection?.includes(code)
      ? selection?.filter(item => item !== code)
      : [...selection, code]

    setSelection(values)
    values?.forEach(element => form.append('resource', element))

    setRestrictedDatasourceMutation.mutate(form, {
      onSuccess: () => {
        notifications.showSuccess(
          isChecked ? `Datasource is now not searchable!` : `Datasource is now searchable!`,
          { autoClose: true }
        )
      },
      onError: () => {
        notifications.showError('The datasource update failed!', { autoClose: true })
      }
    })
  }

  return (
    <>
      <Switch
        className={classes.button}
        checked={!selected}
        onChange={e => {
          toggleRow?.(datasource.resource_id)
          setIsChecked(e.target.checked)
        }}
        color="teal"
        size="md"
        onLabel={<VscSearch size="0.8rem" />}
        offLabel={
          <VscSearchStop size="0.8rem" color={theme.colors.orange[theme.fn.primaryShade()]} />
        }
        // thumbIcon={
        //   searchable ? (
        //     <VscSearch size="0.8rem" color={theme.colors.teal[theme.fn.primaryShade()]} />
        //   ) : (
        //     <VscSearchStop size="0.8rem" color={theme.colors.orange[theme.fn.primaryShade()]} />
        //   )
        // }
      />
    </>
  )
}

export default RestrictedDatasource
