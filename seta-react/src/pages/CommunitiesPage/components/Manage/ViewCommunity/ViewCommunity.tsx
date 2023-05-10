import {
  Anchor,
  Breadcrumbs,
  Button,
  Grid,
  Group,
  Paper,
  Text,
  Title,
  createStyles
} from '@mantine/core'

import CommunityResources from '../CommunityResources/CommunityResources'
import Stats from '../Stats/Stats'

const items = [
  { title: 'My Communities', href: 'http://localhost/communities/my-list' },
  { title: 'Update Community' }
].map((item, index) => (
  <Anchor href={item.href} key={index}>
    {item.title}
  </Anchor>
))

const useStyles = createStyles({
  title: {
    textAlign: 'left'
  },
  text: {
    textAlign: 'left'
  }
})
const ViewCommunity = () => {
  const { classes } = useStyles()

  return (
    <>
      <Breadcrumbs>{items}</Breadcrumbs>
      <div className="page">
        <Grid grow>
          <Grid.Col span={12}>
            <Paper shadow="xs" p="md">
              <Title order={5} className={classes.title}>
                Title 1
              </Title>
              <Text className={classes.text}>
                Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing
                industries for previewing layouts and visual mockups.
              </Text>
              <Group spacing={30} position="right">
                <Button>Manage</Button>
              </Group>
            </Paper>
          </Grid.Col>
          <Grid.Col span={1}>
            <Stats />
          </Grid.Col>
          <Grid.Col span={5}>
            <CommunityResources />
          </Grid.Col>
        </Grid>
      </div>
    </>
  )
}

export default ViewCommunity
