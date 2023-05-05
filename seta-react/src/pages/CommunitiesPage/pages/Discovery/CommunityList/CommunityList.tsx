import CommunityList from '../../../components/Discovery/CommunityList/CommunityList'
import tableAttributes from '../../../components/Discovery/CommunityList/tableAttributes.json'
import './style.css'

const CommunityListPage = () => {
  return (
    <div className="page">
      <CommunityList data={tableAttributes.props.data} />
    </div>
  )
}

export default CommunityListPage
