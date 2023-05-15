import { useEffect } from 'react'
import { Card, Grid, Table, Text, createStyles } from '@mantine/core'

const useStyles = createStyles(theme => ({
  card: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white
  },
  imageSection: {
    background: 'gray',
    padding: theme.spacing.md,
    color: 'white'
  },
  rowSection: {
    padding: theme.spacing.xl,
    border: '0.0625rem solid #dee2e6'
  },
  textSection: {
    paddingLeft: theme.spacing.sm,
    paddingRight: theme.spacing.sm,
    paddingBottom: theme.spacing.sm
  }
}))

const CommunityResources = resources => {
  const { classes } = useStyles()

  useEffect(() => {
    if (resources) {
      console.log(resources)
    }
  }, [resources])

  const getResource = () => {
    console.log('Test')
  }

  const rows = resources.data.map(item => {
    return (
      <tr key={item.community_id} className={classes.rowSection}>
        <Grid onClick={getResource}>
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
