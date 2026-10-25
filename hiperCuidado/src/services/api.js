const API_URL = "http://127.0.0.1:3001/api";

// faz o login do paciente enviando identificador e senha
export async function loginPaciente(identificador, senha) {
  try {
    const response = await fetch(`${API_URL}/auth/paciente/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identificador, senha }),
      cache: 'no-store'
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    return null;
  }
}

// cadastra um novo paciente
export async function registrarPaciente(dados) {
  try {
    const response = await fetch(`${API_URL}/auth/paciente/registrar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados),
      cache: 'no-store'
    });
    const data = await response.json();
    if (!response.ok) return { erro: data.erro || 'Erro ao registrar' };
    return data;
  } catch (error) {
    return { erro: 'Erro de conexao com o servidor' };
  }
}

// faz o login do medico
export async function loginMedico(identificador, senha) {
  try {
    const response = await fetch(`${API_URL}/auth/medico/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identificador, senha }),
      cache: 'no-store'
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    return null;
  }
}

// salva uma nova medicao de saude para o cpf do paciente informado
export async function salvarNovaMedicao(cpf, novaMetrica) {
  try {
    const response = await fetch(`${API_URL}/pacientes/${encodeURIComponent(cpf)}/metricas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novaMetrica),
      cache: 'no-store'
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    return null;
  }
}

// alterna o status de tomado do medicamento do paciente
export async function toggleMedicamento(cpf, id) {
  try {
    const response = await fetch(`${API_URL}/pacientes/${encodeURIComponent(cpf)}/medicamentos/${id}`, {
      method: 'PATCH',
      cache: 'no-store'
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    return null;
  }
}

// busca a lista completa de pacientes para a visao do medico
export async function listarPacientesClinico() {
  try {
    const response = await fetch(`${API_URL}/clinico/pacientes`, { cache: 'no-store' });
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    return [];
  }
}

// permite ao medico adicionar ou editar um medicamento do paciente
export async function medicoSalvarMedicamento(cpf, medData) {
  try {
    const response = await fetch(`${API_URL}/clinico/pacientes/${encodeURIComponent(cpf)}/medicamentos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(medData),
      cache: 'no-store'
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    return null;
  }
}

// permite ao medico excluir um medicamento da lista do paciente
export async function medicoDeletarMedicamento(cpf, id) {
  try {
    const response = await fetch(`${API_URL}/clinico/pacientes/${encodeURIComponent(cpf)}/medicamentos/${id}`, {
      method: 'DELETE',
      cache: 'no-store'
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    return null;
  }
}