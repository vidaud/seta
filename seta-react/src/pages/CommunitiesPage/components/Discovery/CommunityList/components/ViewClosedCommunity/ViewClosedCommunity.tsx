import { Table, Text, Group, createStyles, Tooltip, ActionIcon, Modal, Title } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconEye } from '@tabler/icons-react'

import { useMyCommunityID } from '../../../../../../../api/communities/manage/my-community'
import MembershipRequest from '../../../../Manage/Members/InviteMemberModal/InviteMemberModal'
import OpenCommunityMember from '../../../../Manage/Members/OpenCommunityMember/OpenCommunityMember'

const useStyles = createStyles(theme => ({
  form: {
    marginTop: '20px'
  },
  title: {
    textAlign: 'left'
  },
  text: {
    textAlign: 'left'
  },
  imageSection: {
    background: '#D9D9D9',
    padding: theme.spacing.sm,
    color: '#000000'
  },
  table: {
    width: '100%',
    paddingTop: theme.spacing.md
  },
  td: {
    width: '50%'
  },
  tr: {
    borderTopStyle: 'hidden'
  }
}))

const ViewClosedCommunity = ({ community }) => {
  const { classes } = useStyles()
  const [opened, { open, close }] = useDisclosure(false)
  const { data } = useMyCommunityID(community)

  return (
    <>
      <Modal opened={opened} onClose={close} title="Community Details" centered>
        <Title order={5} className={classes.title}>
          {data?.communities.title}
        </Title>
        <Text size="xs" className={classes.text}>
          {data?.communities.description}
        </Text>
        <Table className={classes.table}>
          <tbody>
            <tr className={classes.tr}>
              <td className={(classes.td, classes.text)}>
                <Title order={6}>{data?.resources.length} Resources</Title>
              </td>
            </tr>
            <tr className={classes.tr}>
              <td className={classes.td}>
                <Text className={classes.text}>
                  Status:
                  <Title order={6} color={data?.communities.status === 'active' ? 'green' : 'gray'}>
                    {data?.communities.status.toUpperCase()}
                  </Title>
                </Text>
              </td>
              <td className={classes.td}>
                <Text className={classes.text}>
                  Membership:{' '}
                  <Title
                    order={6}
                    color={data?.communities.membership === 'opened' ? 'green' : 'orange'}
                  >
                    {data?.communities.membership.toUpperCase()}
                  </Title>
                </Text>
              </td>
            </tr>
            <tr className={classes.tr}>
              <td className={classes.td}>
                <Text className={classes.text}>
                  Created at: {new Date(data ? data.communities.created_at : '').toDateString()}
                </Text>
              </td>
              <td className={(classes.td, classes.text)}>
                Created by: {data?.communities.creator?.full_name}
              </td>
            </tr>
            <tr className={classes.tr}>
              <td className={classes.td} />
              <td className={classes.td}>
                {data?.communities.membership === 'closed' ? (
                  <MembershipRequest community_id={data?.communities.community_id} />
                ) : data?.communities.membership === 'opened' ? (
                  <OpenCommunityMember community_id={data?.communities.community_id} />
                ) : null}
              </td>
            </tr>
          </tbody>
        </Table>
      </Modal>

      <Group position="center">
        <Tooltip label="View Details">
          <ActionIcon>
            <IconEye size="1rem" stroke={1.5} onClick={open} />
          </ActionIcon>
        </Tooltip>
      </Group>
    </>
  )
}

export default ViewClosedCommunity
