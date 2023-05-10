import { Card, Text, createStyles } from '@mantine/core'

const useStyles = createStyles(theme => ({
  card: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white
  },
  imageSection: {
    background: 'gray',
    padding: theme.spacing.md,
    color: 'white'
  }
}))

const CommunityResources = () => {
  const { classes } = useStyles()

  return (
    <Card withBorder radius="md" className={classes.card}>
      <Card.Section className={classes.imageSection}>
        <Text size="xl">Resources</Text>
      </Card.Section>
    </Card>
  )
}

export default CommunityResources
