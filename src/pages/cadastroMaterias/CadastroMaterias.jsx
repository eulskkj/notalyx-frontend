// src/pages/cadastroMaterias/CadastroMaterias.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header.jsx'
import {
  apiSalvarMateria,
  apiCarregarConfig,
  apiSalvarConfig,
  padGrades,
} from '../../Api.jsx'
import '../../style.css'

export default function CadastroMaterias({ user, onLogout }) {
  const navigate = useNavigate()

  const [config, setConfig]       = useState({ units: 4, avgGoal: 60, maxGrade: 100 })
  const [avgInput, setAvgInput]   = useState('60')
  const [maxInput, setMaxInput]   = useState('100')
  const [newName, setNewName]     = useState('')
  const [newGrades, setNewGrades] = useState(Array(4).fill(''))
  const [adding, setAdding]       = useState(false)
  const [toast, setToast]         = useState(null)
  const [configLoad, setConfigLoad] = useState(true)

  useEffect(() => {
    async function carregarConfig() {
      try {
        const data = await apiCarregarConfig(user.username)
        const c = {
          units:    data.units,
          avgGoal:  data.avg_goal,
          maxGrade: data.max_grade,
        }
        setConfig(c)
        setAvgInput(String(data.avg_goal))
        setMaxInput(String(data.max_grade))
        setNewGrades(Array(data.units).fill(''))
      } catch (err) {
        // usa padrão
      } finally {
        setConfigLoad(false)
      }
    }
    carregarConfig()
  }, [user.username])

  useEffect(() => {
    setNewGrades(Array(config.units).fill(''))
  }, [config.units])

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(null), 3500)
  }

  async function handleConfigChange(newConfig) {
    setConfig(newConfig)
    try {
      await apiSalvarConfig(user.username, newConfig)
    } catch (err) {
      // silencioso
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!newName.trim()) { showToast('⚠ Digite o nome da matéria!'); return }
    setAdding(true)
    const grades = newGrades.map(v => (v === '' ? null : parseFloat(v)))
    try {
      await apiSalvarMateria(newName.trim(), grades, user.username)
      showToast(`✅ ${newName.trim()} salva!`)
      setNewName('')
      setNewGrades(Array(config.units).fill(''))
    } catch (err) {
      showToast(`⚠ ${err.message}`)
    } finally {
      setAdding(false)
    }
  }

  if (configLoad) return null

  return (
    <>
      <Header user={user} onLogout={onLogout} />

      <div className="main">

        <div className="config-card">
          <div className="card-title">⚙ Configuração Escolar</div>
          <div className="config-grid">

            <div className="config-field">
              <label>Quantidade de Unidades</label>
              <select
                value={config.units}
                onChange={e => handleConfigChange({ ...config, units: parseInt(e.target.value) })}
              >
                <option value={2}>2 Unidades (Bimestral)</option>
                <option value={3}>3 Unidades (Trimestral)</option>
                <option value={4}>4 Unidades (Bimestral c/ rec.)</option>
              </select>
            </div>

            <div className="config-field">
              <label>Média para Aprovação</label>
              <input
                type="text"
                inputMode="numeric"
                value={avgInput}
                onChange={e => setAvgInput(e.target.value.replace(/[^0-9.]/g, ''))}
                onBlur={e => {
                  const v = parseFloat(e.target.value)
                  if (!isNaN(v) && v > 0) {
                    setAvgInput(String(v))
                    handleConfigChange({ ...config, avgGoal: v })
                  } else {
                    setAvgInput(String(config.avgGoal))
                  }
                }}
              />
            </div>

            <div className="config-field">
              <label>Nota Máxima por Unidade</label>
              <input
                type="text"
                inputMode="numeric"
                value={maxInput}
                onChange={e => setMaxInput(e.target.value.replace(/[^0-9.]/g, ''))}
                onBlur={e => {
                  const v = parseFloat(e.target.value)
                  if (!isNaN(v) && v > 0) {
                    setMaxInput(String(v))
                    handleConfigChange({ ...config, maxGrade: v })
                  } else {
                    setMaxInput(String(config.maxGrade))
                  }
                }}
              />
            </div>

          </div>
        </div>

        <div className="add-form">
          <div className="card-title">➕ Nova Matéria</div>
          <form
            className="form-row"
            style={{ gridTemplateColumns: `2fr repeat(${config.units}, 1fr) auto` }}
            onSubmit={handleSubmit}
          >
            <div className="form-field">
              <label>Nome da Matéria</label>
              <input
                type="text"
                placeholder="Ex: Matemática"
                value={newName}
                onChange={e => setNewName(e.target.value)}
              />
            </div>

            {Array.from({ length: config.units }, (_, i) => (
              <div key={i} className="form-field">
                <label>{i + 1}ª Unidade</label>
                <input
                  type="number" min={0} max={config.maxGrade} step={0.1}
                  placeholder="—"
                  value={newGrades[i] ?? ''}
                  onChange={e => setNewGrades(g => {
                    const n = [...g]; n[i] = e.target.value; return n
                  })}
                />
              </div>
            ))}

            <div className="form-field" style={{ alignSelf: 'flex-end' }}>
              <button className="btn-add" type="submit" disabled={adding}>
                {adding ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </form>
        </div>

        <div style={{ textAlign: 'center', marginTop: 8 }}>
          <button
            className="btn-nav"
            style={{ fontSize: '.9rem', padding: '10px 24px' }}
            onClick={() => navigate('/materias')}
          >
            Ver todas as matérias →
          </button>
        </div>

      </div>

      {toast && <div className="toast">{toast}</div>}
    </>
  )
}