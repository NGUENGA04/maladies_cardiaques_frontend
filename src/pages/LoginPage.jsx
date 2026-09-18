import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, LogIn, ShieldCheck, HeartPulse, TrendingUp, ShieldPlus, Eye, EyeOff } from 'lucide-react'
import Logo from '../components/Logo'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { connecter } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [motDePasse, setMotDePasse] = useState('')
  const [motDePasseVisible, setMotDePasseVisible] = useState(false)
  const [erreur, setErreur] = useState('')
  const [envoiEnCours, setEnvoiEnCours] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setErreur('')
    setEnvoiEnCours(true)
    try {
      await connecter(email.trim().toLowerCase(), motDePasse)
      navigate('/tableau-de-bord')
    } catch (err) {
      if (err.response) {
        setErreur(err.response.data?.detail || "Adresse e-mail ou mot de passe incorrect.")
      } else {
        setErreur(
          "Impossible de joindre le serveur. Vérifiez votre connexion internet et réessayez (le serveur peut mettre jusqu'à une minute à démarrer après une période d'inactivité)."
        )
      }
    } finally {
      setEnvoiEnCours(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-grisclair p-4">
      <div className="w-full max-w-4xl bg-white rounded-xl2 shadow-card overflow-hidden grid md:grid-cols-2">
        <div className="p-8 md:p-10">
          <Logo taille={44} />

          <h1 className="mt-8 text-2xl font-semibold text-grisfonce">Bienvenue !</h1>
          <p className="text-sm text-grismoyen mt-1">
            Connectez-vous pour accéder à votre espace personnel
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-grisfonce">Adresse e-mail</label>
              <div className="mt-1 flex items-center gap-2 border border-grismoyen/50 rounded-lg px-3 py-2.5 focus-within:border-primary">
                <Mail size={18} className="text-grismoyen" />
                <input
                  type="email"
                  required
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Entrez votre adresse e-mail"
                  className="w-full outline-none text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-grisfonce">Mot de passe</label>
              <div className="mt-1 flex items-center gap-2 border border-grismoyen/50 rounded-lg px-3 py-2.5 focus-within:border-primary">
                <Lock size={18} className="text-grismoyen" />
                <input
                  type={motDePasseVisible ? 'text' : 'password'}
                  required
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  value={motDePasse}
                  onChange={(e) => setMotDePasse(e.target.value)}
                  placeholder="Entrez votre mot de passe"
                  className="w-full outline-none text-sm"
                />
                <button
                  type="button"
                  onClick={() => setMotDePasseVisible((v) => !v)}
                  className="text-grismoyen hover:text-grisfonce"
                  aria-label={motDePasseVisible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                >
                  {motDePasseVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="text-right mt-1">
                <span className="text-xs text-primary cursor-not-allowed opacity-70">
                  Mot de passe oublié ?
                </span>
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
              <LogIn size={18} />
              {envoiEnCours ? 'Connexion…' : 'Se connecter'}
            </button>

            <div className="flex items-center gap-3 text-xs text-grismoyen">
              <div className="flex-1 h-px bg-grisclair" />
              ou
              <div className="flex-1 h-px bg-grisclair" />
            </div>

            <Link
              to="/inscription"
              className="w-full flex items-center justify-center gap-2 border border-primary text-primary font-medium py-2.5 rounded-lg hover:bg-primary-light transition-colors"
            >
              Créer un compte
            </Link>

            <p className="flex items-center justify-center gap-1.5 text-xs text-grismoyen">
              <ShieldCheck size={14} className="text-secondary" />
              Vos données sont sécurisées et confidentielles
            </p>
          </form>
        </div>

        <div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-primary-dark via-primary to-secondary p-10 text-white relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-56 h-56 rounded-full bg-white/10" />
          <div className="absolute -left-16 bottom-10 w-40 h-40 rounded-full bg-white/10" />

          <div className="relative flex justify-center mt-10">
            <HeartPulse size={140} strokeWidth={1.2} className="opacity-90" />
          </div>

          <div className="relative grid grid-cols-3 gap-3 text-center mt-10">
            <div>
              <ShieldCheck size={22} className="mx-auto mb-1" />
              <div className="text-xs font-semibold">Prévoir</div>
              <div className="text-[10px] text-white/70">Anticipez les risques</div>
            </div>
            <div>
              <TrendingUp size={22} className="mx-auto mb-1" />
              <div className="text-xs font-semibold">Agir</div>
              <div className="text-[10px] text-white/70">Adoptez de bonnes habitudes</div>
            </div>
            <div>
              <ShieldPlus size={22} className="mx-auto mb-1" />
              <div className="text-xs font-semibold">Protéger</div>
              <div className="text-[10px] text-white/70">Protégez votre cœur</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
