import CreateCommunity from '../../../components/Manage/Community/CreateCommunity/CreateCommunity'
import MyCommunityList from '../../../components/Manage/Community/MyCommunityList/MyCommunityList'
import { ScopeProvider } from '../../../contexts/scope-context'

const MyCommunityListPage = () => {
  return (
    <>
      <ScopeProvider>
        <CreateCommunity />
      </ScopeProvider>
      <ScopeProvider>
        <MyCommunityList />
      </ScopeProvider>
    </>
  )
}

export default MyCommunityListPage
