import { Group, Select } from '@mantine/core'

import { useCommunityListContext } from '../../../../../pages/Discovery/CommunityList/CommunityList.context'

const Filters = () => {
  const { membership, status, handleMembershipChange, handleStatusChange } =
    useCommunityListContext()
  const membershipOptions = [
    { label: 'All', value: 'all' },
    { label: 'Closed', value: 'closed' },
    { label: 'Opened', value: 'opened' }
  ]

  const statusOptions = [
    { label: 'All', value: 'all' },
    { label: 'Member', value: 'membership' },
    { label: 'Unknown', value: 'unknown' },
    { label: 'Pending', value: 'pending' },
    { label: 'Invited', value: 'invited' }
  ]

  return (
    <>
      <Group style={{ marginBottom: '1rem' }}>
        <Select
          label="Select Membership"
          name="membership"
          value={membership}
          data={membershipOptions}
          onChange={handleMembershipChange}
        />
        <Select
          label="Select Status"
          name="status"
          value={status}
          data={statusOptions}
          onChange={handleStatusChange}
        />
      </Group>
    </>
  )
}

export default Filters
