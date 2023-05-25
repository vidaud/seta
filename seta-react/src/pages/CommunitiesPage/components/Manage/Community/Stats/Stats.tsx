import { Card, Text, Group, createStyles, Button, rem, Container } from '@mantine/core'
import { Link, useParams } from 'react-router-dom'

const useStyles = createStyles(theme => ({
  card: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white
  },
  imageSection: {
    background: '#D9D9D9',
    padding: theme.spacing.md,
    color: '#000000'
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
  },
  link: {
    color: 'white'
  }
}))

const Stats = ({ resourceNumber, inviteNumber, memberNumber }) => {
  const { classes } = useStyles()
  const { id } = useParams()

  return (
    <Card withBorder radius="md" className={classes.card}>
      <Card.Section className={classes.imageSection}>
        <Text size="xl">STATS</Text>
      </Card.Section>

      <Group position="apart" mt="md">
        <Container size="xs" px="xs" className={classes.container}>
          <Text className={classes.text}>Members</Text>
          <Group position="right">
            <Button>
              <Link className={classes.link} to={`/my-communities/${id}/members`} replace={true}>
                {memberNumber?.length}
              </Link>
            </Button>
          </Group>
        </Container>
      </Group>

      <Group position="apart" mt="md">
        <Container size="xs" px="xs" className={classes.container}>
          <Text className={classes.text}>Resources</Text>
          <Group position="right">
            <Button>{resourceNumber?.length}</Button>
          </Group>
        </Container>
      </Group>

      <Group position="apart" mt="md">
        <Container size="xs" px="xs" className={classes.container}>
          <Text className={classes.text}>Pending Invites</Text>
          <Group position="right">
            <Button>
              <Link className={classes.link} to={`/my-communities/${id}/invite`} replace={true}>
                {inviteNumber?.length}
              </Link>
            </Button>
          </Group>
        </Container>
      </Group>

      <Card.Section className={classes.section}>
        <Group spacing={30}>
          <Button radius="xl">
            <Link className={classes.link} to={`/my-communities/${id}/new`} replace={true}>
              + New Resource
            </Link>
          </Button>
        </Group>
      </Card.Section>
    </Card>
  )
}

export default Stats
