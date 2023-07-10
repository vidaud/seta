import type { BoxProps } from '@mantine/core'
import { ActionIcon, Box, Text, Tooltip } from '@mantine/core'
import { FiMaximize } from 'react-icons/fi'
import { ImQuotesLeft, ImQuotesRight } from 'react-icons/im'

import type { ChildrenProp } from '~/types/children-props'

import * as S from './styles'

type Props = {
  title?: string
  expandable?: boolean
  withQuotes?: boolean
  expandTitle?: string
  onExpand?: () => void
} & ChildrenProp

const InfoContainer = ({
  title,
  expandable,
  withQuotes,
  expandTitle = 'Expand',
  children,
  onExpand
}: Props) => {
  const padding: BoxProps['p'] = withQuotes ? 'xl' : 0

  return (
    <S.Container>
      <Box px={padding} css={S.root}>
        {expandable && (
          <Tooltip label={expandTitle}>
            <ActionIcon
              variant="subtle"
              onClick={onExpand}
              radius="sm"
              size="md"
              color="gray.5"
              data-action-expand
            >
              <FiMaximize size={20} strokeWidth={3} />
            </ActionIcon>
          </Tooltip>
        )}

        {withQuotes && (
          <div css={S.quote} className="left">
            <ImQuotesLeft size={24} />
          </div>
        )}

        {title && (
          <Text fz="lg" fw={600} color="gray.8" mb="sm">
            {title}
          </Text>
        )}

        {children}

        {withQuotes && (
          <div css={S.quote} className="right">
            <ImQuotesRight size={24} />
          </div>
        )}
      </Box>
    </S.Container>
  )
}

export default InfoContainer
