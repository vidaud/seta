import React, { useContext, useEffect } from 'react'
import { Button, Group, Text, FileButton, Tabs, createStyles } from '@mantine/core'

import { useFileToText } from '~/api/embeddings/file-to-text'

import { Context } from '../context/Context'

const useStyles = createStyles({
  panelOne: {
    paddingTop: '2%',
    display: 'flex'
  },
  tabLeft: {
    width: '50%',
    display: 'initial'
  },
  tabRight: {
    width: '50%'
  }
})

export const UploadFile = handleTextInput => {
  const { file, handleDocumentSelect } = useContext(Context)
  const { classes } = useStyles()

  const formData = new FormData()

  formData.append('file', file)

  const { data } = useFileToText(formData)

  useEffect(() => {
    if (data) {
      handleTextInput(data.text)
      //   setEmbeddings(data.emb_with_chunk_text[0])
    }
  }, [data, handleTextInput])

  return (
    <>
      <Tabs.Panel value="file" className={classes.panelOne}>
        <Group position="left" className={classes.tabLeft}>
          <FileButton onChange={handleDocumentSelect} accept="pdf/docx">
            {props => <Button {...props}>Upload image</Button>}
          </FileButton>

          {file && (
            <Text size="sm" mt="sm">
              Picked file: {file.name}
            </Text>
          )}
        </Group>
        <Group position="right" className={classes.tabRight}>
          <Button color="green"> Auto Taxonomy </Button>
        </Group>
      </Tabs.Panel>
    </>
  )
}
