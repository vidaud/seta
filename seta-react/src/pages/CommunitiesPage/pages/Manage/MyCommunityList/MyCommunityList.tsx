import CreateCommunity from '../../../components/Manage/Community/CreateCommunityModal/CreateCommunityModal'
import MyCommunityList from '../../../components/Manage/Community/MyCommunityList/MyCommunityList'

const MyCommunityListPage = () => {
  return (
    <div className="page">
      <CreateCommunity />
      <MyCommunityList />
    </div>
  )
}

export default MyCommunityListPage
