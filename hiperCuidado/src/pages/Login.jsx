import React, { useState } from 'react';
import { loginPaciente, registrarPaciente, loginMedico } from '../services/api';

export default function Login({ onLoginSuccess, onGoToClinical }) {
  const [modo, setModo] = useState('login-paciente');
  
  const [identificador, setIdentificador] = useState('');
  const [senha, setSenha] = useState('');
  
  const [nomeReg, setNomeReg] = useState('');
  const [cpfReg, setCpfReg] = useState('');
  const [emailReg, setEmailReg] = useState('');
  const [senhaReg, setSenhaReg] = useState('');
  const [idadeReg, setIdadeReg] = useState('');

  const [erro, setErro] = useState('');
  const [sucessoMsg, setSucessoMsg] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleLoginPacienteSubmit = async (e) => {
    e.preventDefault();
    setCarregando(true);
    setErro('');

    const resultado = await loginPaciente(identificador, senha);
    setCarregando(false);

    if (resultado && resultado.sucesso) {
      onLoginSuccess(resultado);
    } else {
      setErro('CPF, e-mail ou senha incorretos. Exemplo para Maria: 12345678900 / 123');
    }
  };

  const handleRegistrarSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setSucessoMsg('');

    const cpfLimpo = cpfReg.replace(/\D/g, '');
    if (cpfLimpo.length !== 11) {
      setErro('O CPF deve conter exatamente 11 numeros.');
      return;
    }

    if (!emailReg.includes('@')) {
      setErro('O e-mail deve conter um endereco de e-mail válido.');
      return;
    }

    setCarregando(true);
    const resultado = await registrarPaciente({
      nome: nomeReg,
      cpf: cpfLimpo,
      email: emailReg,
      senha: senhaReg,
      idade: idadeReg 
    });
    setCarregando(false);

    if (resultado.sucesso) {
      setSucessoMsg('Conta criada com sucesso! Faca login.');
      setModo('login-paciente');
      setIdentificador(cpfLimpo);
      setSenha(senhaReg);
    } else {
      setErro(resultado.erro || 'Erro ao criar conta.');
    }
  };

  const handleLoginMedicoSubmit = async (e) => {
    e.preventDefault();
    setCarregando(true);
    setErro('');

    const resultado = await loginMedico(identificador, senha);
    setCarregando(false);

    if (resultado && resultado.sucesso) {
      onGoToClinical();
    } else {
      setErro('Acesso negado. Use medico@hospital.com / 123');
    }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div style={{ width: '100%', maxWidth: '420px', padding: '32px', borderRadius: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.08)', border: '1px solid var(--border-color)', backgroundColor: 'var(--card-bg)', position: 'relative' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '800', margin: '0 0 8px 0' }}>Diario Digital de Saude</h2>
          <p style={{ fontSize: '13px', opacity: 0.7, margin: 0 }}>Acompanhamento e conexao direta com a equipe medica.</p>
        </div>

        <div style={{ display: 'flex', background: 'var(--border-color)', padding: '4px', borderRadius: '14px', marginBottom: '24px' }}>
          <button 
            type="button"
            onClick={() => { setModo('login-paciente'); setErro(''); }}
            style={{ flex: 1, padding: '10px', borderRadius: '10px', border: 'none', background: modo === 'login-paciente' ? 'var(--card-bg)' : 'transparent', fontWeight: 'bold', fontSize: '12px', color: 'var(--text-main)', cursor: 'pointer' }}
          >
            Entrar
          </button>
          <button 
            type="button"
            onClick={() => { setModo('registrar'); setErro(''); }}
            style={{ flex: 1, padding: '10px', borderRadius: '10px', border: 'none', background: modo === 'registrar' ? 'var(--card-bg)' : 'transparent', fontWeight: 'bold', fontSize: '12px', color: 'var(--text-main)', cursor: 'pointer' }}
          >
            Criar Conta
          </button>
          <button 
            type="button"
            onClick={() => { setModo('login-medico'); setErro(''); }}
            style={{ flex: 1, padding: '10px', borderRadius: '10px', border: 'none', background: modo === 'login-medico' ? 'var(--card-bg)' : 'transparent', fontWeight: 'bold', fontSize: '12px', color: 'var(--text-main)', cursor: 'pointer' }}
          >
            Medico
          </button>
        </div>

        {erro && (
          <div style={{ padding: '12px', marginBottom: '16px', borderRadius: '12px', backgroundColor: '#fee2e2', color: '#991b1b', fontSize: '12px', fontWeight: '600' }}>
            {erro}
          </div>
        )}
        {sucessoMsg && (
          <div style={{ padding: '12px', marginBottom: '16px', borderRadius: '12px', backgroundColor: '#d1fae5', color: '#065f46', fontSize: '12px', fontWeight: '600' }}>
            {sucessoMsg}
          </div>
        )}

        {modo === 'login-paciente' && (
          <form onSubmit={handleLoginPacienteSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', opacity: 0.7, marginBottom: '6px' }}>CPF ou E-mail:</label>
              <input 
                type="text" 
                placeholder="12345678900 ou maria@gmail.com"
                value={identificador}
                onChange={(e) => setIdentificador(e.target.value)}
                style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', border: '2px solid var(--border-color)', fontSize: '14px', boxSizing: 'border-box' }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', opacity: 0.7, marginBottom: '6px' }}>Senha:</label>
              <input 
                type="password" 
                placeholder="Sua senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', border: '2px solid var(--border-color)', fontSize: '14px', boxSizing: 'border-box' }}
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={carregando}
              style={{ width: '100%', padding: '14px', borderRadius: '14px', border: 'none', backgroundColor: '#10b981', color: '#ffffff', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', marginTop: '8px' }}
            >
              {carregando ? 'Entrando...' : 'Entrar no Diario'}
            </button>
            <p style={{ fontSize: '11px', opacity: 0.6, textAlign: 'center', margin: '4px 0 0 0' }}>Teste Maria: CPF 12345678900 | Senha 123</p>
          </form>
        )}

        {modo === 'registrar' && (
          <form onSubmit={handleRegistrarSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', opacity: 0.7, marginBottom: '4px' }}>Nome Completo:</label>
              <input 
                type="text" 
                placeholder="Seu nome"
                value={nomeReg}
                onChange={(e) => setNomeReg(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '2px solid var(--border-color)', fontSize: '13px', boxSizing: 'border-box' }}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '8px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', opacity: 0.7, marginBottom: '4px' }}>CPF (11 digitos):</label>
                <input 
                  type="text" 
                  placeholder="Apenas numeros"
                  value={cpfReg}
                  onChange={(e) => setCpfReg(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '12px', border: '2px solid var(--border-color)', fontSize: '13px', boxSizing: 'border-box' }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', opacity: 0.7, marginBottom: '4px' }}>Idade:</label>
                <input 
                  type="number" 
                  placeholder="Ex: 30"
                  value={idadeReg}
                  onChange={(e) => setIdadeReg(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '12px', border: '2px solid var(--border-color)', fontSize: '13px', boxSizing: 'border-box' }}
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', opacity: 0.7, marginBottom: '4px' }}>E-mail:</label>
              <input 
                type="text" 
                placeholder="email@exemplo.com"
                value={emailReg}
                onChange={(e) => setEmailReg(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '2px solid var(--border-color)', fontSize: '13px', boxSizing: 'border-box' }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', opacity: 0.7, marginBottom: '4px' }}>Senha:</label>
              <input 
                type="password" 
                placeholder="Crie uma senha"
                value={senhaReg}
                onChange={(e) => setSenhaReg(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '2px solid var(--border-color)', fontSize: '13px', boxSizing: 'border-box' }}
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={carregando}
              style={{ width: '100%', padding: '14px', borderRadius: '14px', border: 'none', backgroundColor: '#10b981', color: '#ffffff', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', marginTop: '8px' }}
            >
              {carregando ? 'Criando Conta...' : 'Cadastrar Paciente'}
            </button>
          </form>
        )}

        {modo === 'login-medico' && (
          <form onSubmit={handleLoginMedicoSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', opacity: 0.7, marginBottom: '6px' }}>E-mail ou CPF do Medico:</label>
              <input 
                type="text" 
                placeholder="medico@hospital.com"
                value={identificador}
                onChange={(e) => setIdentificador(e.target.value)}
                style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', border: '2px solid var(--border-color)', fontSize: '14px', boxSizing: 'border-box' }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', opacity: 0.7, marginBottom: '6px' }}>Senha:</label>
              <input 
                type="password" 
                placeholder="Senha profissional"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', border: '2px solid var(--border-color)', fontSize: '14px', boxSizing: 'border-box' }}
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={carregando}
              style={{ width: '100%', padding: '14px', borderRadius: '14px', border: 'none', backgroundColor: '#0284c7', color: '#ffffff', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', marginTop: '8px' }}
            >
              {carregando ? 'Entrando...' : 'Acessar Painel Clinico'}
            </button>
            <p style={{ fontSize: '11px', opacity: 0.6, textAlign: 'center', margin: '4px 0 0 0' }}>Acesso: medico@hospital.com | Senha 123</p>
          </form>
        )}

      </div>
    </div>
  );
}