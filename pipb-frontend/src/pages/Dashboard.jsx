import DashboardMahasiswa from './DashboardMahasiswa'
import DashboardAdmin from './DashboardAdmin'
import DashboardContentManager from './DashboardContentManager'

function Dashboard({ onLogout }) {
  const user = JSON.parse(
    localStorage.getItem('user') || 'null'
  )

  if (user?.role === 'admin') {
    return (
      <DashboardAdmin
        onLogout={onLogout}
      />
    )
  }

  if (user?.role === 'content_manager') {
    return (
      <DashboardContentManager
        onLogout={onLogout}
      />
    )
  }

  return (
    <DashboardMahasiswa
      onLogout={onLogout}
    />
  )
}

export default Dashboard