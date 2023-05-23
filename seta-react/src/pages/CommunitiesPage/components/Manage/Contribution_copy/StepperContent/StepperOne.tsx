import React, { useContext, useState } from 'react'
import {
  Box,
  Button,
  Group,
  List,
  Paper,
  Stack,
  Text,
  Title,
  FileButton,
  Textarea,
  Tabs,
  createStyles
} from '@mantine/core'

import { Context } from '../context/Context'

const useStyles = createStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',

    '@media (min-width: 748px)': {
      gap: '0.8rem'
    }
  },
  panelOne: {
    paddingTop: '2%',
    display: 'flex'
  },
  panelTwo: {
    paddingTop: '2%'
  },
  tabLeft: {
    width: '50%',
    display: 'initial'
  },
  tabRight: {
    width: '50%'
  }
})

export const StepperOne = () => {
  const { files, textUpload, handleDocumentSelect, handleTextInput } = useContext(Context)
  const [activeTab, setActiveTab] = useState<string | null>('file')
  const { classes } = useStyles()

  return (
    <>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md" mx="auto">
        <Group>
          {/** form header */}
          <Box>
            <Title order={2} color="hsl(213, 96%, 18%)">
              File Upload
            </Title>
            <Text mt={7} fz={{ base: 17, md: 15 }} w="100%" color="hsl(231, 11%, 63%)" fw={400}>
              Upload document or Enter text to start searching documents.
            </Text>
          </Box>

          {/** form */}
          <Stack w="100%">
            <Box className={classes.container}>
              <Tabs value={activeTab} onTabChange={value => setActiveTab(value)}>
                <Tabs.List>
                  <Tabs.Tab value="file">File Upload</Tabs.Tab>
                  <Tabs.Tab value="text">Text Upload</Tabs.Tab>
                </Tabs.List>

                {activeTab === 'file' ? (
                  <Tabs.Panel value="file" className={classes.panelOne}>
                    <Group position="left" className={classes.tabLeft}>
                      <FileButton
                        onChange={handleDocumentSelect}
                        accept="image/png,image/jpeg"
                        multiple
                      >
                        {props => <Button {...props}>Upload image</Button>}
                      </FileButton>

                      {files?.length > 0 && (
                        <Text size="sm" mt="sm">
                          Picked files:
                        </Text>
                      )}

                      <List size="sm" mt={5} withPadding>
                        {files?.map(file => (
                          <List.Item key={file.name}>{file.name}</List.Item>
                        ))}
                      </List>
                    </Group>
                    <Group position="right" className={classes.tabRight}>
                      <Button color="green"> Auto Taxonomy </Button>
                    </Group>
                  </Tabs.Panel>
                ) : (
                  <Tabs.Panel value="text" className={classes.panelTwo}>
                    <Textarea
                      value={textUpload}
                      onChange={handleTextInput}
                      placeholder="Paste your text here"
                    />
                  </Tabs.Panel>
                )}
              </Tabs>
            </Box>
          </Stack>
        </Group>
      </Paper>
    </>
  )
}
