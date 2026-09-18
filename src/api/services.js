import client from './client'

export async function inscrire(donnees) {
  const { data } = await client.post('/auth/register', donnees)
  return data
}

export async function connecter(donnees) {
  const { data } = await client.post('/auth/login', donnees)
  return data
}

export async function obtenirProfil() {
  const { data } = await client.get('/users/me')
  return data
}

export async function modifierProfil(donnees) {
  const { data } = await client.put('/users/me', donnees)
  return data
}

export async function changerMotDePasse(donnees) {
  const { data } = await client.put('/users/me/mot-de-passe', donnees)
  return data
}

export async function creerPrediction(donnees) {
  const { data } = await client.post('/predictions', donnees)
  return data
}

export async function obtenirHistorique() {
  const { data } = await client.get('/predictions')
  return data
}

export async function obtenirPrediction(id) {
  const { data } = await client.get(`/predictions/${id}`)
  return data
}
