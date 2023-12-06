import type { ReactElement } from 'react'
import { Transition } from '@mantine/core'
import { AiOutlineFileSearch } from 'react-icons/ai'

import Tabs, { Tab } from '~/components/Tabs'
import { useStagedDocuments } from '~/pages/SearchPageNew/contexts/staged-documents-context'
import { ResultsTab } from '~/pages/SearchPageNew/types/tabs'

import usePinned from '~/hooks/use-pinned'

import StagedDocsInfo from './components/StagedDocsInfo'
import * as S from './styles'

import StagedDocsPopup from '../documents/StagedDocsPopup'

type Props = {
  children: ReactElement
}

const SearchResultsTabs = ({ children }: Props) => {
  const { pinnedRef, isPinned } = usePinned()

  const { stagedDocuments } = useStagedDocuments()

  const stagedDocsButton = (
    <div css={S.stagedDocs}>
      <Transition transition="pop" mounted={!!stagedDocuments.length}>
        {styles => <StagedDocsInfo style={styles} docs={stagedDocuments} />}
      </Transition>
    </div>
  )

  return (
    <Tabs
      css={S.root}
      defaultValue={ResultsTab.DOCUMENTS}
      panels={children}
      tabsRef={pinnedRef}
      data-pinned={isPinned}
    >
      <div css={S.tabsContainer}>
        <Tab
          value={ResultsTab.DOCUMENTS}
          label="Documents"
          icon={<AiOutlineFileSearch css={S.documentsIcon} />}
          color="orange"
        />

        {/* TODO: Re-enable these 👇🏻 as we start working on them */}

        {/* <Tab value={ResultsTab.CONCEPTS} label="Concepts" icon={<BiNetworkChart />} color="grape" />

        <Tab
          value={ResultsTab.VALIDATION}
          label="Validation"
          icon={<RiCheckDoubleLine />}
          color="teal"
        /> */}

        <StagedDocsPopup target={stagedDocsButton} />
      </div>
    </Tabs>
  )
}

export default SearchResultsTabs
