import { useState } from 'react'
import { User, Mail, Lock, ShieldCheck, Save } from 'lucide-react'
import Card from '../components/Card'
import { useAuth } from '../context/AuthContext'
import { modifierProfil, changerMotDePasse } from '../api/services'

const styleInput =
  'w-full border border-grismoyen/50 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary bg-white'

export default function ProfilePage() {
  const { utilisateur, mettreAJourUtilisateur } = useAuth()

  const [formProfil, setFormProfil] = useState({
    prenom: utilisateur?.prenom || '',
    nom: utilisateur?.nom || '',
    sexe: utilisateur?.sexe || '',
    date_naissance: utilisateur?.date_naissance || '',
    taille_cm: utilisateur?.taille_cm ?? '',
    poids_kg: utilisateur?.poids_kg ?? '',
  })
  const [messageProfil, setMessageProfil] = useState('')
  const [enregistrementProfil, setEnregistrementProfil] = useState(false)

  const [formMotDePasse, setFormMotDePasse] = useState({
    ancien_mot_de_passe: '',
    nouveau_mot_de_passe: '',
  })
  const [messageMotDePasse, setMessageMotDePasse] = useState('')
  const [enregistrementMotDePasse, setEnregistrementMotDePasse] = useState(false)

  async function handleSubmitProfil(e) {
    e.preventDefault()
    setMessageProfil('')
    setEnregistrementProfil(true)
    try {
      const donnees = {
        ...formProfil,
        sexe: formProfil.sexe || undefined,
        date_naissance: formProfil.date_naissance || undefined,
        taille_cm: formProfil.taille_cm !== '' ? Number(formProfil.taille_cm) : undefined,
        poids_kg: formProfil.poids_kg !== '' ? Number(formProfil.poids_kg) : undefined,
      }
      const profilMisAJour = await modifierProfil(donnees)
      mettreAJourUtilisateur(profilMisAJour)
      setMessageProfil('success:Profil mis à jour avec succès.')
    } catch (err) {
      setMessageProfil('error:' + (err.response?.data?.detail || "Une erreur est survenue."))
    } finally {
      setEnregistrementProfil(false)
    }
  }

  async function handleSubmitMotDePasse(e) {
    e.preventDefault()
    setMessageMotDePasse('')
    setEnregistrementMotDePasse(true)
    try {
      await changerMotDePasse(formMotDePasse)
      setMessageMotDePasse('success:Mot de passe modifié avec succès.')
      setFormMotDePasse({ ancien_mot_de_passe: '', nouveau_mot_de_passe: '' })
    } catch (err) {
      setMessageMotDePasse('error:' + (err.response?.data?.detail || "Une erreur est survenue."))
    } finally {
      setEnregistrementMotDePasse(false)
    }
  }

  function Message({ valeur }) {
    if (!valeur) return null
    const [type, texte] = valeur.split(':')
    return (
      <p
        className={`text-sm rounded-lg px-3 py-2 ${
          type === 'success' ? 'text-secondary bg-secondary/10' : 'text-red-500 bg-red-50'
        }`}
      >
        {texte}
      </p>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center font-semibold text-lg">
          {utilisateur?.prenom?.[0]}
          {utilisateur?.nom?.[0]}
        </div>
        <div>
          <h1 className="text-xl font-semibold text-grisfonce">
            {utilisateur?.prenom} {utilisateur?.nom}
          </h1>
          <p className="text-sm text-grismoyen capitalize">{utilisateur?.role}</p>
        </div>
      </div>

      <Card>
        <div className="flex items-center gap-2 mb-4">
          <User size={18} className="text-primary" />
          <h2 className="font-semibold text-grisfonce">Informations personnelles</h2>
        </div>
        <form onSubmit={handleSubmitProfil} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-grisfonce">Prénom</label>
              <input
                value={formProfil.prenom}
                onChange={(e) => setFormProfil((f) => ({ ...f, prenom: e.target.value }))}
                className={`${styleInput} mt-1`}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-grisfonce">Nom</label>
              <input
                value={formProfil.nom}
                onChange={(e) => setFormProfil((f) => ({ ...f, nom: e.target.value }))}
                className={`${styleInput} mt-1`}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-grisfonce">Sexe</label>
              <select
                required
                value={formProfil.sexe}
                onChange={(e) => setFormProfil((f) => ({ ...f, sexe: e.target.value }))}
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
                value={formProfil.date_naissance || ''}
                onChange={(e) => setFormProfil((f) => ({ ...f, date_naissance: e.target.value }))}
                className={`${styleInput} mt-1`}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-grisfonce">Taille (cm)</label>
              <input
                type="number"
                required
                min={130}
                max={210}
                value={formProfil.taille_cm}
                onChange={(e) => setFormProfil((f) => ({ ...f, taille_cm: e.target.value }))}
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
                value={formProfil.poids_kg}
                onChange={(e) => setFormProfil((f) => ({ ...f, poids_kg: e.target.value }))}
                className={`${styleInput} mt-1`}
              />
            </div>
          </div>
          <p className="text-xs text-grismoyen">
            Ces informations sont utilisées automatiquement lors de vos prédictions.
          </p>
          <div>
            <label className="text-sm font-medium text-grisfonce flex items-center gap-1">
              <Mail size={14} /> Adresse e-mail
            </label>
            <input
              disabled
              value={utilisateur?.email || ''}
              className={`${styleInput} mt-1 opacity-60 cursor-not-allowed`}
            />
          </div>
          <Message valeur={messageProfil} />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={enregistrementProfil}
              className="flex items-center gap-2 bg-primary text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:opacity-90 disabled:opacity-60"
            >
              <Save size={16} />
              {enregistrementProfil ? 'Enregistrement…' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </Card>

      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Lock size={18} className="text-primary" />
          <h2 className="font-semibold text-grisfonce">Paramètres de sécurité</h2>
        </div>
        <form onSubmit={handleSubmitMotDePasse} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-grisfonce">Mot de passe actuel</label>
            <input
              type="password"
              required
              value={formMotDePasse.ancien_mot_de_passe}
              onChange={(e) =>
                setFormMotDePasse((f) => ({ ...f, ancien_mot_de_passe: e.target.value }))
              }
              className={`${styleInput} mt-1`}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-grisfonce">Nouveau mot de passe</label>
            <input
              type="password"
              required
              minLength={6}
              value={formMotDePasse.nouveau_mot_de_passe}
              onChange={(e) =>
                setFormMotDePasse((f) => ({ ...f, nouveau_mot_de_passe: e.target.value }))
              }
              className={`${styleInput} mt-1`}
            />
          </div>
          <Message valeur={messageMotDePasse} />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={enregistrementMotDePasse}
              className="flex items-center gap-2 border border-primary text-primary text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-primary-light disabled:opacity-60"
            >
              <Lock size={16} />
              {enregistrementMotDePasse ? 'Modification…' : 'Modifier le mot de passe'}
            </button>
          </div>
        </form>
        <div className="flex items-center gap-2 mt-4 text-xs text-grismoyen bg-grisclair rounded-lg px-3 py-2">
          <ShieldCheck size={14} />
          Authentification à deux facteurs — bientôt disponible
        </div>
      </Card>
    </div>
  )
}
