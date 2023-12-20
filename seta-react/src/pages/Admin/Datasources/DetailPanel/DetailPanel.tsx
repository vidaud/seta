import { Grid, Group, Title } from '@mantine/core'

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
  themes: string[]
  scopes?: DatasourceScopes[]
}

const DetailPanel = ({ scopes, contactDetails, themes }: Props) => {
  return (
    <Grid sx={{ justifyContent: 'center' }}>
      <Grid.Col md={6} lg={6}>
        <Group sx={{ alignItems: 'baseline' }}>
          <Group display="grid" w="50%">
            <Title order={6}>Contact Person:</Title>
            <ContactInfo
              person={contactDetails?.person}
              website={contactDetails?.website}
              email={contactDetails?.email}
            />
          </Group>
          <Group display="grid">
            <Title order={6}>Themes:</Title>
            {themes.length > 0 ? <ThemeList themes={themes} width="auto" /> : ''}
          </Group>
        </Group>
      </Grid.Col>
      <Grid.Col md={6} lg={5}>
        <Group>
          <Title order={6}>Scopes:</Title>
          {scopes && scopes?.length > 0 ? (
            <ScopesList scopes={scopes} />
          ) : (
            'No scopes for this datasource'
          )}
        </Group>
      </Grid.Col>
    </Grid>
  )
}

export default DetailPanel
