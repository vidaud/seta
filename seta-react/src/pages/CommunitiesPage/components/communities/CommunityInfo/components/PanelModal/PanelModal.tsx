import { CgFileDocument } from 'react-icons/cg'

import ScrollModal from '~/components/ScrollModal/ScrollModal'

import type { ModalStateProps } from '~/types/lib-props'

import ChangeCommunityRequests from '../ChangeRequests/ChangeRequests'
import CommunityInvites from '../CommunityInvites/CommunityInvites'
import CommunityUsersPermissions from '../CommunityUserPermissions/CommunityUserPermissions'
import MembershipRequests from '../MembershipRequests/MembershipRequests'

type Props = {
  title: string
  id: string
  panel: string | null
  type: string
} & ModalStateProps

const PanelModal = ({ title, id, panel, type, ...props }: Props) => (
  <ScrollModal title={title} icon={<CgFileDocument />} {...props}>
    {panel === 'change_requests' ? (
      <ChangeCommunityRequests id={id} />
    ) : panel === 'membership_requests' ? (
      <MembershipRequests id={id} type={type} />
    ) : panel === 'invites' ? (
      <CommunityInvites id={id} type={type} />
    ) : (
      <CommunityUsersPermissions id={id} type={type} />
    )}
  </ScrollModal>
)

export default PanelModal
