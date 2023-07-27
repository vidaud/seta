import React, { useContext } from 'react'
import { Textarea, Tabs, createStyles } from '@mantine/core'

import { Context } from '../context/Context'

const useStyles = createStyles({
  panelTwo: {
    paddingTop: '2%'
  }
})

export const UploadText = () => {
  const { textUpload, handleTextInput } = useContext(Context)
  const { classes } = useStyles()

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
