import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, User, UserPlus } from 'lucide-react'
import Logo from '../components/Logo'
import { useAuth } from '../context/AuthContext'

const styleInput =
  'w-full border border-grismoyen/50 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary bg-white'

export default function RegisterPage() {
  const { inscrire } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    prenom: '',
    nom: '',
    email: '',
    mot_de_passe: '',
    sexe: '',
    date_naissance: '',
    taille_cm: '',
    poids_kg: '',
  })
  const [erreur, setErreur] = useState('')
  const [envoiEnCours, setEnvoiEnCours] = useState(false)

  function majChamp(champ, valeur) {
    setForm((f) => ({ ...f, [champ]: valeur }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErreur('')
    setEnvoiEnCours(true)
    try {
      const donnees = {
        ...form,
        taille_cm: Number(form.taille_cm),
        poids_kg: Number(form.poids_kg),
      }
      await inscrire(donnees)
      navigate('/tableau-de-bord')
    } catch (err) {
      setErreur(
        err.response?.data?.detail || "Impossible de créer le compte. Réessayez."
      )
    } finally {
      setEnvoiEnCours(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-grisclair p-4 py-10">
      <div className="w-full max-w-lg bg-white rounded-xl2 shadow-card p-8 md:p-10">
        <Logo taille={44} />

        <h1 className="mt-8 text-2xl font-semibold text-grisfonce">Créer un compte</h1>
        <p className="text-sm text-grismoyen mt-1">
          Rejoignez CardioZen pour évaluer votre risque cardiovasculaire. Ces informations
          personnelles seront réutilisées automatiquement lors de vos analyses — vous pourrez
          les modifier plus tard depuis votre profil.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-grisfonce">Prénom</label>
              <div className="mt-1 flex items-center gap-2 border border-grismoyen/50 rounded-lg px-3 py-2.5 focus-within:border-primary">
                <User size={16} className="text-grismoyen" />
                <input
                  required
                  value={form.prenom}
                  onChange={(e) => majChamp('prenom', e.target.value)}
                  className="w-full outline-none text-sm"
                  placeholder="Jean"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-grisfonce">Nom</label>
              <div className="mt-1 flex items-center gap-2 border border-grismoyen/50 rounded-lg px-3 py-2.5 focus-within:border-primary">
                <input
                  required
                  value={form.nom}
                  onChange={(e) => majChamp('nom', e.target.value)}
                  className="w-full outline-none text-sm"
                  placeholder="Dupont"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-grisfonce">Adresse e-mail</label>
            <div className="mt-1 flex items-center gap-2 border border-grismoyen/50 rounded-lg px-3 py-2.5 focus-within:border-primary">
              <Mail size={18} className="text-grismoyen" />
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => majChamp('email', e.target.value)}
                className="w-full outline-none text-sm"
                placeholder="jean.dupont@example.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-grisfonce">Sexe</label>
              <select
                required
                value={form.sexe}
                onChange={(e) => majChamp('sexe', e.target.value)}
                className={`${styleInput} mt-1`}
              >
                <option value="">Sélectionnez</option>
                <option value="Homme">Homme</option>
                <option value="Femme">Femme</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-grisfonce">Date de naissance</label>
              <input
                type="date"
                required
                value={form.date_naissance}
                onChange={(e) => majChamp('date_naissance', e.target.value)}
                className={`${styleInput} mt-1`}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-grisfonce">Taille (cm)</label>
              <input
                type="number"
                required
                min={130}
                max={210}
                placeholder="Ex : 175"
                value={form.taille_cm}
                onChange={(e) => majChamp('taille_cm', e.target.value)}
                className={`${styleInput} mt-1`}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-grisfonce">Poids (kg)</label>
              <input
                type="number"
                required
                min={30}
                max={200}
                placeholder="Ex : 70"
                value={form.poids_kg}
                onChange={(e) => majChamp('poids_kg', e.target.value)}
                className={`${styleInput} mt-1`}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-grisfonce">Mot de passe</label>
            <div className="mt-1 flex items-center gap-2 border border-grismoyen/50 rounded-lg px-3 py-2.5 focus-within:border-primary">
              <Lock size={18} className="text-grismoyen" />
              <input
                type="password"
                required
                minLength={6}
                value={form.mot_de_passe}
                onChange={(e) => majChamp('mot_de_passe', e.target.value)}
                className="w-full outline-none text-sm"
                placeholder="6 caractères minimum"
              />
            </div>
          </div>

          {erreur && (
            <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{erreur}</p>
          )}

          <button
            type="submit"
            disabled={envoiEnCours}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-secondary text-white font-medium py-2.5 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            <UserPlus size={18} />
            {envoiEnCours ? 'Création…' : 'Créer mon compte'}
          </button>

          <p className="text-center text-sm text-grismoyen">
            Déjà inscrit ?{' '}
            <Link to="/connexion" className="text-primary font-medium">
              Se connecter
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
