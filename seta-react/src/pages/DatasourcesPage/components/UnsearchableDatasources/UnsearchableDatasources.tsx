import { useEffect, useState } from 'react'
import { createStyles, Switch, useMantineTheme } from '@mantine/core'
import { VscSearch, VscSearchStop } from 'react-icons/vsc'

import { useAllDatasources } from '~/api/datasources/discover-datasources'
import { useUnsearchableDatasources } from '~/api/datasources/unsearchable-datasources'
import type { DatasourcesResponse } from '~/api/types/datasource-types'
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
  datasource: DatasourcesResponse
  searchable: boolean
}

const UnsearchableDatasources = ({ datasource }: Props) => {
  const { data } = useAllDatasources()
  const { classes } = useStyles()
  const theme = useMantineTheme()
  const setRestrictedDatasourceMutation = useUnsearchableDatasources()
  const [selection, setSelection] = useState<(string | undefined)[]>(
    data ? data?.filter(item => item.searchable === false).map(item => item.id) : []
  )
  const selected: boolean = selection.includes(datasource.id)
  const [isChecked, setIsChecked] = useState<boolean | undefined>(datasource.searchable)

  useEffect(() => {
    setSelection(data ? data?.filter(item => item.searchable === false).map(item => item.id) : [])
  }, [data])

  const toggleRow = (code: string) => {
    const values = selection?.includes(code)
      ? selection?.filter(item => item !== code)
      : [...selection, code]

    setSelection(values)

    setRestrictedDatasourceMutation.mutate(
      { dataSourceIds: values },
      {
        onSuccess: () => {
          notifications.showSuccess(
            isChecked ? `Datasource is now not searchable!` : `Datasource is now searchable!`,
            { autoClose: true }
          )
        },
        onError: () => {
          notifications.showError('The datasource update failed!', { autoClose: true })
        }
      }
    )
  }

  return (
    <>
      <Switch
        className={classes.button}
        checked={!selected}
        onChange={e => {
          setIsChecked(e.target.checked)
          toggleRow?.(datasource.id)
        }}
        color="teal"
        size="md"
        onLabel={<VscSearch size="0.8rem" />}
        offLabel={
          <VscSearchStop size="0.8rem" color={theme.colors.orange[theme.fn.primaryShade()]} />
        }
      />
    </>
  )
}

export default UnsearchableDatasources
