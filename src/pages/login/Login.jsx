// src/pages/login/Login.jsx
import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { apiLogin } from '../../Api.jsx'
import '../../style.css'

export default function Login({ onLogin }) {
  const navigate  = useNavigate()
  const location  = useLocation()
  const sucesso   = location.state?.sucesso || null

  const [username, setUsername] = useState('')
  const [senha, setSenha]       = useState('')
  const [erro, setErro]         = useState('')
  const [loading, setLoading]   = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!username || !senha) { setErro('Preencha usuário e senha.'); return }
    setLoading(true)
    setErro('')
    try {
      const user = await apiLogin(username, senha)
      onLogin(user)
    } catch (err) {
      setErro(err.message)
      setSenha('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="login-logo">Nota<span>lyX</span></div>
        <div className="login-tagline">// controle inteligente de notas</div>

        {sucesso && (
          <div className="login-success">{sucesso}</div>
        )}
        {erro && <div className="login-error">{erro}</div>}

        <form onSubmit={handleSubmit}>
          <label className="field-label">Usuário</label>
          <input
            className="field-input"
            type="text"
            placeholder="seu.usuario"
            autoComplete="off"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />

          <label className="field-label">Senha</label>
          <input
            className="field-input"
            type="password"
            placeholder="••••••••"
            value={senha}
            onChange={e => setSenha(e.target.value)}
          />

          <button className="btn-login" type="submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar →'}
          </button>
        </form>

        <div className="login-hint">
          Não tem conta?{' '}
          <span
            onClick={() => navigate('/registro')}
            style={{ color: 'var(--accent)', cursor: 'pointer', textDecoration: 'underline' }}
          >
            Criar conta
          </span>
        </div>
      </div>
    </div>
  )
}