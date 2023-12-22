import { useState } from 'react'
import { Box, Flex } from '@mantine/core'

import * as S from './styles'

import JSONImport from '../JSONImport'

const ImportContainer = () => {
  const [JSONEditing, setJSONEditing] = useState(false)

  // const { documents, loading } = useUploadDocuments()

  const showEditors = JSONEditing

  const content = (
    <Box h={420}>
      <JSONImport
        editing={JSONEditing}
        onEdit={() => setJSONEditing(true)}
        onCancel={() => setJSONEditing(false)}
      />
    </Box>
  )

  return (
    <Flex direction="column" css={S.root} data-docs={!showEditors}>
      {content}
    </Flex>
  )
}

export default ImportContainer
