// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

import Login            from './pages/login/Login.jsx'
import Registro         from './pages/registro/Registro.jsx'
import CadastroMaterias from './pages/cadastroMaterias/CadastroMaterias.jsx'
import ListaMaterias    from './pages/listaMaterias/ListaMaterias.jsx'

// import { apiCarregarConfig, apiSalvarConfig } from './Api.jsx'

export default function App() {
  const [user, setUser]   = useState(null)
  const [config, setConfig] = useState({ units: 4, avgGoal: 60, maxGrade: 100 })

  // Carrega config do banco quando o usuário loga
  useEffect(() => {
    if (!user) return
    async function carregar() {
      try {
        const data = await apiCarregarConfig(user.username)
        setConfig({
          units:    data.units,
          avgGoal:  data.avg_goal,
          maxGrade: data.max_grade,
        })
      } catch (err) {
        // usa padrão
      }
    }
    carregar()
  }, [user])

  // Salva config no banco e atualiza estado global
  async function handleConfigChange(newConfig) {
    setConfig(newConfig)
    if (user) {
      try {
        await apiSalvarConfig(user.username, newConfig)
      } catch (err) {
        // silencioso
      }
    }
  }

  function handleLogout() {
    setUser(null)
    setConfig({ units: 4, avgGoal: 60, maxGrade: 100 })
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/cadastro" /> : <Login onLogin={setUser} />}
        />
        <Route
          path="/registro"
          element={user ? <Navigate to="/cadastro" /> : <Registro />}
        />
        <Route
          path="/cadastro"
          element={user
            ? <CadastroMaterias user={user} config={config} onConfigChange={handleConfigChange} onLogout={handleLogout} />
            : <Navigate to="/" />}
        />
        <Route
          path="/materias"
          element={user
            ? <ListaMaterias user={user} config={config} onConfigChange={handleConfigChange} onLogout={handleLogout} />
            : <Navigate to="/" />}
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}