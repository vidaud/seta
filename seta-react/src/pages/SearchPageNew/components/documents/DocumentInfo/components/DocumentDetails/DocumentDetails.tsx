import { Stack } from '@mantine/core'

import type { ClassNameProp } from '~/types/children-props'

import ChunkPreview from '../ChunkPreview'

type Props = ClassNameProp & {
  documentTitle: string
  documentId: string
  chunkText: string | null
  chunkNumber: number
  queryTerms?: string[]
}

const DocumentDetails = ({
  className,
  documentId,
  documentTitle,
  chunkText,
  chunkNumber,
  queryTerms
}: Props) => {
  if (!chunkText) {
    return null
  }

  const chunkMeta = {
    documentId,
    documentTitle,
    chunkNumber
  }

  return (
    <Stack spacing="sm" className={className}>
      {/* TODO: Add back in with flat list Taxonomies */}
      {/* {hasTaxonomy && <TaxonomyInfo taxonomy={taxonomy} documentTitle={documentTitle} />} */}

      {chunkText && <ChunkPreview text={chunkText} queryTerms={queryTerms} {...chunkMeta} />}
    </Stack>
  )
}

export default DocumentDetails
