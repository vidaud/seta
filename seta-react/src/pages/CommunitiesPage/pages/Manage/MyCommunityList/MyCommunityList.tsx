import CreateCommunity from '../../../components/Manage/Community/CreateCommunityButton/CreateCommunityButton'
import MyCommunityList from '../../../components/Manage/Community/MyCommunityList/MyCommunityList'
import { ScopeProvider } from '../../../components/Manage/scope-context'

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
