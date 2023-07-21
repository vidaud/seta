import { useAdminStatsLight } from '~/api/admin/menu-stats'

import StatsGrid from './components/StatsGrid'

const AdminDashboard = () => {
  const { data, isLoading, error, refetch } = useAdminStatsLight()

  return <StatsGrid data={data} isLoading={isLoading} error={error} onTryAgain={refetch} />
}

export default AdminDashboard
