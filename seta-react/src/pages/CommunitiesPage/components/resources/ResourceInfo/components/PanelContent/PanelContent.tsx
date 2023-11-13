import { useEffect, useState } from 'react'
import { Box } from '@mantine/core'

import InfoContainer from '~/pages/SearchPageNew/components/documents/DocumentInfo/components/InfoContainer'

import useModalState from '~/hooks/use-modal-state'

import ChangeResourceRequests from '../ChangeResourceRequests'
import ResourcePanelModal from '../PanelModal'
import ResourceUsersPermissions from '../ResourcePermissions/ResourceUserPermissions'

type Props = {
  id: string
  panel: string | null
  scopes?: string[]
}

const ResourcePanelContent = ({ id, panel, scopes }: Props) => {
  const { modalOpen, openModal, closeModal } = useModalState()
  const [title, setTitle] = useState('Limits')

  useEffect(() => {
    if (panel) {
      setTitle(panel === 'change_requests' ? 'Change Requests' : 'User Permissions')
    }
  }, [panel, title])

  return (
    <>
      <InfoContainer expandable expandTitle={`Expand ${title.toLowerCase()}`} onExpand={openModal}>
        <Box>
          {panel === 'change_requests' ? (
            <ChangeResourceRequests id={id} />
          ) : panel === 'permissions' ? (
            <ResourceUsersPermissions id={id} type="container" scopes={scopes} />
          ) : null}
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
