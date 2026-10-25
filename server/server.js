const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// acesso teste
let pacientesDB = {
  "12345678900": {
    nome: "Maria Silva",
    email: "maria@gmail.com",
    senha: "123",
    idade: 68,
    risco: "Moderado",
    metricas: [
      { id: 1, tipo: "Pressao Arterial", valor: "145/95 mmHg", status: "Atencao", data: "Hoje, 08:30" },
      { id: 2, tipo: "Glicemia em Jejum", valor: "110 mg/dL", status: "Normal", data: "Hoje, 08:30" },
      { id: 3, tipo: "Peso", valor: "72.5 kg", status: "Normal", data: "Ontem, 09:00" }
    ],
    medicamentos: [
      { id: 1, nome: "Losartana 50mg", dosagem: "1 comprimido ao acordar", horario: "08:00", tomado: true },
      { id: 2, nome: "Metformina 850mg", dosagem: "1 comprimido apos o almoco", horario: "12:00", tomado: false },
      { id: 3, nome: "Sinvastatina 20mg", dosagem: "1 comprimido antes de dormir", horario: "21:00", tomado: false }
    ]
  }
};

let medicoDB = {
  identificador: "medico@hospital.com",
  senha: "123",
  nome: "Dr. Carlos Mendes"
};

app.get('/api/status', (req, res) => {
  res.json({ mensagem: "Servidor rodando", timestamp: new Date() });
});

function encontrarPacienteKey(identificador) {
  if (!identificador) return null;
  const cleanId = identificador.trim().toLowerCase();
  const cleanIdNums = cleanId.replace(/\D/g, '');

  return Object.keys(pacientesDB).find(k => {
    const p = pacientesDB[k];
    const cleanKeyNums = k.replace(/\D/g, '');
    const matchCpf = cleanIdNums && cleanKeyNums === cleanIdNums;
    const matchEmail = p.email && p.email.toLowerCase() === cleanId;
    return matchCpf || matchEmail;
  });
}

// login paciente
app.post('/api/auth/paciente/login', (req, res) => {
  const { identificador, senha } = req.body;
  const key = encontrarPacienteKey(identificador);
  const paciente = key ? pacientesDB[key] : null;

  if (paciente && paciente.senha === senha) {
    res.json({ sucesso: true, cpf: key, ...paciente });
  } else {
    res.status(401).json({ erro: "Credenciais invalidas." });
  }
});

// registro paciente
app.post('/api/auth/paciente/registrar', (req, res) => {
  const { nome, cpf, email, senha, idade } = req.body; 
  if (!nome || !cpf || !email || !senha) {
    return res.status(400).json({ erro: "Todos os campos sao obrigatorios." });
  }

  const cpfLimpo = cpf.replace(/\D/g, '');
  if (cpfLimpo.length !== 11) {
    return res.status(400).json({ erro: "O CPF deve conter um número de cpf válido." });
  }

  if (!email.includes('@')) {
    return res.status(400).json({ erro: "O e-mail deve conter um endereco de e-mail válido." });
  }

  if (pacientesDB[cpfLimpo]) {
    return res.status(400).json({ erro: "Este CPF já está cadastrado." });
  }

  pacientesDB[cpfLimpo] = {
    nome: nome.trim(),
    email: email.trim().toLowerCase(),
    senha,
    idade: idade ? parseInt(idade, 10) || 0 : 0, 
    risco: "Baixo",
    metricas: [],
    medicamentos: []
  };

  res.status(201).json({ sucesso: true, cpf: cpfLimpo, ...pacientesDB[cpfLimpo] });
});

// login medico
app.post('/api/auth/medico/login', (req, res) => {
  const { identificador, senha } = req.body;
  const cleanId = identificador ? identificador.trim().toLowerCase() : '';
  if (cleanId === medicoDB.identificador && senha === medicoDB.senha) {
    res.json({ sucesso: true, nome: medicoDB.nome, perfil: 'clinical' });
  } else {
    res.status(401).json({ erro: "Credenciais de medico invalidas." });
  }
});

