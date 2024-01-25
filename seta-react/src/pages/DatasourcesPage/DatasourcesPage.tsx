import { Flex } from '@mantine/core'

import Page from '~/components/Page'

import type { Crumb } from '~/types/breadcrumbs'

import DatasourcesList from './components/DatasourcesList/DatasourcesList'
import { DatasourceListProvider } from './contexts/datasource-list.context'

const DatasourcesPage = () => {
  const breadcrumbs: Crumb[] = [
    {
      title: 'Data Sources',
      path: '/data-sources'
    }
  ]

  return (
    <Page breadcrumbs={breadcrumbs}>
      <Flex direction="column" align="center" w="100%">
        <DatasourceListProvider>
          <DatasourcesList />
        </DatasourceListProvider>
      </Flex>
    </Page>
  )
}

export default DatasourcesPage
