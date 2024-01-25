import { Title, Container, Accordion, MantineProvider, Text } from '@mantine/core'

import Breadcrumbs from '~/components/Breadcrumbs'

import type { Crumb } from '~/types/breadcrumbs'

import { useStyles } from './style'

const breadcrumbs: Crumb[] = [
  {
    title: 'FAQs',
    path: '/faqs'
  }
]

const FaqsPage = () => {
  const { classes } = useStyles()

  const seta_search = '/seta-search/api/v1/doc'
  const data_api = '/seta-ui/api/v1/data-sources/doc'

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
            defaultValue={['filters', 'upload-doc', 'api']}
            chevronSize={50}
            variant="separated"
          >
            <Accordion.Item className={classes.item} value="filters">
              <Accordion.Control className={classes.control}>
                <Text fw={700}> How does the user screen and filter search results in SeTA? </Text>
              </Accordion.Control>
              <Accordion.Panel>
                <Text>
                  On the left side of the Search results area, there are filters that can be applied
                  to refine the search of the results:
                </Text>
                <Text italic>by Data Range, Data Sources, Taxonomies, etc.</Text>
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
                  You can upload documents either by dragging and dropping them, or by selecting
                  their location path.
                </Text>
              </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item className={classes.item} value="api">
              <Accordion.Control className={classes.control}>
                <Text fw={700}>
                  How can the data sources and the search tool be accessed through API's?
                </Text>
              </Accordion.Control>
              <Accordion.Panel>
                <Text>
                  <Text>
                    The SeTA REST APIs are created with the support of Swagger, which allows for the
                    generation of interactive API documentation. This documentation enables users to
                    try out API calls directly in their browser. You can access the API
                    documentation through the following links:
                  </Text>
                </Text>
                <Text
                  variant="link"
                  component="a"
                  href={data_api}
                  color="blue"
                  underline
                  align="center"
                >
                  Data Sources API
                </Text>
                <br />
                <Text
                  variant="link"
                  component="a"
                  href={seta_search}
                  color="blue"
                  underline
                  align="center"
                >
                  SeTA Search API
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
