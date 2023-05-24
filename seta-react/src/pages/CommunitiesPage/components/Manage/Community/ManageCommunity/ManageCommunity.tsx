import { useEffect, useState } from 'react'
import { Button, Group, Paper, Text, Grid, Title, createStyles, Table } from '@mantine/core'
import { useNavigate, useParams } from 'react-router-dom'

import { useCommunityID } from '../../../../../../api/communities/manage/my-community'
import ComponentLoading from '../../../common/ComponentLoading'
import changeRequestAttributes from '../../../Dashboard/ChangeRequests/changeRequestAttributes.json'
import ChangeRequests from '../../../Dashboard/ChangeRequests/ChangeRequests'
import joinAttributes from '../../../Dashboard/LastJoinRequests/joinAttributes.json'
import LastJoinRequests from '../../../Dashboard/LastJoinRequests/LastJoinRequests'
import CommunityResources from '../../Resource/CommunityResources/CommunityResources'
import InviteMember from '../InviteMemberModal/InviteMemberModal'

const useStyles = createStyles({
  page: {
    minHeight: '31rem',
    height: 'auto',
    padding: '2rem'
  },
  title: {
    textAlign: 'left'
  },
  text: {
    textAlign: 'left'
  },
  table: {
    marginTop: '20px'
  }
})

const ManageCommunity = () => {
  const { classes } = useStyles()
  const { id } = useParams()
  const { data, isLoading } = useCommunityID(id)
  const [row, setRow] = useState(data)
  const navigate = useNavigate()

  useEffect(() => {
    if (data) {
      setRow(data)
    }
  }, [data, row])

  if (isLoading || !data) {
    return <ComponentLoading />
  }

  return (
    <>
      <div className={classes.page}>
        <Group position="right">
          <InviteMember id={row?.communities.community_id} />
          <Button
            color="blue"
            component="a"
            onClick={() => {
              navigate(`/manage/my-communities/details/${id}/new`)
            }}
          >
            New Resource
          </Button>
        </Group>
        <Grid grow>
          <Grid.Col span={12}>
            <Paper shadow="xs" p="md">
              <Title order={5} className={classes.title}>
                {row?.communities.title}
              </Title>
              <Text className={classes.text}>{row?.communities.description}</Text>
              <Table className={classes.table}>
                <tbody>
                  <tr>
                    <td>Membership: {row?.communities.membership}</td>
                    <td>Created at: {row?.communities.created_at.toString()}</td>
                  </tr>
                  <tr>
                    <td>Data Type: {row?.communities.data_type}</td>
                    <td>Created by: {row?.communities.creator?.full_name}</td>
                  </tr>
                  <tr>
                    <td>Status: {row?.communities.status}</td>
                    <td />
                  </tr>
                </tbody>
              </Table>
              <Group spacing={30} position="right">
                <Button
                  color="green"
                  component="a"
                  onClick={() => {
                    navigate(`/manage/my-communities/update/${id}`)
                  }}
                >
                  Update
                </Button>
              </Group>
            </Paper>
          </Grid.Col>
          <Grid.Col span={5}>
            <Paper withBorder p="md" radius="md" key="Last Join Requests">
              <LastJoinRequests data={joinAttributes.props.data} />
            </Paper>
          </Grid.Col>
          <Grid.Col span={5}>
            <Paper withBorder p="md" radius="md" key="Change Requests">
              <ChangeRequests data={changeRequestAttributes.props.data} />
            </Paper>
          </Grid.Col>
          <Grid.Col span={12}>
            <CommunityResources data={row?.resources} />
          </Grid.Col>
        </Grid>
      </div>
    </>
  )
}

export default ManageCommunity
