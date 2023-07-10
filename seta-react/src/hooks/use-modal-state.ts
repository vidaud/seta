import { useState } from 'react'

const useModalState = (initialOpen = false) => {
  const [modalOpen, setModalOpen] = useState(initialOpen)

  const openModal = () => setModalOpen(true)
  const closeModal = () => setModalOpen(false)

  return { modalOpen, openModal, closeModal }
}

export default useModalState
