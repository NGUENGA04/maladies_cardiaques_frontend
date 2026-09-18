import { useEffect, useState } from 'react'
import { useLocation, useParams, useNavigate, Link } from 'react-router-dom'
import {
  ArrowLeft, Download, History, RotateCcw, AlertTriangle,
  Scale, HeartPulse, User2, Cigarette, Droplet, Dumbbell, Stethoscope, Apple,
} from 'lucide-react'
import Card from '../components/Card'
import RiskBadge from '../components/RiskBadge'
import { obtenirPrediction } from '../api/services'

const ICONES_RECOMMANDATIONS = {
  poids: Scale,
  tension: HeartPulse,
  alimentation: Apple,
  tabac: Cigarette,
  glycemie: Droplet,
  activite: Dumbbell,
  consultation: Stethoscope,
}

const COULEURS_NIVEAU = {
  Faible: '#2EC4A6',
  Modéré: '#F5A623',
  Élevé: '#E53E3E',
}

function LabelDetail({ label, valeur }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-grisclair last:border-0">
      <span className="text-sm text-grismoyen">{label}</span>
      <span className="text-sm font-medium text-grisfonce">{valeur}</span>
    </div>
  )
}

export default function ResultsPage() {
  const location = useLocation()
  const { id } = useParams()
  const navigate = useNavigate()

  const [resultat, setResultat] = useState(location.state?.resultat || null)
  const [patient, setPatient] = useState(location.state?.patient || null)
  const [dateAnalyse, setDateAnalyse] = useState(location.state?.dateAnalyse || new Date().toISOString())
  const [chargement, setChargement] = useState(!location.state)
  const [erreur, setErreur] = useState('')

  useEffect(() => {
    if (location.state || !id) return
    obtenirPrediction(id)
      .then((p) => {
        setResultat(p)
        setPatient(p)
        setDateAnalyse(p.date_creation)
      })
      .catch(() => setErreur("Impossible de charger cette analyse."))
      .finally(() => setChargement(false))
  }, [id, location.state])

  if (chargement) {
    return <p className="text-grismoyen text-sm">Chargement…</p>
  }

  if (erreur || !resultat) {
    return (
      <Card className="text-center py-10">
        <p className="text-grisfonce">{erreur || "Aucun résultat à afficher."}</p>
        <Link to="/nouvelle-prediction" className="text-primary text-sm mt-3 inline-block">
          Lancer une nouvelle prédiction
        </Link>
      </Card>
    )
  }

  const pourcentage = Math.round(resultat.probabilite_risque * 100)

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-grismoyen hover:text-grisfonce"
        >
          <ArrowLeft size={16} /> Retour
        </button>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 border border-grismoyen/50 text-grisfonce text-sm font-medium px-4 py-2 rounded-lg hover:bg-grisclair"
        >
          <Download size={16} /> Télécharger le rapport
        </button>
      </div>

      <div>
        <h1 className="text-xl font-semibold text-grisfonce">Résultats de prédiction</h1>
        <p className="text-sm text-grismoyen">
          Analyse réalisée le {new Date(dateAnalyse).toLocaleDateString('fr-FR')} à{' '}
          {new Date(dateAnalyse).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <Card className="flex flex-col items-center justify-center text-center">
          <span className="text-xs text-grismoyen">Probabilité estimée</span>
          <span className="text-5xl font-bold text-primary mt-2">{pourcentage}%</span>
          <p className="text-xs text-grismoyen mt-2">
            Probabilité de développer une maladie cardiovasculaire
          </p>
        </Card>
        <Card className="flex flex-col items-center justify-center text-center">
          <span className="text-xs text-grismoyen">Niveau de risque</span>
          <RiskBadge niveau={resultat.niveau_risque} className="mt-3 text-sm px-4 py-1.5" />
          <div className="w-full h-2 rounded-full bg-grisclair mt-4 overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${pourcentage}%`,
                backgroundColor: COULEURS_NIVEAU[resultat.niveau_risque],
              }}
            />
          </div>
          <div className="flex justify-between w-full text-[10px] text-grismoyen mt-1">
            <span>Faible</span>
            <span>Modéré</span>
            <span>Élevé</span>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="font-semibold text-grisfonce mb-4">
            Facteurs ayant le plus influencé le résultat
          </h2>
          <div className="space-y-3">
            {resultat.facteurs_impact?.map((f) => (
              <div key={f.facteur}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-grisfonce">{f.facteur}</span>
                  <span className={f.impact_pourcent >= 0 ? 'text-red-500' : 'text-secondary'}>
                    {f.impact_pourcent >= 0 ? '+' : ''}
                    {f.impact_pourcent}%
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-grisclair overflow-hidden">
                  <div
                    className={`h-full rounded-full ${f.impact_pourcent >= 0 ? 'bg-red-400' : 'bg-secondary'}`}
                    style={{ width: `${Math.min(Math.abs(f.impact_pourcent) * 2.5, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-grismoyen mt-4">
            Ces résultats sont générés par notre modèle d'intelligence artificielle et ne
            remplacent pas un avis médical.
          </p>
        </Card>

        {patient && (
          <Card>
            <h2 className="font-semibold text-grisfonce mb-2">Détails de l'analyse</h2>
            <LabelDetail label="Âge" valeur={`${patient.age} ans`} />
            <LabelDetail label="Sexe" valeur={patient.sexe} />
            <LabelDetail
              label="Pression artérielle"
              valeur={`${patient.tension_systolique_mmHg} / ${patient.tension_diastolique_mmHg} mmHg`}
            />
            <LabelDetail label="Cholestérol total" valeur={`${patient.cholesterol_total_mgdl} mg/dL`} />
            <LabelDetail label="Glycémie à jeun" valeur={`${patient.glycemie_jeun_mgdl} mg/dL`} />
            <LabelDetail label="Fréquence cardiaque" valeur={`${patient.frequence_cardiaque_repos} bpm`} />
            <LabelDetail label="IMC" valeur={`${resultat.imc_calcule} kg/m²`} />
            <LabelDetail label="Tabagisme" valeur={patient.fumeur} />
            <LabelDetail label="Antécédents familiaux" valeur={patient.antecedents_familiaux_cardiaques} />
          </Card>
        )}
      </div>

      <Card>
        <h2 className="font-semibold text-grisfonce mb-4">Recommandations personnalisées</h2>
        <div className="space-y-3">
          {resultat.recommandations?.map((r) => {
            const Icone = ICONES_RECOMMANDATIONS[r.icone] || User2
            return (
              <div key={r.titre} className="flex items-start gap-3 p-3 rounded-lg hover:bg-grisclair">
                <div className="w-9 h-9 rounded-full bg-primary-light text-primary flex items-center justify-center shrink-0">
                  <Icone size={18} />
                </div>
                <div>
                  <div className="text-sm font-medium text-grisfonce">{r.titre}</div>
                  <div className="text-xs text-grismoyen">{r.description}</div>
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      {(resultat.niveau_risque === 'Élevé' || resultat.niveau_risque === 'Modéré') && (
        <div className="bg-red-50 border border-red-200 rounded-xl2 px-4 py-3 flex items-start gap-3">
          <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={20} />
          <div>
            <div className="text-sm font-semibold text-red-600">Attention</div>
            <p className="text-sm text-red-500">
              Votre niveau de risque est {resultat.niveau_risque.toLowerCase()}. Une prise en
              charge médicale et un suivi régulier sont fortement recommandés.
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-center gap-3">
        <Link
          to="/nouvelle-prediction"
          className="flex items-center justify-center gap-2 border border-grismoyen/50 text-grisfonce font-medium px-5 py-2.5 rounded-lg hover:bg-grisclair"
        >
          <RotateCcw size={16} /> Nouvelle prédiction
        </Link>
        <Link
          to="/historique"
          className="flex items-center justify-center gap-2 bg-secondary text-white font-medium px-5 py-2.5 rounded-lg hover:opacity-90"
        >
          <History size={16} /> Voir l'historique
        </Link>
      </div>
    </div>
  )
}
