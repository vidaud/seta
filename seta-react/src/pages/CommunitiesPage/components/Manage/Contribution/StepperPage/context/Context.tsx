import { createContext, useState } from 'react'

import type { EmbeddingsResponse } from '~/api/embeddings/embedding'

type ContributionContextProps = {
  files: File[]
  formData: {
    name: string
    email: string
    phone: string
    title: string
    link_origin: string
  }
  textUpload: string
  date: Date | null
  language: string | null
  handleFormDataChange: (event) => void
  handleTextInput: (text: string) => void
  handleDateChange: (text: any) => void
  handleDocumentSelect: (index: File[]) => void
  handleLanguageChange: (text: any) => void
  handleMimeTypeChange?: (event) => void
}

export const Context = createContext<any | undefined>(undefined)

export const ContextProvider = ({ children }) => {
  const [files, setFiles] = useState<File[]>([])
  const today = new Date()
  const [textUpload, setTextUpload] = useState('')
  const [date, setDate] = useState<Date | null>(today)
  const [language, setLanguage] = useState<string | null>('english')
  const [mimType, setMimeType] = useState<string | null>(null)
  const [taxonomy, setTaxonomy] = useState<string | null>('english')
  const [embeddings, setEmbeddings] = useState<EmbeddingsResponse | undefined>()
  const [formData, setFormData] = useState({
    language: language,
    taxonomy: taxonomy,
    title: '',
    link_origin: '',
    date: today,
    author: '',
    abstract: '',
    collection: '',
    mime_type: '',
    reference: '',
    text: '',
    sbert_embedding: embeddings,
    sbert_embedding_list: [embeddings],
    other: null
  })

  const handleFormDataChange = event => {
    setFormData(prevFormData => {
      return {
        ...prevFormData,
        [event.target.name]: event.target.value
      }
    })
  }

  const handleDocumentSelect = index => {
    setFiles(index)
  }

  const handleTextInput = text => {
    setTextUpload(text.target.value)
  }

  const handleDateChange = text => {
    setDate(text)
    setFormData(prevFormData => {
      return {
        ...prevFormData,
        date: text
      }
    })
  }

  const handleLanguageChange = text => {
    setLanguage(text)
    setFormData(prevFormData => {
      return {
        ...prevFormData,
        language: text
      }
    })
  }

  const handleTaxonomyChange = text => {
    setTaxonomy(text)
    setFormData(prevFormData => {
      return {
        ...prevFormData,
        taxonomy: text
      }
    })
  }

  const handleMimeTypeChange = text => {
    setMimeType(text)
    setFormData(prevFormData => {
      return {
        ...prevFormData,
        mime_type: text
      }
    })
  }

  const data = {
    files: files,
    formData: formData,
    textUpload: textUpload,
    date: date,
    language: language,
    taxonomy: taxonomy,
    embeddings: embeddings,
    setEmbeddings: setEmbeddings,
    mimType: mimType,
    handleLanguageChange: handleLanguageChange,
    handleTaxonomyChange: handleTaxonomyChange,
    handleFormDataChange: handleFormDataChange,
    handleTextInput: handleTextInput,
    handleDateChange: handleDateChange,
    handleDocumentSelect: handleDocumentSelect,
    handleMimeTypeChange: handleMimeTypeChange
  }

  return <Context.Provider value={data}>{children}</Context.Provider>
}
