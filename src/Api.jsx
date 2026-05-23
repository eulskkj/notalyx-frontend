// src/api.jsx
const API = 'http://127.0.0.1:5000/api'

// ── AUTH ──────────────────────────────────────────────────────
export async function apiLogin(username, senha) {
  const res  = await fetch(`${API}/login`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ username, senha }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Usuário ou senha incorretos.')
  return data.user // { username, nome_exibicao }
}

export async function apiRegistrar(username, senha, nome_exibicao) {
  const res  = await fetch(`${API}/registrar`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ username, senha, nome_exibicao }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Erro ao criar conta.')
  return data
}

// ── MATÉRIAS ──────────────────────────────────────────────────
export async function apiCarregarMaterias(username) {
  const res  = await fetch(`${API}/materias/${username}`)
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Erro ao carregar matérias.')
  return data
}

export async function apiSalvarMateria(name, grades, userId) {
  const res  = await fetch(`${API}/materias`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ name, grades, userId }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Erro ao salvar.')
  return data
}

export async function apiAtualizarNotas(id, grades, userId) {
  const res  = await fetch(`${API}/materias/${id}`, {
    method:  'PUT',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ grades, userId }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Erro ao atualizar.')
  return data
}

export async function apiDeletarMateria(id, userId) {
  const res  = await fetch(`${API}/materias/${id}`, {
    method:  'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ userId }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Erro ao deletar.')
  return data
}

// ── CÁLCULOS ──────────────────────────────────────────────────
export function padGrades(grades, units) {
  const arr = Array.isArray(grades) ? [...grades] : []
  while (arr.length < units) arr.push(null)
  return arr.slice(0, units)
}

export function calcSubject(subject, config) {
  const filled    = subject.grades.filter(g => g !== null)
  const sum       = filled.reduce((a, b) => a + b, 0)
  const avg       = filled.length > 0 ? sum / filled.length : null
  const remaining = config.units - filled.length

  let needed = null
  if (remaining > 0 && avg !== null) {
    needed = (config.avgGoal * config.units - sum) / remaining
  } else if (remaining > 0) {
    needed = config.avgGoal
  }

  const lacking = avg !== null ? Math.max(0, config.avgGoal - avg) : null
  return { avg, needed, lacking, remaining }
}