import { useRef } from 'react'
import { Container } from '@mantine/core'

import AddItem from './AddItem'
import ItemList from './ItemList'

import { OtherItemStatus } from '../../types/other-filter'
import type { OtherItem } from '../../types/other-filter'

type Props = {
  data?: OtherItem[]
  onItemChange?(type: string, item: OtherItem): void
}

const OtherFilter = ({ data, onItemChange }: Props) => {
  const uid = useRef(0)

  const generateUid = (): string => {
    uid.current++

    return uid.current + ''
  }

  const handleAddItem = (name: string, value: string): void => {
    const item = data?.find(
      i =>
        i.name.toLowerCase() === name.toLowerCase() && i.value.toLowerCase() === value.toLowerCase()
    )

    if (item) {
      //re-instate the applied status fpr existing item
      if (item.status === OtherItemStatus.DELETED) {
        onItemChange?.('updated', { ...item, status: OtherItemStatus.APPLIED })

        return
      }

      throw Error('It already exists!')
    }

    onItemChange?.('added', {
      id: generateUid(),
      name: name,
      value: value,
      status: OtherItemStatus.NEW
    })
  }

  const handleDeleteItem = (item: OtherItem): void => {
    onItemChange?.('deleted', item)
  }

  return (
    <Container fluid>
      <ItemList data={data} onDeleteItem={handleDeleteItem} />
      <AddItem onAddItem={handleAddItem} />
    </Container>
  )
}

export default OtherFilter
