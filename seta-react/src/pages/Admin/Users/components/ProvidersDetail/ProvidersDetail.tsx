import { Box, Paper, Table, Text } from '@mantine/core'

import type { ExternalProvider } from '~/types/admin/user-info'

type Props = {
  externalProviders?: ExternalProvider[]
}

const ProviderDetail = ({ externalProviders }: Props) => {
  if (!externalProviders) {
    return (
      <Paper shadow="xs" p="md" w="50%" c="dimmed">
        No records
      </Paper>
    )
  }

  const rows = externalProviders.map(provider => (
    <tr key={provider.provider}>
      <td>
        <Text tt="uppercase">{provider.provider}</Text>
      </td>
      <td>{provider.providerUid}</td>
      <td>{provider.lastName}</td>
      <td>{provider.firstName}</td>
    </tr>
  ))

  return (
    <Box>
      <Table striped verticalSpacing="xs" horizontalSpacing="md">
        <thead>
          <tr>
            <th>External Provider</th>
            <th>Identifier</th>
            <th>Last name</th>
            <th>First name</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </Box>
  )
}

export default ProviderDetail
