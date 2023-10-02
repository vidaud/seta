import { Suspense, lazy } from 'react'
import { CgFileDocument } from 'react-icons/cg'

import ScrollModal from '~/components/ScrollModal'

import type { ModalStateProps } from '~/types/lib-props'

const ChangeCommunityRequests = lazy(() => import('../ChangeRequests'))
const CommunityInvites = lazy(() => import('../CommunityInvites'))
const CommunityUsersPermissions = lazy(() => import('../CommunityUserPermissions'))
const MembershipRequests = lazy(() => import('../MembershipRequests'))

type Props = {
  title: string
  id: string
  panel: string | null
  type: string
} & ModalStateProps

const PanelModal = ({ title, id, panel, type, ...props }: Props) => (
  <ScrollModal title={title} icon={<CgFileDocument />} {...props}>
    {panel === 'change_requests' ? (
      <Suspense fallback={null}>
        <ChangeCommunityRequests id={id} />
      </Suspense>
    ) : panel === 'membership_requests' ? (
      <Suspense fallback={null}>
        <MembershipRequests id={id} type={type} />
      </Suspense>
    ) : panel === 'invites' ? (
      <Suspense fallback={null}>
        <CommunityInvites id={id} type={type} />
      </Suspense>
    ) : (
      <CommunityUsersPermissions id={id} type={type} />
    )}
  </ScrollModal>
)

export default PanelModal
