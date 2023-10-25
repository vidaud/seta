import { createContext, useContext, useState } from 'react'

export interface TourContextValue {
  runTour?: boolean
  handleRunTour: (value: boolean) => void
  openTour: (e: React.MouseEvent<HTMLElement>) => void
  closeTour: () => void
}

export const TourContext = createContext<TourContextValue | undefined>(undefined)

export const TourProvider = ({ children }) => {
  const [runTour, setRunTour] = useState(false)

  const openTour = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    setRunTour(true)
  }

  const closeTour = () => {
    setRunTour(false)
  }

  const handleRunTour = value => {
    setRunTour(value)
  }

  const values: TourContextValue | undefined = {
    runTour: runTour,
    handleRunTour: handleRunTour,
    openTour: openTour,
    closeTour: closeTour
  }

  return <TourContext.Provider value={values}>{children}</TourContext.Provider>
}

export const useTourContext = () => {
  const context = useContext(TourContext)

  if (context === undefined) {
    throw new Error('useTourContext must be used within a TourProvider')
  }

  return context
}
