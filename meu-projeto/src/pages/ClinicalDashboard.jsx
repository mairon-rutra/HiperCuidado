import React, { useEffect, useState } from 'react';
import { listarPacientesClinico, medicoSalvarMedicamento, medicoDeletarMedicamento } from '../services/api';

export default function ClinicalDashboard({ onBackToLogin }) {
  const [pacientes, setPacientes] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const [pacienteSelecionado, setPacienteSelecionado] = useState(null);
  const [nomeMed, setNomeMed] = useState('');
  const [dosagemMed, setDosagemMed] = useState('');
  const [horarioMed, setHorarioMed] = useState('');
  const [editandoId, setEditandoId] = useState(null);
  const [mensagemStatus, setMensagemStatus] = useState('');

  const carregarDados = async () => {
    const data = await listarPacientesClinico();
    setPacientes(data || []);
    setCarregando(false);
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const handleSalvarMedicamento = async (e) => {
    e.preventDefault();
    if (!pacienteSelecionado) return;

    const resp = await medicoSalvarMedicamento(pacienteSelecionado.cpf, {
      id: editandoId,
      nome: nomeMed,
      dosagem: dosagemMed,
      horario: horarioMed
    });

    if (resp && resp.sucesso) {
      setMensagemStatus('Medicamento salvo com sucesso!');
      setNomeMed('');
      setDosagemMed('');
      setHorarioMed('');
      setEditandoId(null);
      
      const novaLista = await listarPacientesClinico();
      setPacientes(novaLista);
      setPacienteSelecionado(novaLista.find(p => p.cpf === pacienteSelecionado.cpf));
    } else {
      setMensagemStatus('Erro ao salvar medicamento.');
    }
  };

  const handleRemoverMedicamento = async () => {
    if (!editandoId || !pacienteSelecionado) return;

    const resp = await medicoDeletarMedicamento(pacienteSelecionado.cpf, editandoId);
    if (resp && resp.sucesso) {
      setMensagemStatus('Medicamento removido com sucesso!');
      cancelarEdicao();

      const novaLista = await listarPacientesClinico();
      setPacientes(novaLista);
      setPacienteSelecionado(novaLista.find(p => p.cpf === pacienteSelecionado.cpf));
    } else {
      setMensagemStatus('Erro ao remover medicamento.');
    }
  };

  const iniciarEdicao = (med) => {
    setEditandoId(med.id);
    setNomeMed(med.nome);
    setDosagemMed(med.dosagem);
    setHorarioMed(med.horario);
    setMensagemStatus('');
  };

  const cancelarEdicao = () => {
    setEditandoId(null);
    setNomeMed('');
    setDosagemMed('');
    setHorarioMed('');
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '48px', paddingLeft: '12px', paddingRight: '12px', boxSizing: 'border-box', width: '100%' }}>
      
      {/* Header */}
      <div style={{ background: 'var(--card-bg)', padding: 'clamp(16px, 4vw, 24px) clamp(20px, 4vw, 32px)', borderRadius: '24px', border: '1px solid var(--border-color)', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', boxSizing: 'border-box', width: '100%' }}>
        <div style={{ minWidth: 0, flex: '1 1 250px' }}>
          <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#0284c7', textTransform: 'uppercase' }}>Painel Clinico</span>
          <h1 style={{ fontSize: 'clamp(22px, 4vw, 26px)', fontWeight: '900', margin: '4px 0', wordBreak: 'break-word' }}>Dr. Carlos Mendes</h1>
          <p style={{ fontSize: '13px', opacity: 0.7, margin: 0 }}>Gerenciamento de fichas e prescricoes médicas</p>
        </div>
        <button 
          onClick={onBackToLogin}
          style={{ padding: '10px 20px', backgroundColor: 'var(--border-color)', color: 'var(--text-main)', border: 'none', fontWeight: 'bold', borderRadius: '12px', fontSize: '13px', cursor: 'pointer' }}
        >
          Sair
        </button>
      </div>

      {/* Conteúdo Principal (Lista de Pacientes + Ficha) */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', width: '100%', boxSizing: 'border-box', alignItems: 'flex-start' }}>
        
        {/* Coluna da Esquerda: Lista de Pacientes */}
        <div style={{ flex: '1 1 280px', background: 'var(--card-bg)', padding: '20px', borderRadius: '24px', border: '1px solid var(--border-color)', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', boxSizing: 'border-box', minWidth: 0 }}>
          <h2 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 16px 0' }}>Pacientes</h2>
          {carregando ? (
            <p style={{ fontSize: '12px', opacity: 0.6 }}>Carregando...</p>
          ) : pacientes.length === 0 ? (
            <p style={{ fontSize: '12px', opacity: 0.6 }}>Nenhum paciente cadastrado.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', boxSizing: 'border-box' }}>
              {pacientes.map((p) => (
                <div 
                  key={p.cpf} 
                  onClick={() => { setPacienteSelecionado(p); cancelarEdicao(); setMensagemStatus(''); }}
                  style={{ padding: '12px', borderRadius: '14px', border: pacienteSelecionado?.cpf === p.cpf ? '2px solid #0284c7' : '1px solid var(--border-color)', backgroundColor: pacienteSelecionado?.cpf === p.cpf ? 'rgba(2, 132, 199, 0.05)' : 'var(--bg-color)', cursor: 'pointer', boxSizing: 'border-box', width: '100%' }}
                >
                  <h4 style={{ fontSize: '13px', fontWeight: 'bold', margin: '0 0 2px 0', wordBreak: 'break-word' }}>{p.nome}</h4>
                  <p style={{ fontSize: '11px', opacity: 0.7, margin: 0, wordBreak: 'break-all' }}>CPF: {p.cpf}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Coluna da Direita: Detalhes do Paciente / Prescrições */}
        <div style={{ flex: '2 1 420px', background: 'var(--card-bg)', padding: 'clamp(16px, 4vw, 24px)', borderRadius: '24px', border: '1px solid var(--border-color)', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', boxSizing: 'border-box', minWidth: 0, width: '100%' }}>
          {pacienteSelecionado ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', boxSizing: 'border-box' }}>
              
              <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', boxSizing: 'border-box' }}>
                <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#10b981', textTransform: 'uppercase' }}>Ficha Atualizada</span>
                <h2 style={{ fontSize: 'clamp(18px, 3vw, 20px)', fontWeight: '900', margin: '4px 0', wordBreak: 'break-word' }}>{pacienteSelecionado.nome}</h2>
                <p style={{ fontSize: '12px', opacity: 0.7, margin: 0, wordBreak: 'break-word' }}>E-mail: {pacienteSelecionado.email} | Idade: {pacienteSelecionado.idade} anos | Risco: {pacienteSelecionado.risco}</p>
              </div>

              <div>
                <h3 style={{ fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase', opacity: 0.7, margin: '0 0 10px 0' }}>Medicoes</h3>
                {pacienteSelecionado.metricas && pacienteSelecionado.metricas.length > 0 ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', width: '100%', boxSizing: 'border-box' }}>
                    {pacienteSelecionado.metricas.map(m => (
                      <div key={m.id} style={{ flex: '1 1 140px', padding: '12px', borderRadius: '14px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', boxSizing: 'border-box' }}>
                        <p style={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', opacity: 0.7, margin: '0 0 2px 0' }}>{m.tipo}</p>
                        <p style={{ fontSize: '15px', fontWeight: 'bold', margin: '0 0 2px 0', wordBreak: 'break-word' }}>{m.valor}</p>
                        <span style={{ fontSize: '10px', opacity: 0.6 }}>Status: {m.status}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: '12px', opacity: 0.6 }}>Nenhuma medicao.</p>
                )}
              </div>

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', boxSizing: 'border-box' }}>
                <h3 style={{ fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase', opacity: 0.7, margin: '0 0 10px 0' }}>Prescricao de Medicamentos</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px', width: '100%', boxSizing: 'border-box' }}>
                  {pacienteSelecionado.medicamentos && pacienteSelecionado.medicamentos.length > 0 ? (
                    pacienteSelecionado.medicamentos.map(med => (
                      <div key={med.id} style={{ padding: '12px', borderRadius: '14px', border: '1px solid var(--border-color)', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '8px', backgroundColor: 'var(--bg-color)', boxSizing: 'border-box', width: '100%' }}>
                        <div style={{ minWidth: 0, flex: '1 1 150px' }}>
                          <p style={{ fontSize: '13px', fontWeight: 'bold', margin: '0 0 2px 0', wordBreak: 'break-word' }}>{med.nome} - {med.dosagem}</p>
                          <p style={{ fontSize: '11px', opacity: 0.7, margin: 0 }}>Horario: {med.horario} | {med.tomado ? 'Tomado' : 'Pendente'}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => iniciarEdicao(med)}
                          style={{ padding: '6px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold', border: 'none', backgroundColor: '#e0f2fe', color: '#0369a1', cursor: 'pointer', whiteSpace: 'nowrap' }}
                        >
                          Editar
                        </button>
                      </div>
                    ))
                  ) : (
                    <p style={{ fontSize: '12px', opacity: 0.6 }}>Nenhum medicamento prescrito.</p>
                  )}
                </div>

                {/* Formulário de Medicamento */}
                <form onSubmit={handleSalvarMedicamento} style={{ padding: '16px', borderRadius: '16px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', display: 'flex', flexDirection: 'column', gap: '10px', boxSizing: 'border-box', width: '100%' }}>
                  <h4 style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', margin: 0 }}>
                    {editandoId ? 'Editar Medicamento' : 'Adicionar Novo Medicamento'}
                  </h4>

                  {mensagemStatus && <p style={{ fontSize: '11px', color: '#10b981', fontWeight: 'bold', margin: 0 }}>{mensagemStatus}</p>}

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', width: '100%', boxSizing: 'border-box' }}>
                    <input 
                      type="text" 
                      placeholder="Nome (ex: Losartana)"
                      value={nomeMed}
                      onChange={(e) => setNomeMed(e.target.value)}
                      style={{ flex: '1 1 120px', width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid var(--border-color)', fontSize: '12px', boxSizing: 'border-box' }}
                      required
                    />
                    <input 
                      type="text" 
                      placeholder="Modo de uso"
                      value={dosagemMed}
                      onChange={(e) => setDosagemMed(e.target.value)}
                      style={{ flex: '1 1 100px', width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid var(--border-color)', fontSize: '12px', boxSizing: 'border-box' }}
                      required
                    />
                    <input 
                      type="text" 
                      placeholder="Horario (08:00)"
                      value={horarioMed}
                      onChange={(e) => setHorarioMed(e.target.value)}
                      style={{ flex: '1 1 80px', width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid var(--border-color)', fontSize: '12px', boxSizing: 'border-box' }}
                      required
                    />
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px', width: '100%', boxSizing: 'border-box' }}>
                    <button type="submit" style={{ padding: '10px 16px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                      {editandoId ? 'Salvar Alteracoes' : 'Adicionar'}
                    </button>
                    {editandoId && (
                      <>
                        <button type="button" onClick={handleRemoverMedicamento} style={{ padding: '10px 16px', backgroundColor: '#fee2e2', color: '#991b1b', border: '1px solid #f87171', borderRadius: '10px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                          Remover Prescricao
                        </button>
                        <button type="button" onClick={cancelarEdicao} style={{ padding: '10px 16px', backgroundColor: 'var(--border-color)', color: 'var(--text-main)', border: 'none', borderRadius: '10px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                          Cancelar
                        </button>
                      </>
                    )}
                  </div>
                </form>
              </div>

            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 20px', opacity: 0.6 }}>
              <p style={{ fontSize: '14px' }}>Selecione um paciente na lista ao lado para ver a ficha e gerenciar prescricoes.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}