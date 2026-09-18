import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, Legend,
} from 'recharts'
import { Activity, TrendingUp, TrendingDown, ClipboardList, ChevronRight } from 'lucide-react'
import Card from '../components/Card'
import RiskBadge from '../components/RiskBadge'
import { useAuth } from '../context/AuthContext'
import { obtenirHistorique } from '../api/services'

const COULEURS_DONUT = ['#1976D2', '#2EC4A6', '#F5A623', '#E53E3E', '#0D47A1', '#B0BEC5']

export default function DashboardPage() {
  const { utilisateur } = useAuth()
  const [historique, setHistorique] = useState([])
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState('')

  useEffect(() => {
    obtenirHistorique()
      .then(setHistorique)
      .catch(() => setErreur("Impossible de charger vos données."))
      .finally(() => setChargement(false))
  }, [])

  const derniere = historique[0]

  const stats = useMemo(() => {
    if (historique.length === 0) return null
    const probas = historique.map((p) => p.probabilite_risque)
    const risqueMoyen = probas.reduce((a, b) => a + b, 0) / probas.length
    const risquePlusEleve = Math.max(...probas)
    const tendance =
      historique.length > 1 ? historique[0].probabilite_risque - historique[1].probabilite_risque : null
    return { risqueMoyen, risquePlusEleve, tendance }
  }, [historique])

  const donneesEvolution = useMemo(
    () =>
      [...historique]
        .slice(0, 8)
        .reverse()
        .map((p) => ({
          date: new Date(p.date_creation).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
          risque: Math.round(p.probabilite_risque * 100),
        })),
    [historique]
  )

  const donneesFacteurs = useMemo(() => {
    if (!derniere?.facteurs_impact) return []
    return derniere.facteurs_impact
      .filter((f) => f.impact_pourcent > 0)
      .map((f) => ({ name: f.facteur, value: Math.round(f.impact_pourcent) }))
  }, [derniere])

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-primary to-secondary text-white flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Bonjour, {utilisateur?.prenom} !</h1>
          <p className="text-white/85 text-sm mt-1 max-w-lg">
            Voici un aperçu de votre état de santé cardiovasculaire. Restez régulier dans vos
            suivis et adoptez un mode de vie sain.
          </p>
        </div>
        <Link
          to="/nouvelle-prediction"
          className="shrink-0 bg-white text-primary font-medium px-5 py-2.5 rounded-lg flex items-center gap-2 hover:bg-white/90 transition-colors"
        >
          <Activity size={18} />
          Nouvelle prédiction
        </Link>
      </Card>

      {erreur && <p className="text-sm text-red-500">{erreur}</p>}

      {!chargement && historique.length === 0 && (
        <Card className="text-center py-10">
          <p className="text-grisfonce font-medium">Vous n'avez pas encore réalisé d'analyse.</p>
          <p className="text-sm text-grismoyen mt-1">
            Lancez votre première prédiction pour découvrir votre niveau de risque cardiovasculaire.
          </p>
          <Link
            to="/nouvelle-prediction"
            className="inline-flex items-center gap-2 mt-4 bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-medium"
          >
            <Activity size={16} />
            Commencer
          </Link>
        </Card>
      )}

      {stats && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <div className="text-xs text-grismoyen">Niveau de risque actuel</div>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xl font-semibold text-grisfonce">{derniere.niveau_risque}</span>
            </div>
            <div className="text-xs text-grismoyen mt-1">
              Probabilité : {Math.round(derniere.probabilite_risque * 100)}%
            </div>
          </Card>
          <Card>
            <div className="text-xs text-grismoyen">Dernière prédiction</div>
            <div className="mt-2 text-xl font-semibold text-grisfonce">
              {new Date(derniere.date_creation).toLocaleDateString('fr-FR')}
            </div>
            <RiskBadge niveau={derniere.niveau_risque} className="mt-2" />
          </Card>
          <Card>
            <div className="text-xs text-grismoyen">Analyses effectuées</div>
            <div className="mt-2 text-xl font-semibold text-grisfonce">{historique.length}</div>
            <div className="text-xs text-grismoyen mt-1">Depuis votre inscription</div>
          </Card>
          <Card>
            <div className="text-xs text-grismoyen">Tendance</div>
            <div className="mt-2 flex items-center gap-2 text-xl font-semibold">
              {stats.tendance === null ? (
                <span className="text-grismoyen flex items-center gap-1 text-base">
                  Pas encore de tendance
                </span>
              ) : stats.tendance <= 0 ? (
                <span className="text-secondary flex items-center gap-1">
                  <TrendingDown size={20} /> En amélioration
                </span>
              ) : (
                <span className="text-red-500 flex items-center gap-1">
                  <TrendingUp size={20} /> En hausse
                </span>
              )}
            </div>
          </Card>
        </div>
      )}

      {historique.length > 0 && (
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <h2 className="font-semibold text-grisfonce mb-4">Évolution de votre risque</h2>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={donneesEvolution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F5F7FA" />
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#B0BEC5' }} />
                <YAxis tick={{ fontSize: 12, fill: '#B0BEC5' }} domain={[0, 100]} />
                <Tooltip formatter={(v) => `${v}%`} />
                <Line type="monotone" dataKey="risque" stroke="#1976D2" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card>
            <h2 className="font-semibold text-grisfonce mb-4">
              Répartition des facteurs (dernière analyse)
            </h2>
            {donneesFacteurs.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={donneesFacteurs}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                  >
                    {donneesFacteurs.map((_, i) => (
                      <Cell key={i} fill={COULEURS_DONUT[i % COULEURS_DONUT.length]} />
                    ))}
                  </Pie>
                  <Legend layout="vertical" align="right" verticalAlign="middle" wrapperStyle={{ fontSize: 12 }} />
                  <Tooltip formatter={(v) => `${v}%`} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-grismoyen">Aucun facteur de risque significatif détecté.</p>
            )}
          </Card>
        </div>
      )}

      {historique.length > 0 && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-grisfonce">Historique récent</h2>
            <Link to="/historique" className="text-sm text-primary flex items-center gap-1">
              Voir tout l'historique <ChevronRight size={16} />
            </Link>
          </div>
          <div className="divide-y divide-grisclair">
            {historique.slice(0, 5).map((p) => (
              <div key={p.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <ClipboardList size={18} className="text-grismoyen" />
                  <div>
                    <div className="text-sm font-medium text-grisfonce">
                      {new Date(p.date_creation).toLocaleDateString('fr-FR')}
                    </div>
                    <div className="text-xs text-grismoyen">
                      {new Date(p.date_creation).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-grisfonce">
                    {Math.round(p.probabilite_risque * 100)}%
                  </span>
                  <RiskBadge niveau={p.niveau_risque} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
