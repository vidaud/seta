import { useMemo } from 'react'

import { getTaxonomyRootWithLeaves } from '~/pages/SearchPageNew/utils/taxonomy'

import useModalState from '~/hooks/use-modal-state'
import type { Taxonomy } from '~/types/search/documents'

import TaxonomyRoot from './TaxonomyRoot'

import InfoContainer from '../InfoContainer'
import TaxonomyModal from '../TaxonomyModal'

type Props = {
  documentTitle: string
  taxonomy: Taxonomy[]
}

const TaxonomyInfo = ({ taxonomy, documentTitle }: Props) => {
  const { modalOpen, openModal, closeModal } = useModalState()

  const roots = useMemo(() => getTaxonomyRootWithLeaves(taxonomy), [taxonomy])

  const title = roots.length === 1 ? 'Taxonomy' : 'Taxonomies'

  return (
    <>
      <InfoContainer
        title={title}
        expandable
        expandTitle={`Expand ${title.toLowerCase()}`}
        onExpand={openModal}
      >
        <>
          {roots.map(rootInfo => (
            <TaxonomyRoot key={rootInfo.root.code} root={rootInfo} />
          ))}
        </>
      </InfoContainer>

      <TaxonomyModal
        title={documentTitle}
        taxonomy={taxonomy}
        opened={modalOpen}
        onClose={closeModal}
      />
    </>
  )
}

export default TaxonomyInfo
