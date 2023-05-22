import { clsx } from '@mantine/core'

import type { ClassNameProp } from '~/types/children-props'
import type { Taxonomy } from '~/types/search/documents'

import * as S from './styles'

type Props = ClassNameProp & {
  taxonomy: Taxonomy
}

const TaxonomyNode = ({ className, taxonomy }: Props) => {
  const { subcategories, label } = taxonomy

  const nodeClass = clsx(className, { leaf: !subcategories.length })

  const childrenContainer = !!subcategories.length && (
    <div>
      {subcategories.map(child => (
        <TaxonomyNode key={child.code} taxonomy={child} />
      ))}
    </div>
  )

  return (
    <div css={S.node} className={nodeClass}>
      <div>{label}</div>

      {childrenContainer}
    </div>
  )
}

export default TaxonomyNode