// listar pacientes pro medico
app.get('/api/clinico/pacientes', (req, res) => {
  const lista = Object.keys(pacientesDB).map((cpf, index) => {
    const p = pacientesDB[cpf];
    return {
      id: index + 1,
      nome: p.nome,
      email: p.email,
      cpf: cpf,
      idade: p.idade,
      risco: p.risco,
      metricas: p.metricas,
      medicamentos: p.medicamentos,
      alerta: p.metricas && p.metricas[0] ? `Ultima medicao: ${p.metricas[0].tipo} (${p.metricas[0].status})` : "Sem intercorrencias"
    };
  });
  res.json(lista);
});

// registrar nova medição
app.post('/api/pacientes/:cpf/metricas', (req, res) => {
  const { cpf } = req.params;
  const key = encontrarPacienteKey(cpf);
  const novaMetrica = req.body;

  if (key && pacientesDB[key]) {
    const metricasAtuais = pacientesDB[key].metricas.filter(m => m.tipo !== novaMetrica.tipo);
    metricasAtuais.unshift(novaMetrica);
    pacientesDB[key].metricas = metricasAtuais;

    res.status(201).json({ mensagem: "Medicao registrada com sucesso", metricas: pacientesDB[key].metricas });
  } else {
    res.status(404).json({ erro: "Paciente nao encontrado." });
  }
});

// alternar estado tomado do remedio do paciene
app.patch('/api/pacientes/:cpf/medicamentos/:id', (req, res) => {
  const { cpf, id } = req.params;
  const key = encontrarPacienteKey(cpf);

  if (key && pacientesDB[key]) {
    const med = pacientesDB[key].medicamentos.find(m => m.id == id);
    if (med) {
      med.tomado = !med.tomado;
      res.json({ sucesso: true, medicamentos: pacientesDB[key].medicamentos });
    } else {
      res.status(404).json({ erro: "Medicamento nao encontrado." });
    }
  } else {
    res.status(404).json({ erro: "Paciente nao encontrado." });
  }
});

// médico adiciona ou edita medicamento
app.post('/api/clinico/pacientes/:cpf/medicamentos', (req, res) => {
  const { cpf } = req.params;
  const key = encontrarPacienteKey(cpf);
  const { id, nome, dosagem, horario } = req.body;

  if (key && pacientesDB[key]) {
    if (id) {
      const med = pacientesDB[key].medicamentos.find(m => m.id == id);
      if (med) {
        if (nome) med.nome = nome;
        if (dosagem) med.dosagem = dosagem;
        if (horario) med.horario = horario;
      }
    } else {
      const novoMed = {
        id: Date.now(),
        nome: nome || "Medicamento",
        dosagem: dosagem || "1 comprimido",
        horario: horario || "08:00",
        tomado: false
      };
      pacientesDB[key].medicamentos.push(novoMed);
    }
    res.json({ sucesso: true, medicamentos: pacientesDB[key].medicamentos });
  } else {
    res.status(404).json({ erro: "Paciente nao encontrado." });
  }
});

// medico deleta medicamento
app.delete('/api/clinico/pacientes/:cpf/medicamentos/:id', (req, res) => {
  const { cpf, id } = req.params;
  const key = encontrarPacienteKey(cpf);

  if (key && pacientesDB[key]) {
    pacientesDB[key].medicamentos = pacientesDB[key].medicamentos.filter(m => m.id != id);
    res.json({ sucesso: true, medicamentos: pacientesDB[key].medicamentos });
  } else {
    res.status(404).json({ erro: "Paciente nao encontrado." });
  }
});

app.listen(PORT, '127.0.0.1', () => {
  console.log(`Servidor rodando em http://127.0.0.1:${PORT}`);
});