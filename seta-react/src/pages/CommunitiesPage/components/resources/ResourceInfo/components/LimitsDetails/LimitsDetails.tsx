import { useEffect, useState } from 'react'
import { Group, Table, Badge } from '@mantine/core'

import { ComponentLoading } from '~/pages/CommunitiesPage/components/common'

import { useResourceID } from '~/api/communities/resources/my-resource'

import UpdateLimits from '../UpdateLimits'

const LimitsDetails = ({ id, scopes, nrResourcesChangeRequests }) => {
  const { data, isLoading } = useResourceID(id)
  const [rows, setRows] = useState(data)

  useEffect(() => {
    if (data) {
      setRows(data)
    }
  }, [data, rows])

  if (isLoading || !data) {
    return <ComponentLoading />
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <Group align="flex-start">
        <Table>
          <thead>
            <tr>
              <th>
                <Badge color="dark.3" radius="sm" size="lg">
                  Limits
                </Badge>
              </th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Total documents in source</td>
              <td>{rows?.community_id ? rows?.limits?.total_files_no : null}</td>
            </tr>
            <tr>
              <td>Total storage for source (MB)</td>
              <td>{rows?.limits?.total_storage_mb}</td>
            </tr>
            <tr>
              <td>Max size per file (MB)</td>
              <td>{rows?.limits?.file_size_mb}</td>
            </tr>
          </tbody>
        </Table>
      </Group>

      {scopes?.includes('/seta/resource/edit') ? (
        <Group position="right" style={{ paddingTop: '2%' }}>
          <UpdateLimits props={rows} nrResourcesChangeRequests={nrResourcesChangeRequests} />
        </Group>
      ) : null}
    </div>
  )
}

export default LimitsDetails
