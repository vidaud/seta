import { Collapse, Flex } from '@mantine/core'

import type { ClassNameProp } from '~/types/children-props'
import type { Taxonomy } from '~/types/search/documents'

import ChunkPreview from '../ChunkPreview'
import TaxonomyTree from '../TaxonomyTree'

type Props = ClassNameProp & {
  open: boolean
  taxonomy: Taxonomy[] | null
  chunkText: string | null
  queryTerms: string[]
}

const DocumentDetails = ({ className, open, taxonomy, chunkText, queryTerms }: Props) => {
  if (!taxonomy && !chunkText) {
    return null
  }

  return (
    <Collapse className={className} in={open}>
      <Flex gap="md">
        {taxonomy && <TaxonomyTree taxonomy={taxonomy} />}
        {chunkText && <ChunkPreview text={chunkText} queryTerms={queryTerms} />}
      </Flex>
    </Collapse>
  )
}

export default DocumentDetails
