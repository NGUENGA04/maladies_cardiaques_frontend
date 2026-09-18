import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Scale, HeartPulse, Cigarette, Droplet, Dumbbell, Stethoscope, Apple, User2 } from 'lucide-react'
import Card from '../components/Card'
import RiskBadge from '../components/RiskBadge'
import { obtenirHistorique } from '../api/services'

const ICONES = {
  poids: Scale,
  tension: HeartPulse,
  alimentation: Apple,
  tabac: Cigarette,
  glycemie: Droplet,
  activite: Dumbbell,
  consultation: Stethoscope,
}

export default function RecommendationsPage() {
  const [derniere, setDerniere] = useState(null)
  const [chargement, setChargement] = useState(true)

  useEffect(() => {
    obtenirHistorique()
      .then((h) => setDerniere(h[0] || null))
      .finally(() => setChargement(false))
  }, [])

  if (chargement) return <p className="text-sm text-grismoyen">Chargement…</p>

  if (!derniere) {
    return (
      <Card className="text-center py-10">
        <p className="text-grisfonce font-medium">Aucune recommandation disponible pour le moment.</p>
        <p className="text-sm text-grismoyen mt-1">
          Réalisez une première analyse pour recevoir des conseils personnalisés.
        </p>
        <Link
          to="/nouvelle-prediction"
          className="inline-flex items-center gap-2 mt-4 bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-medium"
        >
          Nouvelle prédiction
        </Link>
      </Card>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-grisfonce">Recommandations personnalisées</h1>
        <p className="text-sm text-grismoyen">
          Basées sur votre analyse du {new Date(derniere.date_creation).toLocaleDateString('fr-FR')} —
          niveau de risque : <RiskBadge niveau={derniere.niveau_risque} className="ml-1 align-middle" />
        </p>
      </div>

      <Card>
        <div className="space-y-3">
          {derniere.recommandations?.map((r) => {
            const Icone = ICONES[r.icone] || User2
            return (
              <div key={r.titre} className="flex items-start gap-3 p-3 rounded-lg hover:bg-grisclair">
                <div className="w-10 h-10 rounded-full bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                  <Icone size={20} />
                </div>
                <div>
                  <div className="text-sm font-medium text-grisfonce">{r.titre}</div>
                  <div className="text-sm text-grismoyen">{r.description}</div>
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      <p className="text-xs text-grismoyen text-center">
        Ces recommandations sont générées automatiquement et ne remplacent pas l'avis d'un
        professionnel de santé.
      </p>
    </div>
  )
}
