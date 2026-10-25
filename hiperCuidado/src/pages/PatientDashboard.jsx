import React, { useState } from 'react';
import { salvarNovaMedicao, toggleMedicamento } from '../services/api';

export default function PatientDashboard({ paciente, onLogout }) {
  const [metricas, setMetricas] = useState(paciente?.metricas || []);
  const [medicamentos, setMedicamentos] = useState(paciente?.medicamentos || []);
  
  const [tipoMedicao, setTipoMedicao] = useState('Pressao Arterial');
  const [valorMedicao, setValorMedicao] = useState('');
  const [salvando, setSalvando] = useState(false);

  const handleValorChange = (e) => {
    const apenasNumerosESimbolos = e.target.value.replace(/[a-zA-Z]/g, '');
    setValorMedicao(apenasNumerosESimbolos);
  };

  const adicionarMedicao = async (e) => {
    e.preventDefault();
    if (!valorMedicao) return;

    setSalvando(true);
    let status = 'Normal';
    const valNum = parseFloat(valorMedicao.replace(',', '.'));

    if (tipoMedicao === 'Pressao Arterial') {
      const sistolica = parseInt(valorMedicao.split('/')[0] || valNum);
      if (sistolica >= 140) status = 'Atencao';
      if (sistolica >= 160) status = 'Critico';
    } else if (tipoMedicao === 'Glicemia em Jejum') {
      if (valNum >= 100) status = 'Atencao';
      if (valNum >= 126) status = 'Critico';
    }

    const nova = {
      id: Date.now(),
      tipo: tipoMedicao,
      valor: tipoMedicao === 'Peso' ? `${valorMedicao} kg` : tipoMedicao === 'Glicemia em Jejum' ? `${valorMedicao} mg/dL` : valorMedicao,
      status: status,
      data: 'Agora mesmo'
    };

    const respostaServidor = await salvarNovaMedicao(paciente?.cpf, nova);
    setSalvando(false);

    if (respostaServidor && respostaServidor.metricas) {
      setMetricas(respostaServidor.metricas);
    } else {
      const filtrado = metricas.filter(m => m.tipo !== tipoMedicao);
      setMetricas([nova, ...filtrado]);
    }

    setValorMedicao('');
  };

  const handleToggleTomado = async (id) => {
    const resp = await toggleMedicamento(paciente?.cpf, id);
    if (resp && resp.medicamentos) {
      setMedicamentos(resp.medicamentos);
    } else {
      setMedicamentos(medicamentos.map(med => med.id === id ? { ...med, tomado: !med.tomado } : med));
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '48px', paddingLeft: '12px', paddingRight: '12px', boxSizing: 'border-box', width: '100%' }}>
      
      <div style={{ background: 'var(--card-bg)', padding: 'clamp(16px, 4vw, 24px) clamp(20px, 4vw, 32px)', borderRadius: '24px', border: '1px solid var(--border-color)', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', boxSizing: 'border-box', width: '100%' }}>
        <div style={{ minWidth: 0, flex: '1 1 250px' }}>
          <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#10b981', textTransform: 'uppercase' }}>Painel do Paciente</span>
          <h1 style={{ fontSize: 'clamp(22px, 4vw, 26px)', fontWeight: '900', margin: '4px 0', wordBreak: 'break-word' }}>Ola, {paciente?.nome || 'Paciente'}!</h1>
          <p style={{ fontSize: '13px', opacity: 0.7, margin: 0, wordBreak: 'break-all' }}>CPF: {paciente?.cpf || 'Nao informado'} | E-mail: {paciente?.email || 'Nao informado'}</p>
        </div>
        <button 
          onClick={onLogout}
          style={{ padding: '10px 20px', backgroundColor: 'var(--border-color)', color: 'var(--text-main)', border: 'none', fontWeight: 'bold', borderRadius: '12px', fontSize: '13px', cursor: 'pointer' }}
        >
          Sair / Voltar
        </button>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', width: '100%', boxSizing: 'border-box' }}>
        
        <div style={{ flex: '1 1 320px', background: 'var(--card-bg)', padding: 'clamp(16px, 4vw, 24px)', borderRadius: '24px', border: '1px solid var(--border-color)', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', minWidth: 0, boxSizing: 'border-box' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 4px 0' }}>Registrar Nova Medicao</h2>
          <p style={{ fontSize: '12px', opacity: 0.6, margin: '0 0 16px 0' }}>Substitui automaticamente a anterior do mesmo tipo.</p>
          
          <form onSubmit={adicionarMedicao} style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%', boxSizing: 'border-box' }}>
            <div style={{ width: '100%', boxSizing: 'border-box' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', opacity: 0.7, marginBottom: '6px' }}>Tipo de Medicao</label>
              <select 
                value={tipoMedicao} 
                onChange={(e) => setTipoMedicao(e.target.value)}
                style={{ width: '100%', boxSizing: 'border-box', padding: '12px', borderRadius: '14px', border: '2px solid var(--border-color)', fontSize: '13px', fontWeight: '600' }}
              >
                <option value="Pressao Arterial">Pressao Arterial (ex: 120/80)</option>
                <option value="Glicemia em Jejum">Glicemia em Jejum (ex: 95)</option>
                <option value="Peso">Peso (ex: 72.5)</option>
              </select>
            </div>

            <div style={{ width: '100%', boxSizing: 'border-box' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', opacity: 0.7, marginBottom: '6px' }}>Valor (Apenas numeros e simbolos)</label>
              <input 
                type="text" 
                placeholder={tipoMedicao === 'Pressao Arterial' ? '120/80' : 'Digite o valor'}
                value={valorMedicao}
                onChange={handleValorChange}
                style={{ width: '100%', boxSizing: 'border-box', padding: '12px', borderRadius: '14px', border: '2px solid var(--border-color)', fontSize: '13px', fontWeight: '600' }}
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={salvando}
              style={{ width: '100%', padding: '14px', backgroundColor: '#10b981', color: '#ffffff', border: 'none', fontWeight: 'bold', borderRadius: '14px', fontSize: '14px', cursor: 'pointer', marginTop: '4px', boxSizing: 'border-box' }}
            >
              {salvando ? 'Salvando...' : 'Salvar Medicao'}
            </button>
          </form>
        </div>

        <div style={{ flex: '1 1 320px', background: 'var(--card-bg)', padding: 'clamp(16px, 4vw, 24px)', borderRadius: '24px', border: '1px solid var(--border-color)', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', minWidth: 0, boxSizing: 'border-box' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 4px 0' }}>Seus Medicamentos</h2>
          <p style={{ fontSize: '12px', opacity: 0.6, margin: '0 0 16px 0' }}>Marque os medicamentos tomados.</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', boxSizing: 'border-box' }}>
            {medicamentos.length === 0 ? (
              <p style={{ fontSize: '13px', opacity: 0.6 }}>Nenhum medicamento cadastrado.</p>
            ) : (
              medicamentos.map((med) => (
                <div key={med.id} style={{ padding: '14px', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '8px', backgroundColor: 'var(--bg-color)', boxSizing: 'border-box', width: '100%' }}>
                  <div style={{ minWidth: 0, flex: '1 1 160px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: 'bold', margin: '0 0 2px 0', wordBreak: 'break-word' }}>{med.nome}</h4>
                    <p style={{ fontSize: '12px', opacity: 0.7, margin: 0 }}>{med.dosagem} | Horario: {med.horario}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleTomado(med.id)}
                    style={{ padding: '8px 12px', borderRadius: '10px', fontSize: '11px', fontWeight: 'bold', border: '1px solid var(--border-color)', backgroundColor: med.tomado ? '#d1fae5' : 'var(--card-bg)', color: med.tomado ? '#065f46' : 'var(--text-main)', cursor: 'pointer', whiteSpace: 'nowrap' }}
                  >
                    {med.tomado ? 'Tomado' : 'Marcar Tomado'}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      <div style={{ background: 'var(--card-bg)', padding: 'clamp(16px, 4vw, 24px)', borderRadius: '24px', border: '1px solid var(--border-color)', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', boxSizing: 'border-box', width: '100%' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 16px 0' }}>Historico de Medicoes</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', boxSizing: 'border-box' }}>
          {metricas.length === 0 ? (
            <p style={{ fontSize: '13px', opacity: 0.6 }}>Nenhuma medicao registrada ainda.</p>
          ) : (
            metricas.map((m) => (
              <div key={m.id} style={{ padding: '16px', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '8px', backgroundColor: 'var(--bg-color)', boxSizing: 'border-box', width: '100%' }}>
                <div style={{ minWidth: 0, flex: '1 1 180px' }}>
                  <p style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', opacity: 0.7, margin: '0 0 2px 0' }}>{m.tipo}</p>
                  <p style={{ fontSize: '18px', fontWeight: '900', margin: '0 0 2px 0', wordBreak: 'break-word' }}>{m.valor}</p>
                  <span style={{ fontSize: '11px', opacity: 0.6 }}>{m.data}</span>
                </div>
                <span style={{ padding: '6px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: '900', backgroundColor: m.status === 'Normal' ? '#d1fae5' : m.status === 'Atencao' ? '#fef3c7' : '#fee2e2', color: m.status === 'Normal' ? '#065f46' : m.status === 'Atencao' ? '#92400e' : '#991b1b', whiteSpace: 'nowrap' }}>
                  {m.status}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}