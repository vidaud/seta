import React, { useContext, useEffect } from 'react'
import { Textarea, Tabs, createStyles } from '@mantine/core'

import { useEmbedding } from '../../../../../../../api/embeddings/embedding'
import { Context } from '../context/Context'

const useStyles = createStyles({
  panelTwo: {
    paddingTop: '2%'
  }
})

export const UploadText = () => {
  const { textUpload, handleTextInput, setEmbeddings } = useContext(Context)
  const { classes } = useStyles()

  const { data } = useEmbedding(textUpload)

  useEffect(() => {
    if (data) {
      setEmbeddings(data.emb_with_chunk_text[0])
    }
  }, [data])

  return (
    <>
      <Tabs.Panel value="text" className={classes.panelTwo}>
        <Textarea
          value={textUpload}
          onChange={handleTextInput}
          placeholder="Paste your text here"
        />
      </Tabs.Panel>
    </>
  )
}
