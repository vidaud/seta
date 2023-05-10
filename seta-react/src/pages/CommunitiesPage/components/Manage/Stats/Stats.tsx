import { Card, Text, Group, createStyles, Button, rem, Container } from '@mantine/core'

const useStyles = createStyles(theme => ({
  card: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white
  },
  imageSection: {
    background: 'gray',
    padding: theme.spacing.md,
    color: 'white'
  },
  section: {
    padding: theme.spacing.md
  },
  container: {
    width: '100%',
    display: 'flex',
    padding: theme.spacing.md,
    border: `${rem(1)} solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
    borderRadius: '4px'
  },
  text: {
    width: '50%'
  }
}))

const Stats = () => {
  const { classes } = useStyles()

  return (
    <Card withBorder radius="md" className={classes.card}>
      <Card.Section className={classes.imageSection}>
        <Text size="xl">STATS</Text>
      </Card.Section>

      <Group position="apart" mt="md">
        <Container size="xs" px="xs" className={classes.container}>
          <Text className={classes.text}>Members</Text>
          <Group position="right">
            <Button>21</Button>
          </Group>
        </Container>
      </Group>

      <Group position="apart" mt="md">
        <Container size="xs" px="xs" className={classes.container}>
          <Text className={classes.text}>Resources</Text>
          <Group position="right">
            <Button>13</Button>
          </Group>
        </Container>
      </Group>

      <Card.Section className={classes.section}>
        <Group spacing={30}>
          <Button radius="xl">+ New Resource</Button>
        </Group>
      </Card.Section>
    </Card>
  )
}

export default Stats
