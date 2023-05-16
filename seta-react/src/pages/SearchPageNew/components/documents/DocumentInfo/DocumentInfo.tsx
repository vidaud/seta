import { useMemo } from 'react'
import { Anchor, Flex, Progress, Text, Tooltip, clsx } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { FaChevronDown } from 'react-icons/fa'

import useHighlight from '~/hooks/use-highlight'
import type { Document } from '~/types/search/documents'
import { dateFormatted } from '~/utils/date-utils'

import DocumentDetails from './components/DocumentDetails'
import * as S from './styles'

type Props = {
  document: Document
  queryTerms: string[]
}

const DocumentInfo = ({ document, queryTerms }: Props) => {
  const { title, score, link_origin, abstract, source, collection, date, taxonomy, chunk_text } =
    document

  const [detailsOpen, { toggle }] = useDisclosure()

  const path = useMemo(
    () => [source.toUpperCase(), collection, dateFormatted(date)].filter(Boolean).join(' > '),
    [source, collection, date]
  )

  const [titleHl, abstractHl] = useHighlight(queryTerms, title, abstract)

  const chevronClass = clsx({ open: detailsOpen })

  const hasDetails = !!taxonomy?.length || !!chunk_text

  const toggleIcon = hasDetails && (
    <div css={S.chevron} className={chevronClass} onClick={toggle}>
      <FaChevronDown />
    </div>
  )

  return (
    <div>
      <div css={S.header}>
        <Tooltip label={`Score: ${score}`}>
          <Progress size="xl" value={score} color="teal" />
        </Tooltip>

        <Tooltip label={`"${title}"`} position="top-start">
          <div css={S.title} data-details={hasDetails} onClick={toggle}>
            <Text fz="xl" fw={600} truncate="end">
              {titleHl}
            </Text>
          </div>
        </Tooltip>

        {toggleIcon}
      </div>

      <Flex direction="column" gap="xs" css={S.info}>
        <div>{abstractHl}</div>

        <div css={S.path}>{path}</div>

        <div>
          <Anchor href={link_origin ?? '#'} target="_blank">
            {link_origin}
          </Anchor>
        </div>
      </Flex>

      {hasDetails && (
        <DocumentDetails
          css={S.details}
          open={detailsOpen}
          taxonomy={taxonomy}
          chunkText={chunk_text}
          queryTerms={queryTerms}
        />
      )}
    </div>
  )
}

export default DocumentInfo
