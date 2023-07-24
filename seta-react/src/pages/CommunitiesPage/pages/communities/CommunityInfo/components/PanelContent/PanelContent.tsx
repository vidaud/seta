import { Box } from '@mantine/core'

import useModalState from '../../../../../../../hooks/use-modal-state'
import InfoContainer from '../../../../../../SearchPageNew/components/documents/DocumentInfo/components/InfoContainer/InfoContainer'
import ChangeCommunityRequests from '../ChangeRequests/ChangeRequests'
import CommunityInvites from '../CommunityInvites/CommunityInvites'
import CommunityUsersPermissions from '../CommunityUserPermissions/CommunityUserPermissions'
import MembershipRequests from '../MembershipRequests/MembershipRequests'
import PanelModal from '../PanelModal/PanelModal'

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
