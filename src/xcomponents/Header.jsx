// src/components/Header.jsx
import { useNavigate, useLocation } from 'react-router-dom'
import '../style.css'

export default function Header({ user, onLogout }) {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <header className="app-header">
      <div className="header-logo" onClick={() => navigate('/cadastro')}>
        Nota<span>lyX</span>
      </div>

      <div className="header-right">
        <span className="header-user">👤 {user.nome_exibicao}</span>

        <button
          className={`btn-nav ${location.pathname === '/cadastro' ? 'active' : ''}`}
          onClick={() => navigate('/cadastro')}
        >
          ➕ Cadastrar
        </button>

        <button
          className={`btn-nav ${location.pathname === '/materias' ? 'active' : ''}`}
          onClick={() => navigate('/materias')}
        >
          📋 Minhas Matérias
        </button>

        <button className="btn-nav danger" onClick={onLogout}>
          Sair
        </button>
      </div>
    </header>
  )
}