import { useMemo } from 'react'
import { Anchor, Flex, Progress, Text, clsx, Tooltip } from '@mantine/core'
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
  const openClass = clsx({ open: detailsOpen })

  const hasDetails = !!taxonomy?.length || !!chunk_text

  const scorePercent = score.toLocaleString(undefined, {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })

  const toggleIcon = hasDetails && (
    <div css={S.chevron} className={chevronClass}>
      <FaChevronDown />
    </div>
  )

  return (
    <div css={S.root} className={openClass}>
      <div css={S.header} data-details={hasDetails} data-open={detailsOpen} onClick={toggle}>
        <Progress size="xl" value={score * 100} color="teal" />

        <Tooltip className="score" label="Match score" position="bottom">
          <div>{scorePercent}</div>
        </Tooltip>

        <div css={S.title}>
          <Text fz="xl" fw={600} truncate={detailsOpen ? undefined : 'end'}>
            {titleHl}
          </Text>
        </div>

        {toggleIcon}
      </div>

      <Flex direction="column" gap="xs" data-info css={S.info}>
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
