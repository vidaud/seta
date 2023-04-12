import { useState, useEffect } from 'react'
import parse from 'html-react-parser'
import { BreadCrumb } from 'primereact/breadcrumb'
import { ScrollTop } from 'primereact/scrolltop'
import { Tree } from 'primereact/tree'

import { FaqsService } from '../../services/FaqsService'
import './style.css'

const FaqsPage = () => {
  const [nodes, setNodes] = useState<any>()
  const nodeService = new FaqsService()

  const breadCrumbsItems = [{ label: 'Faqs', url: '/faqs' }]

  const home = { icon: 'pi pi-home', url: '/seta-ui' }

  const expandNode = (node, _expandedKeys) => {
    if (node.children && node.children.length) {
      _expandedKeys[node.key] = true

      for (const child of node.children) {
        expandNode(child, _expandedKeys)
      }
    }
  }

  useEffect(() => {
    const nodeData = nodeService.getTreeNodes()

    setNodes(nodeData)
  }, [])

  const nodeTemplate = (node, options) => {
    const data = parse(node.data)

    return <span style={{ textAlign: 'justify' }}>{data}</span>
  }

  return (
    <>
      <BreadCrumb model={breadCrumbsItems} home={home} />
      <div className="page">
        <h1 className="headerH">FAQs</h1>
        <div className="card">
          <ScrollTop />
          <div className="col-10">
            <Tree
              className="p-fixedTree, p-fixedTreenode-children"
              value={nodes}
              nodeTemplate={nodeTemplate}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default FaqsPage
