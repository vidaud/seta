import { useEffect, useState } from 'react'
import { Box } from '@mantine/core'

import InfoContainer from '~/pages/SearchPageNew/components/documents/DocumentInfo/components/InfoContainer'

import useModalState from '~/hooks/use-modal-state'

import ChangeCommunityRequests from '../ChangeRequests'
import CommunityInvites from '../CommunityInvites'
import CommunityUsersPermissions from '../CommunityUserPermissions/CommunityUserPermissions'
import MembershipRequests from '../MembershipRequests'
import PanelModal from '../PanelModal'

type Props = {
  id: string
  panel: string | null
}

const PanelContent = ({ id, panel }: Props) => {
  const { modalOpen, openModal, closeModal } = useModalState()
  const [title, setTitle] = useState('Resources')

  useEffect(() => {
    if (panel) {
      setTitle(
        panel === 'change_requests'
          ? 'Change Requests'
          : panel === 'membership_requests'
          ? 'Membership Requests'
          : panel === 'invites'
          ? 'Invites'
          : 'User Permissions'
      )
    }
  }, [panel, title])

  return (
    <>
      <InfoContainer expandable expandTitle={`Expand ${title.toLowerCase()}`} onExpand={openModal}>
        <Box>
          {panel === 'change_requests' ? (
            <ChangeCommunityRequests id={id} />
          ) : panel === 'membership_requests' ? (
            <MembershipRequests id={id} type="container" />
          ) : panel === 'invites' ? (
            <CommunityInvites id={id} type="container" />
          ) : panel === 'permissions' ? (
            <CommunityUsersPermissions id={id} type="container" />
          ) : null}
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
