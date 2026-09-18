import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, HeartPulse, ClipboardList, RotateCcw, Activity, Info, Lock, UserCog } from 'lucide-react'
import Card from '../components/Card'
import { useAuth } from '../context/AuthContext'
import { creerPrediction } from '../api/services'

const VALEURS_INITIALES = {
  tension_systolique_mmHg: '',
  tension_diastolique_mmHg: '',
  cholesterol_total_mgdl: '',
  glycemie_jeun_mgdl: '',
  frequence_cardiaque_repos: '',
  fumeur: '',
  diabete: '',
  antecedents_familiaux_cardiaques: '',
}

function ageDepuisDateNaissance(dateNaissance) {
  if (!dateNaissance) return ''
  const naissance = new Date(dateNaissance)
  if (Number.isNaN(naissance.getTime())) return ''
  const aujourdHui = new Date()
  let age = aujourdHui.getFullYear() - naissance.getFullYear()
  const pasEncoreAnniversaire =
    aujourdHui.getMonth() < naissance.getMonth() ||
    (aujourdHui.getMonth() === naissance.getMonth() && aujourdHui.getDate() < naissance.getDate())
  if (pasEncoreAnniversaire) age -= 1
  return age >= 0 ? String(age) : ''
}

function profilEstComplet(utilisateur) {
  return Boolean(
    utilisateur?.sexe &&
      utilisateur?.date_naissance &&
      utilisateur?.taille_cm &&
      utilisateur?.poids_kg
  )
}

function Champ({ label, aide, children }) {
  return (
    <div>
      <label className="text-sm font-medium text-grisfonce flex items-center gap-1">
        {label}
        {aide && (
          <span title={aide}>
            <Info size={13} className="text-grismoyen" />
          </span>
        )}
      </label>
      <div className="mt-1">{children}</div>
    </div>
  )
}

const styleInput =
  'w-full border border-grismoyen/50 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary bg-white'

const styleInputLecture =
  'w-full border border-grismoyen/30 rounded-lg px-3 py-2.5 text-sm bg-grisclair text-grisfonce cursor-not-allowed'

