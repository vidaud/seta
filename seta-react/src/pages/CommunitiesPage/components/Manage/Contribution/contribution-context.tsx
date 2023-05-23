import { createContext, useContext, useState } from 'react'

import type { ChildrenProp } from '~/types/children-props'

export type ContributionValues = {
  resource_id: string
  user_id: string
  file_name: string
  file_size: string
  metadata: MetadataValues
  uploaded_at: string
}

export type MetadataValues = {
  language: string
  data: number
  title: string
  link_origin: string
  uploaded_at: string
  author?: string
  abstract?: string
  collection?: string
  mime_type?: string
  reference?: string
  text?: string
  other?: OtherValues[]
}

export type OtherValues = {
  field_name: string
  field_value: string
}

type ContributionContextProps = {
  formData: ContributionValues
  setFormData: (value: ContributionValues) => void
}

const ContributionContext = createContext<any | undefined>(undefined)

export const ContributionProvider = ({ children }: ChildrenProp) => {
  const [files, setFiles] = useState<File[]>([])
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' })
  const [plan, setPlan] = useState(1)
  const [monthly, setMonthly] = useState(true)
  const [addOns, setAddOns] = useState<any>([])

  const getTotal = () => {
    let total = 0

    // if seleted is monthly plan
    if (monthly) {
      if (plan === 1) {
        total += 9

        if (addOns.includes(1)) {
          total += 1
        }

        if (addOns.includes(2)) {
          total += 2
        }

        if (addOns.includes(3)) {
          total += 2
        }
      } else if (plan === 2) {
        total += 12

        if (addOns.includes(1)) {
          total += 1
        }

        if (addOns.includes(2)) {
          total += 2
        }

        if (addOns.includes(3)) {
          total += 2
        }
      } else {
        total += 15

        if (addOns.includes(1)) {
          total += 1
        }

        if (addOns.includes(2)) {
          total += 2
        }

        if (addOns.includes(3)) {
          total += 2
        }
      }
    }
    // if seleted is yearly plan
    else {
      if (plan === 1) {
        total += 19

        if (addOns.includes(1)) {
          total += 10
        }

        if (addOns.includes(2)) {
          total += 12
        }

        if (addOns.includes(3)) {
          total += 12
        }
      } else if (plan === 2) {
        total += 120

        if (addOns.includes(1)) {
          total += 10
        }

        if (addOns.includes(2)) {
          total += 12
        }

        if (addOns.includes(3)) {
          total += 12
        }
      } else {
        total += 150

        if (addOns.includes(1)) {
          total += 10
        }

        if (addOns.includes(2)) {
          total += 12
        }

        if (addOns.includes(3)) {
          total += 12
        }
      }
    }

    return total
  }

  const handleFormDataChange = event => {
    const { name, value } = event.target

    setFormData({ ...formData, [name]: value })
  }

  const handleDocumentSelect = index => {
    setFiles(index)
  }

  const handlePlanSelect = index => {
    setPlan(index)
  }

  const togglePlanTimeChange = () => {
    setMonthly(!monthly)
  }

  const handleAddOns = index => {
    if (!addOns.some(addOn => addOn === index)) {
      const obj = [...addOns, index]

      setAddOns(obj)
    } else {
      const obj = addOns.filter(addOns => addOns !== index)

      setAddOns(obj)
    }
  }

  const data = {
    files: files,
    formData: formData,
    plan: plan,
    monthly: monthly,
    addOns: addOns,
    handleFormDataChange: handleFormDataChange,
    handlePlanSelect: handlePlanSelect,
    handleDocumentSelect: handleDocumentSelect,
    togglePlanTimeChange: togglePlanTimeChange,
    handleAddOns: handleAddOns,
    getTotal: getTotal
  }

  return <ContributionContext.Provider value={data}>{children}</ContributionContext.Provider>
}

export const useContribution = () => {
  const context = useContext(ContributionContext)

  if (context === undefined) {
    throw new Error('useContribution must be used within a ContributionProvider')
  }

  return context
}
