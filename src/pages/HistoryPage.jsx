import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Download, Eye, TrendingUp, TrendingDown, Minus, ClipboardList } from 'lucide-react'
import Card from '../components/Card'
import RiskBadge from '../components/RiskBadge'
import { obtenirHistorique } from '../api/services'

export default function HistoryPage() {
  const navigate = useNavigate()
  const [historique, setHistorique] = useState([])
  const [chargement, setChargement] = useState(true)
  const [recherche, setRecherche] = useState('')
  const [filtreNiveau, setFiltreNiveau] = useState('Tous les niveaux')

  useEffect(() => {
    obtenirHistorique()
      .then(setHistorique)
      .finally(() => setChargement(false))
  }, [])

  const listeFiltree = useMemo(() => {
    return historique
      .filter((p) => filtreNiveau === 'Tous les niveaux' || p.niveau_risque === filtreNiveau)
      .filter((p) =>
        recherche
          ? new Date(p.date_creation).toLocaleDateString('fr-FR').includes(recherche)
          : true
      )
  }, [historique, recherche, filtreNiveau])

  const stats = useMemo(() => {
    if (historique.length === 0) return null
    const probas = historique.map((p) => p.probabilite_risque)
    return {
      total: historique.length,
      moyen: Math.round((probas.reduce((a, b) => a + b, 0) / probas.length) * 100),
      max: Math.round(Math.max(...probas) * 100),
      tendance: historique.length > 1
        ? historique[0].probabilite_risque - historique[historique.length - 1].probabilite_risque
        : null,
    }
  }, [historique])

  function exporter() {
    const entetes = ['Date', 'Score de risque (%)', 'Niveau de risque', 'Diagnostic']
    const lignes = listeFiltree.map((p) => [
      new Date(p.date_creation).toLocaleString('fr-FR'),
      Math.round(p.probabilite_risque * 100),
      p.niveau_risque,
      p.diagnostic,
    ])
    const csv = [entetes, ...lignes].map((ligne) => ligne.join(';')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'historique_cardiozen.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  function evolutionIcone(index) {
    if (index === listeFiltree.length - 1) return <Minus size={16} className="text-grismoyen" />
    const diff = listeFiltree[index].probabilite_risque - listeFiltree[index + 1].probabilite_risque
    if (diff > 0) return <TrendingUp size={16} className="text-red-500" />
    if (diff < 0) return <TrendingDown size={16} className="text-secondary" />
    return <Minus size={16} className="text-grismoyen" />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-semibold text-grisfonce">Historique des analyses</h1>
          <p className="text-sm text-grismoyen">
            Consultez l'ensemble de vos analyses et suivez l'évolution de votre risque
            cardiovasculaire.
          </p>
        </div>
        <button
          onClick={exporter}
          disabled={listeFiltree.length === 0}
          className="flex items-center gap-2 bg-primary text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:opacity-90 disabled:opacity-50"
        >
          <Download size={16} /> Exporter
        </button>
      </div>

      {stats && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <div className="text-xs text-grismoyen">Nombre total d'analyses</div>
            <div className="text-xl font-semibold text-grisfonce mt-1">{stats.total}</div>
          </Card>
          <Card>
            <div className="text-xs text-grismoyen">Risque moyen</div>
            <div className="text-xl font-semibold text-grisfonce mt-1">{stats.moyen}%</div>
          </Card>
          <Card>
            <div className="text-xs text-grismoyen">Risque le plus élevé</div>
            <div className="text-xl font-semibold text-grisfonce mt-1">{stats.max}%</div>
          </Card>
          <Card>
            <div className="text-xs text-grismoyen">Tendance globale</div>
            <div className="text-xl font-semibold mt-1 flex items-center gap-1">
              {stats.tendance === null ? (
                <span className="text-grismoyen flex items-center gap-1 text-base">
                  <Minus size={18} /> Pas encore de tendance
                </span>
              ) : stats.tendance <= 0 ? (
                <span className="text-secondary flex items-center gap-1 text-base">
                  <TrendingDown size={18} /> En amélioration
                </span>
              ) : (
                <span className="text-red-500 flex items-center gap-1 text-base">
                  <TrendingUp size={18} /> En hausse
                </span>
              )}
            </div>
          </Card>
        </div>
      )}

      <Card>
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="flex items-center gap-2 border border-grismoyen/50 rounded-lg px-3 py-2 flex-1">
            <Search size={16} className="text-grismoyen" />
            <input
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              placeholder="Rechercher une analyse (JJ/MM/AAAA)…"
              className="w-full outline-none text-sm"
            />
          </div>
          <select
            value={filtreNiveau}
            onChange={(e) => setFiltreNiveau(e.target.value)}
            className="border border-grismoyen/50 rounded-lg px-3 py-2 text-sm bg-white"
          >
            <option>Tous les niveaux</option>
            <option>Faible</option>
            <option>Modéré</option>
            <option>Élevé</option>
          </select>
        </div>

        {chargement ? (
          <p className="text-sm text-grismoyen">Chargement…</p>
        ) : listeFiltree.length === 0 ? (
          <div className="text-center py-10">
            <ClipboardList className="mx-auto text-grismoyen mb-2" size={32} />
            <p className="text-sm text-grismoyen">Aucune analyse trouvée.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-grismoyen border-b border-grisclair">
                  <th className="py-2 pr-4 font-medium">Date de l'analyse</th>
                  <th className="py-2 pr-4 font-medium">Score de risque</th>
                  <th className="py-2 pr-4 font-medium">Niveau de risque</th>
                  <th className="py-2 pr-4 font-medium">Évolution</th>
                  <th className="py-2 pr-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-grisclair">
                {listeFiltree.map((p, index) => (
                  <tr key={p.id}>
                    <td className="py-3 pr-4 text-grisfonce">
                      {new Date(p.date_creation).toLocaleDateString('fr-FR')}
                      <div className="text-xs text-grismoyen">
                        {new Date(p.date_creation).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="py-3 pr-4 font-semibold text-grisfonce">
                      {Math.round(p.probabilite_risque * 100)}%
                    </td>
                    <td className="py-3 pr-4">
                      <RiskBadge niveau={p.niveau_risque} />
                    </td>
                    <td className="py-3 pr-4">{evolutionIcone(index)}</td>
                    <td className="py-3 pr-4 text-right">
                      <button
                        onClick={() => navigate(`/resultats/${p.id}`)}
                        className="inline-flex items-center gap-1 text-primary hover:underline"
                      >
                        <Eye size={16} /> Voir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="text-[11px] text-grismoyen mt-4">
          Les résultats présentés sont fournis à titre indicatif et ne remplacent pas un avis
          médical professionnel.
        </p>
      </Card>
    </div>
  )
}