export default function PredictionFormPage() {
  const navigate = useNavigate()
  const { utilisateur } = useAuth()
  const [form, setForm] = useState(VALEURS_INITIALES)
  const [erreur, setErreur] = useState('')
  const [envoiEnCours, setEnvoiEnCours] = useState(false)

  const profilComplet = profilEstComplet(utilisateur)
  const age = ageDepuisDateNaissance(utilisateur?.date_naissance)

  function majChamp(champ, valeur) {
    setForm((f) => ({ ...f, [champ]: valeur }))
  }

  function reinitialiser() {
    setForm(VALEURS_INITIALES)
    setErreur('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErreur('')
    setEnvoiEnCours(true)
    const patient = {
      ...form,
      age: Number(age),
      sexe: utilisateur.sexe,
      taille_cm: Number(utilisateur.taille_cm),
      poids_kg: Number(utilisateur.poids_kg),
      tension_systolique_mmHg: Number(form.tension_systolique_mmHg),
      tension_diastolique_mmHg: Number(form.tension_diastolique_mmHg),
      cholesterol_total_mgdl: Number(form.cholesterol_total_mgdl),
      glycemie_jeun_mgdl: Number(form.glycemie_jeun_mgdl),
      frequence_cardiaque_repos: Number(form.frequence_cardiaque_repos),
    }
    try {
      const resultat = await creerPrediction(patient)
      navigate('/resultats', { state: { resultat, patient } })
    } catch (err) {
      const detail = err.response?.data?.detail
      setErreur(
        typeof detail === 'string'
          ? detail
          : "Vérifiez que toutes les valeurs saisies sont correctes."
      )
    } finally {
      setEnvoiEnCours(false)
    }
  }

  if (!profilComplet) {
    return (
      <div className="max-w-3xl mx-auto">
        <Card className="text-center py-10">
          <UserCog className="mx-auto text-primary mb-3" size={32} />
          <p className="text-grisfonce font-medium">
            Complétez votre profil avant de lancer une prédiction
          </p>
          <p className="text-sm text-grismoyen mt-1 max-w-md mx-auto">
            Le sexe, la date de naissance, la taille et le poids sont nécessaires à l'analyse et
            se renseignent depuis votre profil.
          </p>
          <Link
            to="/profil"
            className="inline-flex items-center gap-2 mt-4 bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-medium"
          >
            <UserCog size={16} />
            Compléter mon profil
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Activity className="text-primary" size={26} />
        <div>
          <h1 className="text-xl font-semibold text-grisfonce">Nouvelle prédiction</h1>
          <p className="text-sm text-grismoyen">
            Renseignez les informations ci-dessous pour obtenir une analyse personnalisée de
            votre risque cardiovasculaire.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <User size={18} className="text-primary" />
              <h2 className="font-semibold text-grisfonce">1. Informations personnelles</h2>
            </div>
            <Link
              to="/profil"
              className="text-xs text-primary bg-primary-light px-2.5 py-1 rounded-full flex items-center gap-1 hover:opacity-80"
            >
              <Lock size={11} />
              Modifiable dans votre profil
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Champ label="Âge (ans)">
              <input type="number" disabled value={age} className={styleInputLecture} />
            </Champ>
            <Champ label="Sexe">
              <input type="text" disabled value={utilisateur.sexe} className={styleInputLecture} />
            </Champ>
            <Champ label="Taille (cm)">
              <input type="text" disabled value={utilisateur.taille_cm} className={styleInputLecture} />
            </Champ>
            <Champ label="Poids (kg)">
              <input type="text" disabled value={utilisateur.poids_kg} className={styleInputLecture} />
            </Champ>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-2 mb-4">
            <HeartPulse size={18} className="text-primary" />
            <h2 className="font-semibold text-grisfonce">2. Données cliniques</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Champ label="Pression artérielle systolique (mmHg)" aide="Valeur haute de la tension">
              <input
                type="number" required min={70} max={250} placeholder="Ex : 120"
                value={form.tension_systolique_mmHg}
                onChange={(e) => majChamp('tension_systolique_mmHg', e.target.value)}
                className={styleInput}
              />
            </Champ>
            <Champ label="Pression artérielle diastolique (mmHg)" aide="Valeur basse de la tension">
              <input
                type="number" required min={40} max={150} placeholder="Ex : 80"
                value={form.tension_diastolique_mmHg}
                onChange={(e) => majChamp('tension_diastolique_mmHg', e.target.value)}
                className={styleInput}
              />
            </Champ>
            <Champ label="Cholestérol total (mg/dL)">
              <input
                type="number" required min={80} max={500} placeholder="Ex : 180"
                value={form.cholesterol_total_mgdl}
                onChange={(e) => majChamp('cholesterol_total_mgdl', e.target.value)}
                className={styleInput}
              />
            </Champ>
            <Champ label="Glycémie à jeun (mg/dL)">
              <input
                type="number" required min={40} max={400} placeholder="Ex : 90"
                value={form.glycemie_jeun_mgdl}
                onChange={(e) => majChamp('glycemie_jeun_mgdl', e.target.value)}
                className={styleInput}
              />
            </Champ>
            <Champ label="Fréquence cardiaque au repos (bpm)">
              <input
                type="number" required min={40} max={130} placeholder="Ex : 72"
                value={form.frequence_cardiaque_repos}
                onChange={(e) => majChamp('frequence_cardiaque_repos', e.target.value)}
                className={styleInput}
              />
            </Champ>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-2 mb-4">
            <ClipboardList size={18} className="text-primary" />
            <h2 className="font-semibold text-grisfonce">3. Antécédents et habitudes</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <Champ label="Tabagisme">
              <select
                required value={form.fumeur} onChange={(e) => majChamp('fumeur', e.target.value)}
                className={styleInput}
              >
                <option value="">Sélectionnez</option>
                <option value="Oui">Oui</option>
                <option value="Non">Non</option>
              </select>
            </Champ>
            <Champ label="Diabète">
              <select
                required value={form.diabete} onChange={(e) => majChamp('diabete', e.target.value)}
                className={styleInput}
              >
                <option value="">Sélectionnez</option>
                <option value="Oui">Oui</option>
                <option value="Non">Non</option>
              </select>
            </Champ>
            <Champ label="Antécédents familiaux de maladie cardiaque">
              <select
                required
                value={form.antecedents_familiaux_cardiaques}
                onChange={(e) => majChamp('antecedents_familiaux_cardiaques', e.target.value)}
                className={styleInput}
              >
                <option value="">Sélectionnez</option>
                <option value="Oui">Oui</option>
                <option value="Non">Non</option>
              </select>
            </Champ>
          </div>
        </Card>

        <div className="bg-primary-light border border-primary/20 rounded-xl2 px-4 py-3 flex items-start gap-2 text-sm text-primary-dark">
          <Info size={18} className="shrink-0 mt-0.5" />
          <p>
            Veuillez fournir des informations exactes pour garantir la fiabilité de l'analyse.
            En cas de doute, consultez un professionnel de santé.
          </p>
        </div>

        {erreur && <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{erreur}</p>}

        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <button
            type="button"
            onClick={reinitialiser}
            className="flex items-center justify-center gap-2 border border-grismoyen/50 text-grisfonce font-medium px-5 py-2.5 rounded-lg hover:bg-grisclair"
          >
            <RotateCcw size={16} />
            Réinitialiser le formulaire
          </button>
          <button
            type="submit"
            disabled={envoiEnCours}
            className="flex items-center justify-center gap-2 bg-secondary text-white font-medium px-6 py-2.5 rounded-lg hover:opacity-90 disabled:opacity-60"
          >
            <Activity size={16} />
            {envoiEnCours ? 'Analyse en cours…' : "Lancer l'analyse"}
          </button>
        </div>
      </form>
    </div>
  )
}
