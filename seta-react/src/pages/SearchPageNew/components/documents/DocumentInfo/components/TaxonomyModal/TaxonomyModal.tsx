import { CgFileDocument } from 'react-icons/cg'

import ScrollModal from '~/components/ScrollModal'

import type { ModalStateProps } from '~/types/lib-props'
import type { Taxonomy } from '~/types/search/documents'

import TaxonomyTree from '../TaxonomyTree'

type Props = {
  taxonomy: Taxonomy[]
  title: string
} & ModalStateProps

const TaxonomyModal = ({ taxonomy, title, ...props }: Props) => (
  <ScrollModal title={title} icon={<CgFileDocument />} {...props}>
    <TaxonomyTree taxonomy={taxonomy} />
  </ScrollModal>
)

export default TaxonomyModal
