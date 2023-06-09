import MyResourceList from '../../../components/Manage/Resource/MyResourceList/MyResourceList'
import { ScopeProvider } from '../../../components/Manage/scope-context'

const MyResourceListPage = () => {
  return (
    <>
      <ScopeProvider>
        <MyResourceList />
      </ScopeProvider>
    </>
  )
}

export default MyResourceListPage
