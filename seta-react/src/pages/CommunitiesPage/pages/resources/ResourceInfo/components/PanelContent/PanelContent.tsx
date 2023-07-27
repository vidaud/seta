import { useEffect } from 'react'
import { Box } from '@mantine/core'

import type { ResourceChangeRequests } from '~/api/types/change-request-types'

import { useResourcesChangeRequests } from '../../../../../../../api/communities/resource-change-requests'
import useModalState from '../../../../../../../hooks/use-modal-state'
import InfoContainer from '../../../../../../SearchPageNew/components/documents/DocumentInfo/components/InfoContainer/InfoContainer'
import ChangeResourceRequests from '../ChangeResourceRequests/ChangeResourceRequests'
import ResourcePanelModal from '../PanelModal/PanelModal'
import ResourceUsersPermissions from '../ResourcePermissions/ResourceUserPermissions'

type Props = {
  id: string
  panel: string | null
  onChange: (value: ResourceChangeRequests[]) => void
}

const ResourcePanelContent = ({ id, panel, onChange }: Props) => {
  const { modalOpen, openModal, closeModal } = useModalState()
  const { data } = useResourcesChangeRequests(id)

  useEffect(() => {
    if (data) {
      onChange(data)
    }
  }, [data, onChange])

  const title = panel === 'change_requests' ? 'Change Requests' : 'User Permissions'

  return (
    <>
      <InfoContainer expandable expandTitle={`Expand ${title.toLowerCase()}`} onExpand={openModal}>
        <Box sx={{ paddingTop: ' 4%' }}>
          {panel === 'change_requests' ? (
            <ChangeResourceRequests id={id} />
          ) : (
            <ResourceUsersPermissions id={id} type="container" />
          )}
        </Box>
      </InfoContainer>

      <ResourcePanelModal
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

export default ResourcePanelContent