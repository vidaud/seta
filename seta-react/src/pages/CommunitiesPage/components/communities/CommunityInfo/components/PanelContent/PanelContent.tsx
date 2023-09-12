import { useEffect } from 'react'
import { Box } from '@mantine/core'

import InfoContainer from '~/pages/SearchPageNew/components/documents/DocumentInfo/components/InfoContainer'

import { useAllCommunityRequestsID } from '~/api/communities/communities/community-all-requests'
import useModalState from '~/hooks/use-modal-state'

import ChangeCommunityRequests from '../ChangeRequests'
import type { DataResponse } from '../CommunityDetails/CommunityDetails'
import CommunityInvites from '../CommunityInvites'
import CommunityUsersPermissions from '../CommunityUserPermissions'
import MembershipRequests from '../MembershipRequests'
import PanelModal from '../PanelModal'

type Props = {
  id: string
  panel: string | null
  onChange: (value: DataResponse) => void
}

const PanelContent = ({ id, panel, onChange }: Props) => {
  const { modalOpen, openModal, closeModal } = useModalState()
  const { data } = useAllCommunityRequestsID(id)

  useEffect(() => {
    if (data) {
      onChange(data)
    }
  }, [data, onChange])

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
        <Box sx={{ paddingTop: ' 4%' }}>
          {panel === 'change_requests' ? (
            <ChangeCommunityRequests id={id} />
          ) : panel === 'membership_requests' ? (
            <MembershipRequests id={id} type="container" />
          ) : panel === 'invites' ? (
            <CommunityInvites id={id} type="container" />
          ) : (
            <CommunityUsersPermissions id={id} type="container" />
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
