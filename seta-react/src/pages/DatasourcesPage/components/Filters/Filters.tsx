import { Select } from '@mantine/core'

import { useDatasourceListContext } from '~/pages/DatasourcesPage/contexts/datasource-list.context'

const Filters = () => {
  const { selected, handleSearchableChange } = useDatasourceListContext()

  const searchableOptions = [
    { label: 'All Datasources', value: 'all' },
    { label: 'Searchable', value: 'searchable' },
    { label: 'Not Searchable', value: 'notSearchable' }
  ]

  return (
    <Select
      width="15%"
      name="searchable"
      value={selected}
      data={searchableOptions}
      onChange={handleSearchableChange}
    />
  )
}

export default Filters
