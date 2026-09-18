import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, User, UserPlus, ArrowLeft, ArrowRight, Check } from 'lucide-react'
import Logo from '../components/Logo'
import { useAuth } from '../context/AuthContext'

const styleInput =
  'w-full border border-grismoyen/50 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary bg-white'

const ETAPES = [
  { titre: 'Identité', description: 'Comment devons-nous vous appeler ?' },
  { titre: 'Compte', description: "Vos identifiants de connexion" },
  { titre: 'Informations personnelles', description: 'Utilisées pour vos analyses' },
]

export default function RegisterPage() {
  const { inscrire } = useAuth()
  const navigate = useNavigate()
  const [etape, setEtape] = useState(0)
  const [form, setForm] = useState({
    prenom: '',
    nom: '',
    email: '',
    mot_de_passe: '',
    sexe: '',
    date_naissance: '',
    taille_cm: '',
  })
  const [erreur, setErreur] = useState('')
  const [envoiEnCours, setEnvoiEnCours] = useState(false)

  function majChamp(champ, valeur) {
    setForm((f) => ({ ...f, [champ]: valeur }))
  }

  function etapeValide() {
    if (etape === 0) return form.prenom.trim() && form.nom.trim()
    if (etape === 1) return form.email.trim() && form.mot_de_passe.length >= 6
    return form.sexe && form.date_naissance && form.taille_cm
  }

  function suivant() {
    if (!etapeValide()) {
      setErreur('Veuillez compléter tous les champs de cette étape.')
      return
    }
    setErreur('')
    setEtape((e) => Math.min(e + 1, ETAPES.length - 1))
  }

  function precedent() {
    setErreur('')
    setEtape((e) => Math.max(e - 1, 0))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!etapeValide()) {
      setErreur('Veuillez compléter tous les champs de cette étape.')
      return
    }
    setErreur('')
    setEnvoiEnCours(true)
    try {
      const donnees = {
        ...form,
        email: form.email.trim().toLowerCase(),
        taille_cm: Number(form.taille_cm),
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
          Rejoignez CardioZen pour évaluer votre risque cardiovasculaire.
        </p>

        {/* Indicateur d'étapes */}
        <div className="flex items-center gap-2 mt-6">
          {ETAPES.map((e, i) => (
            <div key={e.titre} className="flex items-center flex-1 last:flex-none">
              <div
                className={`w-7 h-7 shrink-0 rounded-full flex items-center justify-center text-xs font-semibold ${
                  i < etape
                    ? 'bg-secondary text-white'
                    : i === etape
                      ? 'bg-primary text-white'
                      : 'bg-grisclair text-grismoyen'
                }`}
              >
                {i < etape ? <Check size={14} /> : i + 1}
              </div>
              {i < ETAPES.length - 1 && (
                <div
                  className={`h-0.5 flex-1 mx-1 rounded-full ${
                    i < etape ? 'bg-secondary' : 'bg-grisclair'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="mt-2">
          <div className="text-sm font-medium text-grisfonce">
            Étape {etape + 1} sur {ETAPES.length} — {ETAPES[etape].titre}
          </div>
          <div className="text-xs text-grismoyen">{ETAPES[etape].description}</div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {etape === 0 && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-grisfonce">Prénom</label>
                <div className="mt-1 flex items-center gap-2 border border-grismoyen/50 rounded-lg px-3 py-2.5 focus-within:border-primary">
                  <User size={16} className="text-grismoyen" />
                  <input
                    autoFocus
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
                    value={form.nom}
                    onChange={(e) => majChamp('nom', e.target.value)}
                    className="w-full outline-none text-sm"
                    placeholder="Dupont"
                  />
                </div>
              </div>
            </div>
          )}

          {etape === 1 && (
            <>
              <div>
                <label className="text-sm font-medium text-grisfonce">Adresse e-mail</label>
                <div className="mt-1 flex items-center gap-2 border border-grismoyen/50 rounded-lg px-3 py-2.5 focus-within:border-primary">
                  <Mail size={18} className="text-grismoyen" />
                  <input
                    autoFocus
                    type="email"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                    value={form.email}
                    onChange={(e) => majChamp('email', e.target.value)}
                    className="w-full outline-none text-sm"
                    placeholder="jean.dupont@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-grisfonce">Mot de passe</label>
                <div className="mt-1 flex items-center gap-2 border border-grismoyen/50 rounded-lg px-3 py-2.5 focus-within:border-primary">
                  <Lock size={18} className="text-grismoyen" />
                  <input
                    type="password"
                    minLength={6}
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                    value={form.mot_de_passe}
                    onChange={(e) => majChamp('mot_de_passe', e.target.value)}
                    className="w-full outline-none text-sm"
                    placeholder="6 caractères minimum"
                  />
                </div>
              </div>
            </>
          )}

          {etape === 2 && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-grisfonce">Sexe</label>
                  <select
                    autoFocus
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
                    value={form.date_naissance}
                    onChange={(e) => majChamp('date_naissance', e.target.value)}
                    className={`${styleInput} mt-1`}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-grisfonce">Taille (cm)</label>
                <input
                  type="number"
                  min={130}
                  max={210}
                  placeholder="Ex : 175"
                  value={form.taille_cm}
                  onChange={(e) => majChamp('taille_cm', e.target.value)}
                  className={`${styleInput} mt-1`}
                />
              </div>
            </>
          )}

          {erreur && (
            <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{erreur}</p>
          )}

          <div className="flex gap-3 pt-2">
            {etape > 0 && (
              <button
                type="button"
                onClick={precedent}
                className="flex items-center justify-center gap-2 border border-grismoyen/50 text-grisfonce font-medium px-5 py-2.5 rounded-lg hover:bg-grisclair"
              >
                <ArrowLeft size={16} />
                Précédent
              </button>
            )}
            {etape < ETAPES.length - 1 ? (
              <button
                type="button"
                onClick={suivant}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-secondary text-white font-medium py-2.5 rounded-lg hover:opacity-90 transition-opacity"
              >
                Suivant
                <ArrowRight size={16} />
              </button>
            ) : (
              <button
                type="submit"
                disabled={envoiEnCours}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-secondary text-white font-medium py-2.5 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                <UserPlus size={18} />
                {envoiEnCours ? 'Création…' : 'Créer mon compte'}
              </button>
            )}
          </div>

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
