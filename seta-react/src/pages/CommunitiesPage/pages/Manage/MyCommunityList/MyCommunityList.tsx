import tableAttributes from '../../../components/Discovery/CommunityList/tableAttributes.json'
import CreateCommunity from '../../../components/Manage/CreateCommunityModal/CreateCommunityModal'
import MyCommunityList from '../../../components/Manage/MyCommunityList/MyCommunityList'

const MyCommunityListPage = () => {
  return (
    <div className="page">
      <CreateCommunity />
      <MyCommunityList data={tableAttributes.props.data} />
    </div>
  )
}

export default MyCommunityListPage
