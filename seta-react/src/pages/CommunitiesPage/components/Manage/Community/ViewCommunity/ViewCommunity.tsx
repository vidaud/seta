import { useEffect, useState } from 'react'
import {
  Button,
  Grid,
  Group,
  Text,
  Title,
  createStyles,
  Card,
  Table,
  Notification
} from '@mantine/core'
import { IconX } from '@tabler/icons-react'
import { Link, useParams } from 'react-router-dom'

import Stats from './components/Stats/Stats'

import { useMyCommunityID } from '../../../../../../api/communities/manage/my-community'
import { useCurrentUserPermissions } from '../../../../contexts/scope-context'
import ComponentLoading from '../../../common/ComponentLoading'

const useStyles = createStyles(theme => ({
  title: {
    textAlign: 'left'
  },
  text: {
    textAlign: 'left'
  },
  link: {
    color: 'white'
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
  tdDisplay: {
    display: 'flex'
  },
  notification: {
    width: 'fit-content',
    float: 'right'
  },
  form: {
    marginTop: '20px'
  }
}))
const ViewCommunity = () => {
  const { classes } = useStyles()
  const { id } = useParams()

  const { data, isLoading } = useMyCommunityID(id)
  const [row, setRow] = useState(data)
  const { community_scopes } = useCurrentUserPermissions()
  const [scopes, setScopes] = useState<string[] | undefined>([])
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (data) {
      setRow(data)
      const findCommunity = community_scopes?.filter(scope => scope.community_id === id)

      findCommunity ? setScopes(findCommunity[0]?.scopes) : setScopes([])
    }
  }, [data, row, community_scopes, id])

  if (isLoading || !data) {
    return <ComponentLoading />
  }

  return (
    <>
      <Grid>
        <Grid.Col span={12}>
          <Card withBorder radius="md" h={280}>
            <Card.Section className={classes.imageSection}>
              <Text size="md">Details</Text>
            </Card.Section>

            <Title order={5} className={(classes.title, classes.form)}>
              {row?.communities.title
                ? row?.communities.title.charAt(0).toUpperCase() + row?.communities.title.slice(1)
                : null}
            </Title>
            <Text size="xs" className={classes.text}>
              {row?.communities.description
                ? row?.communities.description.charAt(0).toUpperCase() +
                  row?.communities.description.slice(1)
                : null}
            </Text>
            <Table className={(classes.table, classes.form)}>
              <tbody>
                <tr>
                  <td className={(classes.td, classes.tdDisplay)}>
                    <Text className={classes.text}>Status: </Text>
                    <Title
                      order={6}
                      style={{ paddingLeft: '10px' }}
                      color={row?.communities.status === 'active' ? 'green' : 'gray'}
                    >
                      {data?.communities.status.toUpperCase()}
                    </Title>
                  </td>
                  <td className={classes.td}>
                    Membership: {row?.communities.membership.toUpperCase()}
                  </td>
                </tr>
                <tr>
                  <td className={classes.td}>
                    <Text className={classes.text}>
                      Created at:{' '}
                      {row?.communities?.created_at
                        ? new Date(row?.communities.created_at).toDateString()
                        : null}
                    </Text>
                  </td>
                  <td className={classes.td}>Created by: {row?.communities.creator.full_name}</td>
                </tr>
              </tbody>
            </Table>
            <Group spacing={30} position="right">
              {scopes?.includes('/seta/community/manager') ? (
                <>
                  <Link
                    className={classes.link}
                    to={`/my-communities/${row?.communities.community_id}/manage`}
                    replace={true}
                  >
                    <Button size="xs">Manage</Button>
                  </Link>
                  {/* <LeaveCommunity props={row?.communities} onChangeMessage={setMessage} onReload={onReload}/> */}
                </>
              ) : // <LeaveCommunity props={row?.communities} onChangeMessage={setMessage} onReload={onReload}/>
              null}
            </Group>
            {message !== '' ? (
              <Notification
                icon={<IconX size="1.1rem" />}
                color="red"
                title="We notify you that"
                onClose={() => setMessage('')}
                className={classes.notification}
              >
                {message}
              </Notification>
            ) : null}
          </Card>
        </Grid.Col>
        <Grid.Col span={4}>
          <Stats resourceNumber={row?.resources} />
        </Grid.Col>
        <Grid.Col span={8}>{/* <CommunityResources data={row?.resources} /> */}</Grid.Col>
      </Grid>
    </>
  )
}

export default ViewCommunity
