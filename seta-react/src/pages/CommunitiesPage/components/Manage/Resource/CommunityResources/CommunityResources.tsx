import { useEffect, useState } from 'react'
import { Card, Grid, Table, Text, createStyles } from '@mantine/core'
import { useNavigate } from 'react-router-dom'

const useStyles = createStyles(theme => ({
  card: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white
  },
  imageSection: {
    background: '#D9D9D9',
    padding: theme.spacing.md,
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
  }
}))

const CommunityResources = resources => {
  const { classes } = useStyles()
  const navigate = useNavigate()
  const [items, setItems] = useState(resources)

  useEffect(() => {
    if (resources) {
      setItems(resources)
    }
  }, [resources, items])

  const getResource = item => {
    if (item.community_id) {
      navigate(`/my-communities/${item.community_id}/${item.resource_id}`)
    } else {
      navigate(`/my-resources/${item.resource_id}`)
    }
  }

  const rows = items?.data?.map(item => {
    return (
      <tr key={item.resource_id} className={classes.rowSection}>
        <Grid onClick={() => getResource(item)}>
          <Grid.Col span={8}>
            <Text className={classes.textSection}>Title: {item.title}</Text>
            <Text className={classes.textSection}>Abstract: {item.abstract}</Text>
          </Grid.Col>
          <Grid.Col span={4}>
            <Text className={classes.textSection}>Community: {item.community_id}</Text>
            <Text className={classes.textSection}>{item.created_at}</Text>
            <Text className={classes.textSection}>Status: {item.status}</Text>
          </Grid.Col>
        </Grid>
      </tr>
    )
  })

  return (
    <Card withBorder radius="md" className={classes.card}>
      <Card.Section className={classes.imageSection}>
        <Text size="xl">Resources</Text>
      </Card.Section>
      <Card.Section>
        <Table>
          <tbody>{rows}</tbody>
        </Table>
      </Card.Section>
    </Card>
  )
}

export default CommunityResources
