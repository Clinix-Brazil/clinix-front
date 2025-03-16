// interfaces.ts

export interface Paciente {
    id: number;
    nome: string;
    nomeUsuario: string;
    email: string;
    senha: string;
    cpf: string;
    rg: string;
    enabled: boolean;
    dataCadastro: string;
}

export interface Medico {
    id: number;
    nome: string;
    nomeUsuario: string;
    email: string;
    senha: string;
    cpf: string;
    rg: string;
    crm: string;
    inicioAtendimento: string;
    fimAtendimento: string;
    enabled: boolean;
    dataCadastro: string;
    especialidade: string;
}

export interface Gerente {
    id: number;
    nome: string;
    nomeUsuario: string;
    email: string;
    senha: string;
    cpf: string;
    rg: string;
    enabled: boolean;
    dataCadastro: string;
}

export interface HorarioAtendimento {
    id: number;
    horario: string;
    reservado: boolean;
    paciente?: string;
}

export interface Consulta {
    id: number;
    doctorName: string;
    dateTime: string;
    patientName: string;
    clinicName: string;
    status: string;
}

export interface Clinica {
    id: number;
    nomeFantasia: string;
    cnpj: string;
    tipo: string;
    gerenteId: number;
    telefone: string;
    horarioAbertura: string;
    horarioFechamento: string;
}