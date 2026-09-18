import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import PredictionFormPage from './pages/PredictionFormPage'
import ResultsPage from './pages/ResultsPage'
import HistoryPage from './pages/HistoryPage'
import RecommendationsPage from './pages/RecommendationsPage'
import ProfilePage from './pages/ProfilePage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/connexion" element={<LoginPage />} />
          <Route path="/inscription" element={<RegisterPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/tableau-de-bord" element={<DashboardPage />} />
            <Route path="/nouvelle-prediction" element={<PredictionFormPage />} />
            <Route path="/resultats" element={<ResultsPage />} />
            <Route path="/resultats/:id" element={<ResultsPage />} />
            <Route path="/historique" element={<HistoryPage />} />
            <Route path="/recommandations" element={<RecommendationsPage />} />
            <Route path="/profil" element={<ProfilePage />} />
          </Route>

          <Route path="/" element={<Navigate to="/tableau-de-bord" replace />} />
          <Route path="*" element={<Navigate to="/tableau-de-bord" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
