import CreateCommunity from '../../../components/Manage/CreateCommunityModal/CreateCommunityModal'
import MyCommunityList from '../../../components/Manage/MyCommunityList/MyCommunityList'

const MyCommunityListPage = () => {
  return (
    <div className="page">
      <CreateCommunity />
      <MyCommunityList />
    </div>
  )
}

export default MyCommunityListPage
