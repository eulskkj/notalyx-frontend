// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'

import Login            from './pages/login/Login.jsx'
import Registro         from './pages/registro/Registro.jsx'
import CadastroMaterias from './pages/cadastroMaterias/CadastroMaterias.jsx'
import ListaMaterias    from './pages/listaMaterias/ListaMaterias.jsx'

export default function App() {
  const [user, setUser] = useState(null)

  return (
    <BrowserRouter>
      <Routes>
        {/* Login */}
        <Route
          path="/"
          element={user ? <Navigate to="/cadastro" /> : <Login onLogin={setUser} />}
        />

        {/* Registro — sempre acessível (mesmo logado redireciona) */}
        <Route
          path="/registro"
          element={user ? <Navigate to="/cadastro" /> : <Registro />}
        />

        {/* Cadastrar nova matéria */}
        <Route
          path="/cadastro"
          element={user
            ? <CadastroMaterias user={user} onLogout={() => setUser(null)} />
            : <Navigate to="/" />}
        />

        {/* Listar / editar / apagar */}
        <Route
          path="/materias"
          element={user
            ? <ListaMaterias user={user} onLogout={() => setUser(null)} />
            : <Navigate to="/" />}
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}