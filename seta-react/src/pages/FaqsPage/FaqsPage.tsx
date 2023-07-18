import { useState, useEffect } from 'react'
import {
  createStyles,
  Title,
  Container,
  Accordion,
  ThemeIcon,
  MantineProvider,
  getStylesRef,
  rem
} from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'
import parse from 'html-react-parser'

import { FaqsService } from '../../services/FaqsService'

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
    backgroundColor: theme.white,
    borderBottom: 0,
    borderRadius: theme.radius.md,
    boxShadow: theme.shadows.lg,
    overflow: 'hidden'
  },

  control: {
    fontSize: theme.fontSizes.lg,
    padding: `${theme.spacing.lg} ${theme.spacing.xl}`,
    color: theme.black,

    '&:hover': {
      backgroundColor: 'transparent'
    }
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

const FaqsPage = () => {
  const { classes } = useStyles()
  const [nodes, setNodes] = useState<any>()
  const nodeService = new FaqsService()

  const expandNode = (node, _expandedKeys) => {
    if (node.children && node.children.length) {
      _expandedKeys[node.key] = true

      for (const child of node.children) {
        expandNode(child, _expandedKeys)
      }
    }
  }

  useEffect(() => {
    const nodeData = nodeService.getTreeNodes()

    setNodes(nodeData)
  }, [])

  const nodeTemplate = (node, options) => {
    const data = parse(node.data)

    return <span style={{ textAlign: 'justify' }}>{data}</span>
  }
  const seta_api = 'http://localhost/seta-api/api/v1/doc'
  const comm_api = 'http://localhost/seta-ui/api/v1/communities/doc'

  return (
    <MantineProvider inherit theme={{ colorScheme: 'light' }}>
      <div className={classes.wrapper}>
        <Container size="sm">
          <Title align="center" className={classes.title}>
            Frequently Asked Questions
          </Title>

          <Accordion
            chevronPosition="right"
            defaultValue="community-details"
            chevronSize={50}
            variant="separated"
            disableChevronRotation
            chevron={
              <ThemeIcon radius="xl" className={classes.gradient} size={32}>
                <IconPlus size="1.05rem" stroke={1.5} />
              </ThemeIcon>
            }
          >
            <Accordion.Item className={classes.item} value="community-details">
              <Accordion.Control>
                What kind of rights do you need to have in order to update the Community details?
              </Accordion.Control>
              <Accordion.Panel>
                To update the Community details, you need to have administrator rights of the
                Community{}
              </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item className={classes.item} value="resource">
              <Accordion.Control>
                What are the specific details that can be updated in a Community?
              </Accordion.Control>
              <Accordion.Panel>
                It is possible update the 'Title' and 'Description' of the Communities{}
              </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item className={classes.item} value="filters">
              <Accordion.Control>
                How does the user screen and filter search results in SeTA?
              </Accordion.Control>
              <Accordion.Panel>
                On the left side of the Search results area, there are filters that can be applied
                to refine the search of the results: by Data Range, Data Sources, Taxonomies, etc.{}
              </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item className={classes.item} value="upload-doc">
              <Accordion.Control>
                Is it necessary to select the path where the document is located or can we simply
                drag and drop it?
              </Accordion.Control>
              <Accordion.Panel>
                You have both options to upload documents, by drag and drop or selecting the path
                where the docuemnt is located {}
              </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item className={classes.item} value="api">
              <Accordion.Control>
                How can the Communities and Search tool be accessed through API's?
              </Accordion.Control>
              <Accordion.Panel>
                The SeTA REST APIs are created with support of Swagger, you can access through our
                links:
                <br />
                {seta_api}
                <br />
                {comm_api}
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        </Container>
      </div>
    </MantineProvider>
  )
}

export default FaqsPage
