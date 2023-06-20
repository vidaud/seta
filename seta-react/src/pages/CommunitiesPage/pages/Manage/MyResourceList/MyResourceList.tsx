import MyResourceList from '../../../components/Manage/Resource/MyResourceList/MyResourceList'
import { ScopeProvider } from '../../../contexts/scope-context'

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
