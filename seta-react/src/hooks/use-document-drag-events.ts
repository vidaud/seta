import { useEffect, useRef } from 'react'

type Props = {
  onDragOver?: (event: DragEvent) => void
  onDragLeave?: (event: DragEvent) => void
  onDragEnd?: (event: DragEvent) => void
  disabled?: boolean
}

const useDocumentDragEvents = ({ onDragOver, onDragLeave, onDragEnd, disabled }: Props) => {
  const dragOverRef = useRef(onDragOver)
  const dragLeaveRef = useRef(onDragLeave)
  const dragEndRef = useRef(onDragEnd)

  const dragLeaveTimeoutRef = useRef<number>()

  useEffect(() => {
    if (disabled) {
      return
    }

    const dragOverHandler = dragOverRef.current
    const dragLeaveHandler = dragLeaveRef.current
    const dragEndHandler = dragEndRef.current

    const handleDragOver = (event: DragEvent) => {
      if (!dragOverHandler) {
        return
      }

      event.preventDefault()

      if (dragLeaveTimeoutRef.current) {
        clearTimeout(dragLeaveTimeoutRef.current)
      }

      dragOverHandler(event)
    }

    const handleDragLeave = (event: DragEvent) => {
      if (!dragLeaveHandler) {
        return
      }

      event.preventDefault()

      if (dragLeaveTimeoutRef.current) {
        clearTimeout(dragLeaveTimeoutRef.current)
      }

      dragLeaveTimeoutRef.current = setTimeout(() => dragLeaveHandler(event), 100)
    }

    const handleDragEnd = (event: DragEvent) => {
      if (!dragEndHandler) {
        return
      }

      event.preventDefault()

      if (dragLeaveTimeoutRef.current) {
        clearTimeout(dragLeaveTimeoutRef.current)
      }

      dragEndHandler(event)
    }

    const target = window

    if (dragOverHandler) {
      target.addEventListener('dragover', handleDragOver)
    }

    if (dragLeaveHandler) {
      target.addEventListener('dragleave', handleDragLeave)
    }

    if (dragEndHandler) {
      target?.addEventListener('dragend', handleDragEnd)
    }

    return () => {
      if (dragOverHandler) {
        target.removeEventListener('dragover', handleDragOver)
      }

      if (dragLeaveHandler) {
        target.removeEventListener('dragleave', handleDragLeave)
      }

      if (dragEndHandler) {
        target.removeEventListener('dragend', handleDragEnd)
      }

      if (dragLeaveTimeoutRef.current) {
        clearTimeout(dragLeaveTimeoutRef.current)
      }
    }
  }, [disabled])
}

export default useDocumentDragEvents
