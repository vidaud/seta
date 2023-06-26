import ResourceList from '../../resources/ResourceList/ResourceList'
import { CommunityListProvider } from '../CommunityList/CommunityList.context'
import './style.css'

const ResourceListPage = () => {
  // const data = useCommunities()

  return (
    <>
      <CommunityListProvider>
        <ResourceList />
      </CommunityListProvider>
    </>
  )
}

export default ResourceListPage
