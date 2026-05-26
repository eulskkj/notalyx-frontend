// src/pages/listaMaterias/ListaMaterias.jsx
import { useState, useEffect } from 'react'
import Header from '../../components/Header.jsx'
import {
  apiCarregarMaterias,
  apiAtualizarNotas,
  apiDeletarMateria,
  padGrades,
  calcSubject,
} from '../../Api.jsx'
import '../../style.css'

export default function ListaMaterias({ user, config, onConfigChange, onLogout }) {
  const [subjects, setSubjects]     = useState([])
  const [loading, setLoading]       = useState(true)
  const [toast, setToast]           = useState(null)
  const [editSub, setEditSub]       = useState(null)
  const [editGrades, setEditGrades] = useState([])

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(null), 3500)
  }

  // Carrega matérias ao entrar
  useEffect(() => {
    async function carregar() {
      setLoading(true)
      try {
        const data = await apiCarregarMaterias(user.username)
        setSubjects(data.map(s => ({
          ...s,
          grades: padGrades(s.grades, config.units),
        })))
      } catch (err) {
        showToast(`⚠ ${err.message}`)
      } finally {
        setLoading(false)
      }
    }
    carregar()
  }, [user.username])

  // Repadeia grades quando muda nº de unidades
  useEffect(() => {
    setSubjects(prev =>
      prev.map(s => ({ ...s, grades: padGrades(s.grades, config.units) }))
    )
  }, [config.units])

  function abrirEdicao(sub) {
    setEditSub(sub)
    setEditGrades([...sub.grades])
  }

  async function salvarEdicao() {
    try {
      await apiAtualizarNotas(editSub.id, editGrades, user.username)
      setSubjects(prev => prev.map(s =>
        s.id === editSub.id ? { ...s, grades: [...editGrades] } : s
      ))
      showToast(`✅ ${editSub.name} atualizada!`)
      setEditSub(null)
    } catch (err) {
      showToast(`⚠ ${err.message}`)
    }
  }

  async function handleDelete(sub) {
    if (!confirm(`Remover "${sub.name}"?`)) return
    try {
      await apiDeletarMateria(sub.id, user.username)
      setSubjects(prev => prev.filter(s => s.id !== sub.id))
      showToast(`🗑 ${sub.name} removida!`)
    } catch (err) {
      showToast(`⚠ ${err.message}`)
    }
  }

  const calcs     = subjects.map(s => calcSubject(s, config))
  const okCount   = calcs.filter(c => c.avg !== null && c.avg >= config.avgGoal).length
  const badCount  = calcs.filter(c => c.needed !== null && c.needed > config.maxGrade).length
  const avgs      = calcs.filter(c => c.avg !== null).map(c => c.avg)
  const globalAvg = avgs.length > 0
    ? (avgs.reduce((a, b) => a + b, 0) / avgs.length).toFixed(1)
    : '—'

  return (
    <>
      <Header user={user} onLogout={onLogout} />

      <div className="main">

        {/* ── CONFIG ── */}
        <div className="config-card">
          <div className="card-title">⚙ Configuração Escolar</div>
          <div className="config-grid">

            <div className="config-field">
              <label>Quantidade de Unidades</label>
              <select
                value={config.units}
                onChange={e => onConfigChange({ ...config, units: parseInt(e.target.value) })}
              >
                <option value={2}>2 Unidades</option>
                <option value={3}>3 Unidades</option>
                <option value={4}>4 Unidades</option>
              </select>
            </div>

            <div className="config-field">
              <label>Média para Aprovação</label>
              <input
                type="number"
                placeholder={String(config.avgGoal)}
                onFocus={e => e.target.select()}
                onBlur={e => {
                  const v = parseFloat(e.target.value)
                  if (!isNaN(v) && v > 0) onConfigChange({ ...config, avgGoal: v })
                  e.target.value = ''
                }}
              />
            </div>

            <div className="config-field">
              <label>Nota Máxima</label>
              <input
                type="number"
                placeholder={String(config.maxGrade)}
                onFocus={e => e.target.select()}
                onBlur={e => {
                  const v = parseFloat(e.target.value)
                  if (!isNaN(v) && v > 0) onConfigChange({ ...config, maxGrade: v })
                  e.target.value = ''
                }}
              />
            </div>

          </div>
        </div>

        {/* ── RESUMO ── */}
        {subjects.length > 0 && (
          <div className="summary-grid">
            <div className="summary-card blue">
              <div className="summary-label">Total</div>
              <div className="summary-value blue">{subjects.length}</div>
            </div>
            <div className="summary-card green">
              <div className="summary-label">Aprovadas</div>
              <div className="summary-value green">{okCount}</div>
            </div>
            <div className="summary-card red">
              <div className="summary-label">Em Risco</div>
              <div className="summary-value red">{badCount}</div>
            </div>
            <div className="summary-card yellow">
              <div className="summary-label">Média Geral</div>
              <div className="summary-value yellow">{globalAvg}</div>
            </div>
          </div>
        )}

        {/* ── TABELA ── */}
        <div className="section-header">
          <div className="section-title">
            <small>// suas matérias</small>
            Painel de Notas
          </div>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Matéria</th>
                {Array.from({ length: config.units }, (_, i) => (
                  <th key={i}>{i + 1}ª Unidade</th>
                ))}
                <th>Média Atual</th>
                <th>Meta</th>
                <th>Falta</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={config.units + 7}>
                  <div className="empty-state">
                    <div className="empty-icon">⏳</div>
                    <div className="empty-text">Carregando...</div>
                  </div>
                </td></tr>
              ) : subjects.length === 0 ? (
                <tr><td colSpan={config.units + 7}>
                  <div className="empty-state">
                    <div className="empty-icon">📚</div>
                    <div className="empty-text">Nenhuma matéria cadastrada ainda</div>
                    <div className="empty-sub">use a aba "Cadastrar" para adicionar</div>
                  </div>
                </td></tr>
              ) : subjects.map((sub, idx) => {
                const { avg, needed, lacking } = calcs[idx]

                let badgeClass = 'badge-warn', badgeText = 'Sem notas'
                let pctFill = 0, fillColor = 'var(--yellow)'

                if (avg !== null) {
                  if (avg >= config.avgGoal) {
                    badgeClass = 'badge-ok';  badgeText = '✓ Aprovado'
                    pctFill = 100;            fillColor = 'var(--green)'
                  } else if (needed !== null && needed > config.maxGrade) {
                    badgeClass = 'badge-bad'; badgeText = '✗ Crítico'
                    pctFill = (avg / config.avgGoal) * 100; fillColor = 'var(--red)'
                  } else {
                    badgeText = '⚡ Atenção'
                    pctFill = (avg / config.avgGoal) * 100; fillColor = 'var(--yellow)'
                  }
                }

                const avgDisplay  = avg !== null ? avg.toFixed(1) : '—'
                const lackDisplay = lacking !== null ? (lacking === 0 ? '✓' : lacking.toFixed(1)) : '—'
                const lackColor   = lacking === 0 ? 'var(--green)' : lacking === null ? 'var(--muted)' : 'var(--yellow)'

                return (
                  <tr key={sub.id}>
                    <td className="td-subject">{sub.name}</td>
                    {sub.grades.map((g, i) => (
                      <td key={i} className="td-mono" style={{ color: g !== null ? 'var(--text)' : 'var(--muted)' }}>
                        {g !== null ? g : '—'}
                      </td>
                    ))}
                    <td className="td-mono">
                      <div>{avgDisplay}</div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${Math.min(pctFill, 100)}%`, background: fillColor }} />
                      </div>
                    </td>
                    <td className="td-mono" style={{ color: 'var(--muted)' }}>{config.avgGoal}</td>
                    <td className="td-mono" style={{ color: lackColor }}>{lackDisplay}</td>
                    <td><span className={`badge ${badgeClass}`}>{badgeText}</span></td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      <button className="btn-icon edit" onClick={() => abrirEdicao(sub)} title="Editar">✏️</button>
                      <button className="btn-icon del"  onClick={() => handleDelete(sub)} title="Remover">🗑</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {editSub && (
        <div className="modal-overlay" onClick={() => setEditSub(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">✏️ Editar — {editSub.name}</div>
            <div className="config-grid">
              {editGrades.map((g, i) => (
                <div key={i} className="config-field">
                  <label>{i + 1}ª Unidade</label>
                  <input
                    type="number" min={0} max={config.maxGrade} step={0.1}
                    value={g ?? ''}
                    placeholder="—"
                    onChange={e => setEditGrades(gr => {
                      const n = [...gr]
                      n[i] = e.target.value === '' ? null : parseFloat(e.target.value)
                      return n
                    })}
                  />
                </div>
              ))}
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setEditSub(null)}>Cancelar</button>
              <button className="btn-save"   onClick={salvarEdicao}>Salvar</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </>
  )
}