import { Tree } from 'primereact/tree'
import type { TreeSelectionParams } from 'primereact/tree'
import type TreeNode from 'primereact/treenode'

import * as S from '../../custom/tree-styles'
import type { SelectionKeys } from '../../types/filters'

type Props = {
  data?: TreeNode[]
  selectedKeys?: SelectionKeys | null
  onSelectionChange?(keys: SelectionKeys): void
}

const DataSourceFilter = ({ data, selectedKeys, onSelectionChange }: Props) => {
  const onSelectionChangeHandler = (e: TreeSelectionParams) => {
    if (onSelectionChange !== undefined) {
      const keys = e.value as SelectionKeys

      onSelectionChange?.(keys)
    }
  }
  const disabled = data === undefined || data[0].children === undefined

  return (
    <Tree
      css={S.tree}
      style={{ border: 'none' }}
      disabled={disabled}
      value={data}
      selectionMode="checkbox"
      selectionKeys={selectedKeys}
      onSelectionChange={onSelectionChangeHandler}
      className="text-sm"
      propagateSelectionUp={false}
      propagateSelectionDown={false}
    />
  )
}

export default DataSourceFilter