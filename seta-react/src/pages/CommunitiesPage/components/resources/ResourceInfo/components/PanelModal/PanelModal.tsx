import { CgFileDocument } from 'react-icons/cg'

import ScrollModal from '~/components/ScrollModal/ScrollModal'

import type { ModalStateProps } from '~/types/lib-props'

import ChangeResourceRequests from '../ChangeResourceRequests'
import ResourceUsersPermissions from '../ResourcePermissions/ResourceUserPermissions'

type Props = {
  title: string
  id: string
  panel: string | null
  type: string
} & ModalStateProps

const ResourcePanelModal = ({ title, id, panel, type, ...props }: Props) => (
  <ScrollModal title={title} icon={<CgFileDocument />} {...props}>
    {panel === 'change_requests' ? (
      <ChangeResourceRequests id={id} />
    ) : (
      <ResourceUsersPermissions id={id} type={type} />
    )}
  </ScrollModal>
)

export default ResourcePanelModal
