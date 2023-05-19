import { clsx } from '@mantine/core'

import type { ClassNameProp } from '~/types/children-props'

import * as S from './styles'

import type { TaxonomyTreeNode } from '../../utils/taxonomy-tree'

type Props = ClassNameProp & {
  node: TaxonomyTreeNode
}

const TaxonomyNode = ({ className, node }: Props) => {
  const { children, label } = node

  const nodeClass = clsx(className, { leaf: !children.length })

  const childrenContainer = !!children.length && (
    <div>
      {node.children.map(child => (
        <TaxonomyNode key={child.code} node={child} />
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
