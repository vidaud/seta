import { Stack } from '@mantine/core'

import AnnotationsPreview from '~/pages/SearchPageNew/components/AnnotationsPreview'

import type { ClassNameProp } from '~/types/children-props'
import type { Annotation } from '~/types/search/annotations'

import ChunkPreview from '../ChunkPreview'

type Props = ClassNameProp & {
  documentTitle: string
  documentId: string
  chunkText: string | null
  chunkNumber: number
  queryTerms?: string[]
  documentAnnotations?: Annotation[]
}

const DocumentDetails = ({
  className,
  documentId,
  documentTitle,
  chunkText,
  chunkNumber,
  queryTerms,
  documentAnnotations
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
      <AnnotationsPreview annotations={documentAnnotations} mt={-4} mb="sm" />

      {/* TODO: Add back in with flat list Taxonomies */}
      {/* {hasTaxonomy && <TaxonomyInfo taxonomy={taxonomy} documentTitle={documentTitle} />} */}

      {chunkText && (
        <ChunkPreview
          text={chunkText}
          queryTerms={queryTerms}
          documentAnnotations={documentAnnotations}
          {...chunkMeta}
        />
      )}
    </Stack>
  )
}

export default DocumentDetails
