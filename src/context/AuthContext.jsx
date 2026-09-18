import { createContext, useContext, useEffect, useState } from 'react'
import * as api from '../api/services'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [utilisateur, setUtilisateur] = useState(() => {
    const stocke = localStorage.getItem('cardiozen_user')
    return stocke ? JSON.parse(stocke) : null
  })
  const [chargement, setChargement] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('cardiozen_token')
    if (!token) {
      setChargement(false)
      return
    }
    api
      .obtenirProfil()
      .then((profil) => {
        setUtilisateur(profil)
        localStorage.setItem('cardiozen_user', JSON.stringify(profil))
      })
      .catch(() => {
        localStorage.removeItem('cardiozen_token')
        localStorage.removeItem('cardiozen_user')
        setUtilisateur(null)
      })
      .finally(() => setChargement(false))
  }, [])

  function enregistrerSession(reponse) {
    localStorage.setItem('cardiozen_token', reponse.access_token)
    localStorage.setItem('cardiozen_user', JSON.stringify(reponse.utilisateur))
    setUtilisateur(reponse.utilisateur)
  }

  async function connecter(email, mot_de_passe) {
    const reponse = await api.connecter({ email, mot_de_passe })
    enregistrerSession(reponse)
  }

  async function inscrire(donnees) {
    const reponse = await api.inscrire(donnees)
    enregistrerSession(reponse)
  }

  function deconnecter() {
    localStorage.removeItem('cardiozen_token')
    localStorage.removeItem('cardiozen_user')
    setUtilisateur(null)
  }

  function mettreAJourUtilisateur(profil) {
    setUtilisateur(profil)
    localStorage.setItem('cardiozen_user', JSON.stringify(profil))
  }

  return (
    <AuthContext.Provider
      value={{ utilisateur, chargement, connecter, inscrire, deconnecter, mettreAJourUtilisateur }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const contexte = useContext(AuthContext)
  if (!contexte) {
    throw new Error('useAuth doit être utilisé à l’intérieur de AuthProvider')
  }
  return contexte
}
