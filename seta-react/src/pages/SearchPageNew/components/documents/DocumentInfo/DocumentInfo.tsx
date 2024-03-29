import { useMemo, useState } from 'react'
import { Progress, Text, clsx, Tooltip, Flex, Anchor } from '@mantine/core'
import { IconTag, IconWallet } from '@tabler/icons-react'
import { FiCheck } from 'react-icons/fi'
import { GiSaveArrow } from 'react-icons/gi'

import type { Action } from '~/components/ActionsGroup'
import TogglePanel from '~/components/TogglePanel'
import { useStagedDocuments } from '~/pages/SearchPageNew/contexts/staged-documents-context'
import useSaveDocsModal from '~/pages/SearchPageNew/hooks/use-save-docs-modal'

import { useHighlightWords } from '~/hooks/use-highlight'
import type { Document } from '~/types/search/documents'
import { dateFormatted } from '~/utils/date-utils'

import DocumentDetails from './components/DocumentDetails'
import * as S from './styles'

type Props = {
  document: Document
  queryTerms?: string[]
}

const DocumentInfo = ({ document, queryTerms }: Props) => {
  const {
    _id,
    document_id,
    title,
    score,
    link_origin,
    abstract,
    source,
    collection,
    date,
    chunk_text,
    chunk_number,
    other
  } = document

  const { annotation_position } = other ?? {}

  const [detailsOpen, setDetailsOpen] = useState(false)

  const { isStaged, toggleStaged } = useStagedDocuments()
  const { saveModal, handleSave } = useSaveDocsModal({ selectedDocs: [] })

  const path = useMemo(
    () => [source.toUpperCase(), collection, dateFormatted(date)].filter(Boolean).join(' > '),
    [source, collection, date]
  )

  const isDocumentStaged = useMemo(() => isStaged(_id), [_id, isStaged])

  const [titleHl, abstractHl] = useHighlightWords(queryTerms, title, abstract)

  const hasDetails = !!chunk_text

  const scorePercent = score.toLocaleString(undefined, {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })

  const actions: Action[] = [
    {
      name: 'save-doc',
      icon: <IconWallet size={22} />,
      color: 'orange',
      tooltip: 'Save to my documents',
      onClick: () => handleSave([{ id: _id, title, link: link_origin }])
    },
    {
      name: 'stage-doc',
      icon: <GiSaveArrow size={20} />,
      color: 'blue',
      tooltip: 'Stage document',
      toggleable: true,
      toggled: isDocumentStaged,
      toggledColor: 'teal',
      toggledTooltip: 'Remove from staged documents',
      toggledIcon: <FiCheck size={22} style={{ marginTop: 2 }} />,
      onToggle: staged => toggleStaged(_id, title, link_origin, staged)
    }
  ]

  const annotationsTooltip = useMemo(
    () =>
      annotation_position?.map(annotation => {
        const [id, text] = annotation.id.split(':')

        return (
          <div key={annotation.id}>
            <Text size="sm" color="gray.3" component="span">
              {id}:
            </Text>{' '}
            <Text size="sm" color="white" component="span">
              {text}
            </Text>
          </div>
        )
      }),
    [annotation_position]
  )

  const annotationsInfo = annotation_position && !detailsOpen && (
    <div className="annotations">
      <Tooltip label={annotationsTooltip}>
        <IconTag size={22} />
      </Tooltip>
    </div>
  )

  const header = (
    <div css={S.header}>
      <Progress size="xl" value={score * 100} color="teal" />

      {annotationsInfo}

      <Tooltip label="Match score" position="bottom">
        <div className={clsx('score', { visible: detailsOpen })}>{scorePercent}</div>
      </Tooltip>

      <div css={S.title}>
        <Text fz="xl" fw={600} truncate={detailsOpen ? undefined : 'end'} data-title>
          {titleHl}
        </Text>
      </div>
    </div>
  )

  const details = hasDetails && (
    <DocumentDetails
      css={S.details}
      documentId={document_id}
      documentTitle={title}
      documentAnnotations={annotation_position}
      chunkText={chunk_text}
      chunkNumber={chunk_number}
      queryTerms={queryTerms}
    />
  )

  return (
    <>
      <TogglePanel
        open={detailsOpen}
        onChange={setDetailsOpen}
        header={header}
        actions={actions}
        details={details}
      >
        <Flex direction="column" gap="xs" css={[S.info, detailsOpen && S.infoOpen]}>
          <div>
            <div>{abstractHl}</div>

            <div css={S.path}>{path}</div>

            {link_origin && (
              <div>
                <Anchor href={link_origin} target="_blank">
                  {link_origin}
                </Anchor>
              </div>
            )}
          </div>
        </Flex>
      </TogglePanel>

      {saveModal}
    </>
  )
}

export default DocumentInfo
