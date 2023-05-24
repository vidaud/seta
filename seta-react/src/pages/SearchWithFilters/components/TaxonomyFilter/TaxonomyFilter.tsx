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

const TaxonomyFilter = ({ data, selectedKeys, onSelectionChange }: Props) => {
  const onSelectionChangeHandler = (e: TreeSelectionParams) => {
    if (onSelectionChange !== undefined) {
      const keys = e.value as SelectionKeys

      onSelectionChange?.(keys)
    }
  }

  const disabled = !data?.length || !data[0].children?.length

  return (
    <Tree
      css={S.tree}
      className="text-sm"
      style={{ border: 'none' }}
      disabled={disabled}
      value={data}
      selectionMode="checkbox"
      selectionKeys={selectedKeys}
      onSelectionChange={onSelectionChangeHandler}
      propagateSelectionUp={false}
      propagateSelectionDown={false}
    />
  )
}

export default TaxonomyFilter
