import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Layout from './Layout'

export default function ProtectedRoute() {
  const { utilisateur, chargement } = useAuth()

  if (chargement) {
    return (
      <div className="h-screen flex items-center justify-center text-grismoyen">
        Chargement…
      </div>
    )
  }

  if (!utilisateur) {
    return <Navigate to="/connexion" replace />
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  )
}
