import { ScrollArea } from '@mantine/core'

import ApiLoader from '~/pages/Admin/common/components/Loader/ApiLoader'
import { SuggestionsEmpty, SuggestionsError } from '~/pages/SearchPageNew/components/common'

import { useApplicationsPermissions } from '~/api/user/applications-permissions'

import AppPerms from './components/AppPerms/AppPerms'
import { ApplicationProvider } from './contexts/application-context'

const ApplicationsPermissions = ({ appName }) => {
  const { data, isLoading, error, refetch } = useApplicationsPermissions(appName)

  if (error) {
    return <SuggestionsError subject="scopes catalogue" onTryAgain={refetch} />
  }

  if (isLoading) {
    return <ApiLoader />
  }

  if (!data || data.length === 0) {
    return <SuggestionsEmpty message={`No scope for ${appName} application!`} />
  }

  return (
    <ScrollArea h={320} type="auto" offsetScrollbars>
      <ApplicationProvider>
        <AppPerms scopes={data} appName={appName} />
      </ApplicationProvider>
    </ScrollArea>
  )
}

export default ApplicationsPermissions
