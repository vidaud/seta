import { Group } from '@mantine/core'

import type { AccountDetail, ExternalProvider } from '~/types/admin/user-info'

import AccountDetails from '../AccountDetails'
import ProviderDetail from '../ProvidersDetail/ProvidersDetail'

type Props = {
  externalProviders?: ExternalProvider[]
  details?: AccountDetail
}

const DetailPanel = ({ externalProviders, details }: Props) => {
  return (
    <Group spacing={50} p={10} pl={20}>
      <ProviderDetail externalProviders={externalProviders} />
      <AccountDetails details={details} />
    </Group>
  )
}

export default DetailPanel
