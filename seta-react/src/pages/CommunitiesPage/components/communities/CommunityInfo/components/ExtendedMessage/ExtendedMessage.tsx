import useModalState from '~/hooks/use-modal-state'

import MessageModal from '../MessageModal/MessageModal'

const ExtendedMessage = ({ id, message, title, type }) => {
  const { modalOpen, openModal, closeModal } = useModalState()

  return (
    <>
      <span onClick={openModal}>{message}</span>
      <MessageModal
        id={id}
        title={title}
        type={type}
        message={message}
        opened={modalOpen}
        onClose={closeModal}
      />
    </>
  )
}

export default ExtendedMessage
