import { CommunityListProvider } from './CommunityList.context'

import CommunityList from '../../../components/Discovery/CommunityList/CommunityList'
import './style.css'

const CommunityListPage = () => {
  return (
    <>
      <CommunityListProvider>
        <CommunityList />
      </CommunityListProvider>
    </>
  )
}

export default CommunityListPage
