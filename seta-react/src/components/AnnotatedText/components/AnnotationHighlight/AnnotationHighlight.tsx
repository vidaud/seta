import type { ChildrenProp } from '~/types/children-props'
import type { AnnotationInfo } from '~/types/search/annotations'

import * as S from './styles'

type Props = {
  annotationInfo: AnnotationInfo
} & ChildrenProp

const AnnotationHighlight = ({ annotationInfo, children }: Props) => {
  const { color, category, name } = annotationInfo

  return (
    <S.HighlightedText $color={color}>
      {children}

      <span data-tooltip>
        <span data-category>{category}: </span>
        <span data-name>{name}</span>
      </span>
    </S.HighlightedText>
  )
}

export default AnnotationHighlight
