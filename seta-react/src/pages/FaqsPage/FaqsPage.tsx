import {
  createStyles,
  Title,
  Container,
  Accordion,
  MantineProvider,
  getStylesRef,
  rem,
  Text
} from '@mantine/core'
import { IconDotsVertical } from '@tabler/icons-react'

import Breadcrumbs from '~/components/Breadcrumbs'

import type { Crumb } from '~/types/breadcrumbs'

const useStyles = createStyles(theme => ({
  wrapper: {
    paddingTop: `calc(${theme.spacing.xl} * 2)`,
    minHeight: rem(820),
    position: 'relative',
    color: theme.black
  },

  title: {
    color: theme.black,
    fontSize: 52,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    marginBottom: `calc(${theme.spacing.xl} * 1.5)`
  },

  item: {
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.lg,
    border: `${rem(1)} solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
    }`
  },

  control: {
    fontSize: theme.fontSizes.lg,
    borderRadius: theme.radius.sm,
    padding: `${theme.spacing.md} ${theme.spacing.lg}`,
    color: theme.black,
    backgroundColor: theme.colors.blue[4],
    fontWeight: 200
  },

  content: {
    paddingLeft: theme.spacing.xl,
    lineHeight: 1.6,
    color: theme.black
  },

  icon: {
    ref: getStylesRef('icon'),
    marginLeft: theme.spacing.md
  },

  gradient: {
    backgroundImage: `radial-gradient(${theme.colors[theme.primaryColor][6]} 0%, ${
      theme.colors[theme.primaryColor][5]
    } 100%)`
  },

  itemOpened: {
    [`& .${getStylesRef('icon')}`]: {
      transform: 'rotate(45deg)'
    }
  },

  button: {
    display: 'block',
    marginTop: theme.spacing.md,

    [theme.fn.smallerThan('sm')]: {
      display: 'block',
      width: '100%'
    }
  }
}))

const breadcrumbs: Crumb[] = [
  {
    title: 'FAQs',
    path: '/faqs'
  }
]

const FaqsPage = () => {
  const { classes } = useStyles()

  const seta_api = 'http://localhost/seta-api/api/v1/doc'
  const comm_api = 'http://localhost/seta-ui/api/v1/communities/doc'

  return (
    <MantineProvider inherit theme={{ colorScheme: 'light' }}>
      {breadcrumbs && <Breadcrumbs crumbs={breadcrumbs} />}
      <div className={classes.wrapper}>
        <Container size="sm">
          <Title align="center" className={classes.title}>
            Frequently Asked Questions
          </Title>

          <Accordion
            chevronPosition="right"
            multiple
            defaultValue={['invite', 'resource', 'filters', 'upload-doc', 'api']}
            chevronSize={50}
            variant="separated"
          >
            <Accordion.Item className={classes.item} value="invite">
              <Accordion.Control className={classes.control}>
                <Text fw={700}> What option do you need to select in order to invite others? </Text>
              </Accordion.Control>
              <Accordion.Panel>
                <Text>
                  From the community list, click on the <IconDotsVertical size={16} /> placed at the
                  right of the Community name and select the option INVITE.
                </Text>
              </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item className={classes.item} value="resource">
              <Accordion.Control className={classes.control}>
                <Text fw={700}>
                  What are the specific details that can be updated in a Community?
                </Text>
              </Accordion.Control>
              <Accordion.Panel>
                <Text>
                  It is possible to update the 'Title' and 'Description' of the Communities.
                </Text>
              </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item className={classes.item} value="filters">
              <Accordion.Control className={classes.control}>
                <Text fw={700}> How does the user screen and filter search results in SeTA? </Text>
              </Accordion.Control>
              <Accordion.Panel>
                <Text>
                  On the left side of the Search results area, there are filters that can be applied
                  to refine the search of the results:
                </Text>
                <Text italic color="blue">
                  {}
                  by Data Range, Data Sources, Taxonomies, etc.
                  {}
                </Text>
              </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item className={classes.item} value="upload-doc">
              <Accordion.Control className={classes.control}>
                <Text fw={700}>
                  Is it necessary to select the path where the document is located or can we simply
                  drag and drop it?
                </Text>
              </Accordion.Control>
              <Accordion.Panel>
                <Text>
                  You have both options to upload documents, by drag and drop or selecting the path
                  where the docuemnt is located.
                </Text>
              </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item className={classes.item} value="api">
              <Accordion.Control className={classes.control}>
                <Text fw={700}>
                  How can the Communities and Search tool be accessed through API's?
                </Text>
              </Accordion.Control>
              <Accordion.Panel>
                <Text>
                  The SeTA REST APIs are created with support of Swagger which allows to generate
                  interactive API documentation that lets users try out the API calls directly in
                  the browser. You can access through our links:
                </Text>
                <Text variant="link" component="a" href={comm_api} color="blue" underline>
                  Communities API
                </Text>
                <br />
                <Text variant="link" component="a" href={seta_api} color="blue" underline>
                  SeTA API
                </Text>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        </Container>
      </div>
    </MantineProvider>
  )
}

export default FaqsPage
