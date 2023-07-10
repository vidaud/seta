import { Collapse, Stack } from '@mantine/core'

import type { ClassNameProp } from '~/types/children-props'
import type { Taxonomy } from '~/types/search/documents'

import ChunkPreview from '../ChunkPreview'
import TaxonomyInfo from '../TaxonomyInfo'

type Props = ClassNameProp & {
  open: boolean
  documentTitle: string
  documentId: string
  taxonomy: Taxonomy[] | null
  chunkText: string | null
  chunkNumber: number
  queryTerms?: string[]
}

const DocumentDetails = ({
  className,
  open,
  documentId,
  documentTitle,
  taxonomy,
  chunkText,
  chunkNumber,
  queryTerms
}: Props) => {
  const hasTaxonomy = !!taxonomy?.length

  if (!hasTaxonomy && !chunkText) {
    return null
  }

  const chunkMeta = {
    documentId,
    documentTitle,
    chunkNumber
  }

  return (
    <Collapse className={className} in={open}>
      <Stack spacing="sm">
        {hasTaxonomy && <TaxonomyInfo taxonomy={taxonomy} documentTitle={documentTitle} />}

        {chunkText && <ChunkPreview text={chunkText} queryTerms={queryTerms} {...chunkMeta} />}
      </Stack>
    </Collapse>
  )
}

export default DocumentDetails
