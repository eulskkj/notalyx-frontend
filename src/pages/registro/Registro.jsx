// src/pages/registro/Registro.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiRegistrar } from '../../Api.jsx'
import '../../style.css'

export default function Registro() {
  const navigate = useNavigate()

  const [nome, setNome]         = useState('')
  const [username, setUsername] = useState('')
  const [senha, setSenha]       = useState('')
  const [confirma, setConfirma] = useState('')
  const [erro, setErro]         = useState('')
  const [loading, setLoading]   = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')

    if (!nome || !username || !senha || !confirma) {
      setErro('Preencha todos os campos.'); return
    }
    if (senha !== confirma) {
      setErro('As senhas não coincidem.'); return
    }
    if (senha.length < 4) {
      setErro('A senha deve ter pelo menos 4 caracteres.'); return
    }

    setLoading(true)
    try {
      await apiRegistrar(username.trim(), senha, nome.trim())
      // Cadastrou com sucesso → vai pro login
      navigate('/', { state: { sucesso: `Conta criada! Faça login, ${nome.trim()}.` } })
    } catch (err) {
      setErro(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="login-logo">Nota<span>lyX</span></div>
        <div className="login-tagline">// criar nova conta</div>

        {erro && <div className="login-error">{erro}</div>}

        <form onSubmit={handleSubmit}>
          <label className="field-label">Nome de exibição</label>
          <input
            className="field-input"
            type="text"
            placeholder="Ex: João Silva"
            autoComplete="off"
            value={nome}
            onChange={e => setNome(e.target.value)}
          />

          <label className="field-label">Usuário</label>
          <input
            className="field-input"
            type="text"
            placeholder="Ex: joao.silva"
            autoComplete="off"
            value={username}
            onChange={e => setUsername(e.target.value.toLowerCase().replace(/\s/g, '.'))}
          />

          <label className="field-label">Senha</label>
          <input
            className="field-input"
            type="password"
            placeholder="Mínimo 4 caracteres"
            value={senha}
            onChange={e => setSenha(e.target.value)}
          />

          <label className="field-label">Confirmar Senha</label>
          <input
            className="field-input"
            type="password"
            placeholder="Repita a senha"
            value={confirma}
            onChange={e => setConfirma(e.target.value)}
          />

          <button className="btn-login" type="submit" disabled={loading}>
            {loading ? 'Criando conta...' : 'Criar conta →'}
          </button>
        </form>

        <div className="login-hint">
          Já tem conta?{' '}
          <span
            onClick={() => navigate('/')}
            style={{ color: 'var(--accent)', cursor: 'pointer', textDecoration: 'underline' }}
          >
            Entrar
          </span>
        </div>
      </div>
    </div>
  )
}