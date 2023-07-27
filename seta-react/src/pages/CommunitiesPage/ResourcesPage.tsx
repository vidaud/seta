import ResourceList from './components/resources/ResourceList'
import { CommunityListProvider } from './contexts/community-list.context'

const ResourcesPage = () => {
  return (
    <CommunityListProvider>
      <ResourceList />
    </CommunityListProvider>
  )
}

export default ResourcesPage
