import { Suspense, lazy } from 'react'
import { Box } from '@mantine/core'

import InfoContainer from '~/pages/SearchPageNew/components/documents/DocumentInfo/components/InfoContainer'

import useModalState from '~/hooks/use-modal-state'

import ChangeCommunityRequests from '../ChangeRequests'
import PanelModal from '../PanelModal'

const MembershipRequests = lazy(() => import('../MembershipRequests'))
const CommunityUsersPermissions = lazy(() => import('../CommunityUserPermissions'))
const CommunityInvites = lazy(() => import('../CommunityInvites'))

type Props = {
  id: string
  panel: string | null
}

const PanelContent = ({ id, panel }: Props) => {
  const { modalOpen, openModal, closeModal } = useModalState()

  const title =
    panel === 'change_requests'
      ? 'Change Requests'
      : panel === 'membership_requests'
      ? 'Membership Requests'
      : panel === 'invites'
      ? 'Invites'
      : 'User Permissions'

  return (
    <>
      <InfoContainer expandable expandTitle={`Expand ${title.toLowerCase()}`} onExpand={openModal}>
        <Box>
          {panel === 'change_requests' ? (
            <Suspense fallback={null}>
              <ChangeCommunityRequests id={id} />
            </Suspense>
          ) : panel === 'membership_requests' ? (
            <Suspense fallback={null}>
              <MembershipRequests id={id} type="container" />
            </Suspense>
          ) : panel === 'invites' ? (
            <Suspense fallback={null}>
              <CommunityInvites id={id} type="container" />
            </Suspense>
          ) : (
            <Suspense fallback={null}>
              <CommunityUsersPermissions id={id} type="container" />
            </Suspense>
          )}
        </Box>
      </InfoContainer>

      <PanelModal
        title={title}
        id={id}
        panel={panel}
        type="modal"
        opened={modalOpen}
        onClose={closeModal}
      />
    </>
  )
}

export default PanelContent
