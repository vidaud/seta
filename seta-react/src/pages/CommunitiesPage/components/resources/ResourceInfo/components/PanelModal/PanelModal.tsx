import { Suspense, lazy } from 'react'
import { CgFileDocument } from 'react-icons/cg'

import ScrollModal from '~/components/ScrollModal/ScrollModal'

import type { ModalStateProps } from '~/types/lib-props'

const ChangeResourceRequests = lazy(() => import('../ChangeResourceRequests'))
const ResourceUsersPermissions = lazy(() => import('../ResourcePermissions'))

type Props = {
  title: string
  id: string
  panel: string | null
  type: string
} & ModalStateProps

const ResourcePanelModal = ({ title, id, panel, type, ...props }: Props) => (
  <ScrollModal title={title} icon={<CgFileDocument />} {...props}>
    {panel === 'change_requests' ? (
      <Suspense fallback={null}>
        <ChangeResourceRequests id={id} />
      </Suspense>
    ) : (
      <Suspense fallback={null}>
        <ResourceUsersPermissions id={id} type={type} />
      </Suspense>
    )}
  </ScrollModal>
)

export default ResourcePanelModal
