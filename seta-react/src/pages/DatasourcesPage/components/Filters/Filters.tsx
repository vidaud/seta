import { createStyles, Select } from '@mantine/core'

import { useDatasourceListContext } from '~/pages/DatasourcesPage/contexts/datasource-list.context'

const useStyles = createStyles({
  filters: {
    [`@media (max-width: 89em) and (min-width: 68em)`]: {
      width: '14%'
    }
  }
})

const Filters = () => {
  const { classes } = useStyles()
  const { selected, handleSearchableChange } = useDatasourceListContext()

  const searchableOptions = [
    { label: 'All Datasources', value: 'all' },
    { label: 'Searchable', value: 'searchable' },
    { label: 'Not Searchable', value: 'notSearchable' }
  ]

  return (
    <Select
      className={classes.filters}
      name="searchable"
      value={selected}
      data={searchableOptions}
      onChange={handleSearchableChange}
    />
  )
}

export default Filters
