import { useEffect, useState } from 'react'
import { Button, Group, Text, Grid, Title, createStyles, Table, Tooltip, Card } from '@mantine/core'
import { Link, useParams } from 'react-router-dom'

import { useCommunityID } from '../../../../../../api/communities/manage/my-community'
import ComponentLoading from '../../../common/ComponentLoading'
import CommunityResources from '../../Resource/CommunityResources/CommunityResources'
import InviteMember from '../InviteMemberModal/InviteMemberModal'

const useStyles = createStyles(theme => ({
  page: {
    minHeight: '31rem',
    height: 'auto'
  },
  title: {
    textAlign: 'left'
  },
  text: {
    textAlign: 'left'
  },
  table: {
    marginTop: '20px'
  },
  link: {
    color: 'white'
  },
  imageSection: {
    background: '#D9D9D9',
    padding: theme.spacing.sm
  },
  group: {
    paddingBottom: theme.spacing.md
  }
}))

const ManageCommunity = () => {
  const { classes } = useStyles()
  const { id } = useParams()
  const { data, isLoading } = useCommunityID(id)
  const [row, setRow] = useState(data)

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
        <Group position="right" className={classes.group}>
          <InviteMember id={row?.communities.community_id} />

          <Tooltip label="Add new resource to this community">
            <Link className={classes.link} to={`/my-communities/${id}/new`} replace={true}>
              <Button color="blue">New Resource</Button>
            </Link>
          </Tooltip>
        </Group>
        <Grid grow>
          <Grid.Col span={12}>
            <Card withBorder radius="md">
              <Card.Section className={classes.imageSection}>
                <Text size="md">Details</Text>
              </Card.Section>
              <Title order={5} className={classes.title}>
                {row?.communities.title}
              </Title>
              <Text className={classes.text}>{row?.communities.description}</Text>
              <Table className={classes.table}>
                <tbody>
                  <tr>
                    <td>Membership: {row?.communities.membership}</td>
                    <td>
                      Created at:{' '}
                      {row?.communities?.created_at
                        ? new Date(row?.communities.created_at).toDateString()
                        : null}
                    </td>
                  </tr>
                  <tr>{/* <td>Data Type: {row?.communities.data_type}</td> */}</tr>
                  <tr>
                    <td>Created by: {row?.communities.creator?.user_id}</td>
                    <td>Status: {row?.communities.status}</td>
                  </tr>
                </tbody>
              </Table>
              <Group spacing={30} position="right">
                <Tooltip label="Update community details">
                  <Link className={classes.link} to={`/my-communities/${id}/update`} replace={true}>
                    <Button color="green">Update</Button>
                  </Link>
                </Tooltip>
              </Group>
            </Card>
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
