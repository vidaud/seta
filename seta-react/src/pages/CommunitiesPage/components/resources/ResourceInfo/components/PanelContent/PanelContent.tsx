import { useEffect } from 'react'
import { Box } from '@mantine/core'

import InfoContainer from '~/pages/SearchPageNew/components/documents/DocumentInfo/components/InfoContainer'

import { useResourcesChangeRequests } from '~/api/communities/resources/resource-change-requests'
import type { ResourceChangeRequests } from '~/api/types/change-request-types'
import useModalState from '~/hooks/use-modal-state'

import ChangeResourceRequests from '../ChangeResourceRequests'
import ResourcePanelModal from '../PanelModal'
import ResourceUsersPermissions from '../ResourcePermissions'

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
