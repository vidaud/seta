import { CommunityListProvider } from './CommunityList.context'

import CommunityList from '../../communities/CommunityList/CommunityList'

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
