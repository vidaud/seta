import { forwardRef, type ReactNode } from 'react'
import { Tooltip } from '@mantine/core'

import * as S from './styles'

type Props = {
  isCurrent?: boolean
  chunkNumber: number
  children: ReactNode
}

const DocumentChunk = forwardRef<HTMLDivElement, Props>(
  ({ isCurrent, chunkNumber, children }, ref) => (
    <div ref={ref} css={S.chunkRoot}>
      {isCurrent && (
        <Tooltip label="Current chunk" position="right">
          <div css={S.currentChunkMarker} />
        </Tooltip>
      )}

      <div css={S.chunkNumber}>- {chunkNumber} -</div>

      {children}
    </div>
  )
)

export default DocumentChunk
