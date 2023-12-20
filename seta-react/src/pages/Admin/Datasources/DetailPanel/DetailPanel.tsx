import { Group, Title } from '@mantine/core'

import ThemeList from '~/pages/DatasourcesPage/components/DatasourceInfo/components/ThemeList'

import type { DatasourceScopes } from '~/api/types/datasource-types'

import ContactInfo from '../../common/components/Contact/Contact'
import ScopesList from '../DatasourcesTable/components/ManageScopes/components/ScopesList'

type Contact = {
  person?: string
  email?: string
  website?: string
}
type Props = {
  contactDetails?: Contact
  themes: string
  scopes?: DatasourceScopes[]
}

const DetailPanel = ({ scopes, contactDetails, themes }: Props) => {
  return (
    <Group spacing={50} p={10} pl={20}>
      <Group w="30%">
        <Title order={6}>Contact Person:</Title>
        <ContactInfo
          person={contactDetails?.person}
          website={contactDetails?.website}
          email={contactDetails?.email}
        />
      </Group>
      <Group w="30%">
        <Title order={6}>Themes:</Title>
        {themes !== '-' ? <ThemeList themes={themes} width="auto" /> : ''}
      </Group>
      <Group>
        <Title order={6}>Scopes:</Title>
        {scopes && scopes?.length > 0 ? (
          <ScopesList scopes={scopes} />
        ) : (
          'No scopes for this datasource'
        )}
      </Group>
    </Group>
  )
}

export default DetailPanel
