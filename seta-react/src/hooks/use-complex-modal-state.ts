import { useState } from 'react'

const useComplexModalState = <T>(initialState?: T, initialOpen = false) => {
  const [open, setOpen] = useState(initialOpen)
  const [modalState, setModalState] = useState<T | undefined>(initialState)

  const openModal = (state?: T) => {
    setOpen(true)
    setModalState(state)
  }

  const closeModal = () => {
    setOpen(false)

    // Wait for the modal close animation to finish before resetting the state
    setTimeout(() => {
      setModalState(undefined)
    }, 300)
  }

  return { open, modalState, openModal, closeModal }
}

export default useComplexModalState
