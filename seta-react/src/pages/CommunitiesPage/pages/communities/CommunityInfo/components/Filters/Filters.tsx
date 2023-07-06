import { Group, Select, createStyles } from '@mantine/core'

import { useCommunityListContext } from '../../../../contexts/community-list.context'

const useStyles = createStyles({
  filters: {
    marginBottom: '1rem',
    [`@media (max-width: 89em) and (min-width: 48em)`]: {
      width: '40%'
    }
  },
  select: {
    [`@media (max-width: 89em) and (min-width: 48em)`]: {
      width: '45%'
    }
  }
})

const Filters = () => {
  const { membership, status, handleMembershipChange, handleStatusChange } =
    useCommunityListContext()
  const { classes } = useStyles()

  const membershipOptions = [
    { label: 'All', value: 'all' },
    { label: 'Restricted', value: 'closed' },
    { label: 'Opened', value: 'opened' }
  ]

  const statusOptions = [
    { label: 'All', value: 'all' },
    { label: 'Member', value: 'membership' },
    { label: 'Not Member', value: 'unknown' },
    { label: 'Pending', value: 'pending' },
    { label: 'Invited', value: 'invited' },
    { label: 'Rejected', value: 'rejected' }
  ]

  return (
    <>
      <Group className={classes.filters}>
        <Select
          label="Select Membership"
          className={classes.select}
          name="membership"
          value={membership}
          data={membershipOptions}
          onChange={handleMembershipChange}
        />
        <Select
          label="Select Status"
          className={classes.select}
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
