import { useEffect, useState } from 'react'
import { Card, Grid, Table, Text, createStyles } from '@mantine/core'
import { useLocation, useNavigate } from 'react-router-dom'

const useStyles = createStyles(theme => ({
  card: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white
  },
  imageSection: {
    background: '#D9D9D9',
    padding: theme.spacing.sm,
    color: '#000000'
  },
  rowSection: {
    padding: theme.spacing.xl,
    border: '0.0625rem solid #dee2e6',
    '&:hover': {
      background: '#007BFF',
      color: 'white',
      cursor: 'pointer'
    }
  },
  textSection: {
    paddingLeft: theme.spacing.sm,
    paddingRight: theme.spacing.sm,
    paddingBottom: theme.spacing.sm
  },
  noResources: {
    textAlign: 'center'
  }
}))

const CommunityResources = resources => {
  const { classes } = useStyles()
  const navigate = useNavigate()
  const [items, setItems] = useState(resources)
  const location = useLocation()

  useEffect(() => {
    if (resources) {
      setItems(resources)
    }
  }, [resources, items])

  const getResource = item => {
    if (item.community_id && location.pathname.includes('/my-communities')) {
      navigate(`/my-communities/${item.community_id}/${item.resource_id}`)
    } else if (location.pathname.includes('/my-resources')) {
      navigate(`/my-resources/${item.resource_id}`)
    }
  }

  const rows = items?.data?.map(item => {
    return (
      <tr key={item.resource_id} className={classes.rowSection}>
        <td>
          <Grid onClick={() => getResource(item)}>
            <Grid.Col span={8}>
              <Text className={classes.textSection}>
                Title: {item.title.charAt(0).toUpperCase() + item.title.slice(1)}
              </Text>
              <Text className={classes.textSection}>
                Abstract: {item.abstract.charAt(0).toUpperCase() + item.abstract.slice(1)}
              </Text>
            </Grid.Col>
            <Grid.Col span={4}>
              <Text className={classes.textSection}>
                Community: {item.community_id.charAt(0).toUpperCase() + item.community_id.slice(1)}
              </Text>
              <Text className={classes.textSection}>
                Created at: {new Date(item.created_at).toDateString()}
              </Text>
              <Text className={classes.textSection}>Status: {item.status.toUpperCase()}</Text>
            </Grid.Col>
          </Grid>
        </td>
      </tr>
    )
  })

  return (
    <Card withBorder radius="md" className={classes.card}>
      <Card.Section className={classes.imageSection}>
        <Text size="md">Resources</Text>
      </Card.Section>
      <Card.Section>
        <Table>
          {rows?.length > 0 ? (
            <tbody>{rows}</tbody>
          ) : (
            <tbody>
              <tr className={classes.noResources}>
                <td>No resources yet for this community</td>
              </tr>
            </tbody>
          )}
        </Table>
      </Card.Section>
    </Card>
  )
}

export default CommunityResources
