import CommunityList from './components/communities/CommunityList'
import { CommunityListProvider } from './contexts/community-list.context'

const CommunitiesPage = () => {
  return (
    <CommunityListProvider>
      <CommunityList />
    </CommunityListProvider>
  )
}

export default CommunitiesPage
