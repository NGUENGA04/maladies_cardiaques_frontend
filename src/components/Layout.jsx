import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Activity,
  History,
  HeartPulse,
  User,
  LogOut,
  Bell,
} from 'lucide-react'
import Logo from './Logo'
import { useAuth } from '../context/AuthContext'

const LIENS_MENU = [
  { to: '/tableau-de-bord', label: 'Tableau de bord', icone: LayoutDashboard },
  { to: '/nouvelle-prediction', label: 'Nouvelle prédiction', icone: Activity },
  { to: '/historique', label: 'Historique', icone: History },
  { to: '/recommandations', label: 'Recommandations', icone: HeartPulse },
  { to: '/profil', label: 'Profil', icone: User },
]

export default function Layout({ children }) {
  const { utilisateur, deconnecter } = useAuth()
  const navigate = useNavigate()

  function handleDeconnexion() {
    deconnecter()
    navigate('/connexion')
  }

  return (
    <div className="min-h-screen flex bg-grisclair">
      <aside className="hidden md:flex md:flex-col w-64 bg-white border-r border-grisclair px-4 py-6 shrink-0">
        <div className="px-2 mb-8">
          <Logo taille={36} />
        </div>
        <nav className="flex-1 space-y-1">
          {LIENS_MENU.map(({ to, label, icone: Icone }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-grisfonce hover:bg-primary-light hover:text-primary'
                }`
              }
            >
              <Icone size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
        <button
          onClick={handleDeconnexion}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
        >
          <LogOut size={18} />
          Déconnexion
        </button>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-grisclair flex items-center justify-between px-4 md:px-8 shrink-0">
          <div className="md:hidden">
            <Logo taille={30} avecTexte={false} />
          </div>
          <div className="hidden md:block text-sm text-grismoyen">
            Bienvenue sur votre espace CardioZen
          </div>
          <div className="flex items-center gap-4">
            <button
              className="relative p-2 rounded-full hover:bg-grisclair text-grisfonce"
              aria-label="Notifications"
            >
              <Bell size={20} />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-semibold text-sm">
                {utilisateur?.prenom?.[0]}
                {utilisateur?.nom?.[0]}
              </div>
              <div className="hidden sm:block leading-tight">
                <div className="text-sm font-medium text-grisfonce">
                  {utilisateur?.prenom} {utilisateur?.nom}
                </div>
                <div className="text-xs text-grismoyen capitalize">{utilisateur?.role}</div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">{children}</main>

        <nav className="md:hidden bg-white border-t border-grisclair flex justify-around py-2">
          {LIENS_MENU.map(({ to, icone: Icone }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `p-2 rounded-lg ${isActive ? 'text-primary' : 'text-grismoyen'}`
              }
            >
              <Icone size={22} />
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  )
}
