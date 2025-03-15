// apiRoutes.ts

const BASE_URL = 'http://localhost:';
const PORT_USER = '8080'; // Porta Usuario
const PORT_CLINIC = '8081'; // Porta Clinica
const PORT_SCHEDULING = '8082'; // Porta Agendamento
const USERS_PATH = '/clinixSistemaUsuarios'; //Nome do serviço de usuários
const SCHEDULING_PATH = '/clinix-scheduling-service'; //Nome do serviço de agendamento
const CLINIC_PATH = '/clinixServiceClinica'; //Nome do serviço de clinica

export const CREATE_USUARIO = () => `${BASE_URL}${PORT_USER}${USERS_PATH}/usuario/save`;
export const LIST_USUARIO = () => `${BASE_URL}${USERS_PATH}${PORT_USER}/usuario/list`;
export const UPDATE_USUARIO = (id: number) => `${BASE_URL}${USERS_PATH}${PORT_USER}${id}`;
export const DELETE_USUARIO = (id: number) => `${BASE_URL}${USERS_PATH}${PORT_USER}${id}`;
export const BUSCAR_USUARIO = (id: number) => `${BASE_URL}${USERS_PATH}${PORT_USER}/usuario/buscar/${id}`; // TODO: Implementar no back-end.

export const CREATE_PACIENTE = () => `${BASE_URL}${PORT_USER}${USERS_PATH}/paciente/save`;
export const LIST_PACIENTE = () => `${BASE_URL}${PORT_USER}${USERS_PATH}/paciente/list`;
export const UPDATE_PACIENTE = (id: number) => `${BASE_URL}${PORT_USER}${USERS_PATH}/paciente/${id}`;
export const DELETE_PACIENTE = (id: number) => `${BASE_URL}${PORT_USER}${USERS_PATH}/paciente/${id}`;


export const CREATE_MEDICO = () => `${BASE_URL}${PORT_USER}${USERS_PATH}/medico/save`;
export const LIST_MEDICO = () => `${BASE_URL}${PORT_USER}${USERS_PATH}/medico/list`;
export const UPDATE_MEDICO = (id: number) => `${BASE_URL}${PORT_USER}${USERS_PATH}/medico/${id}`;
export const DELETE_MEDICO = (id: number) => `${BASE_URL}${PORT_USER}${USERS_PATH}/medico/${id}`;

export const CREATE_GERENTE = () => `${BASE_URL}${PORT_USER}${USERS_PATH}/gerente/save`;
export const LIST_GERENTE = () => `${BASE_URL}${PORT_USER}${USERS_PATH}/gerente/list`;
export const UPDATE_GERENTE = (id: number) => `${BASE_URL}${PORT_USER}${USERS_PATH}/gerente/${id}`;
export const DELETE_GERENTE = (id: number) => `${BASE_URL}${PORT_USER}${USERS_PATH}/gerente/${id}`;

//Clinicas
export const CREATE_CLINICA = () => `${BASE_URL + PORT_CLINIC + CLINIC_PATH}/clinicas`;
export const LIST_CLINICA = () => `${BASE_URL + PORT_CLINIC + CLINIC_PATH}/clinicas`;
export const UPDATE_CLINICA = (id: number) => `${BASE_URL + PORT_CLINIC + CLINIC_PATH}/clinicas/${id}`;
export const DELETE_CLINICA = (id: number) => `${BASE_URL + PORT_CLINIC + CLINIC_PATH}/clinicas/${id}`;
export const BUSCAR_CLINICA = (id: number) => `${BASE_URL + PORT_CLINIC + CLINIC_PATH}/clinicas/${id}`;

//Vinculos de Clinica
export const SOLICITACOES_VINCULO = (c_id:number) => `${BASE_URL + PORT_CLINIC}/vinculos/solicitacoes/${c_id}`;
export const ATIVOS_VINCULO = (c_id:number) => `${BASE_URL + PORT_CLINIC}/vinculos/${c_id}`;
export const SOLICITAR_VINCULO = (c_id:number, m_id:number) => `${BASE_URL + PORT_CLINIC}/vinculos/solicitar/${c_id}/${m_id}`;
export const RECUSAR_VINCULO = (c_id:number, m_id:number) => `${BASE_URL + PORT_CLINIC}/vinculos/recusar/${c_id}/${m_id}`;
export const VINCULAR_CLINICA = (c_id:number, m_id:number) => `${BASE_URL + PORT_CLINIC}/vinculos/vincular/${c_id}/${m_id}`;
export const DESVINCULAR_CLINICA = (c_id:number, m_id:number) => `${BASE_URL + PORT_CLINIC}/vinculos/desvincular/${c_id}/${m_id}`;


//Agendamentos
export const CREATE_AGENDAMENTO = () => `${BASE_URL +  PORT_SCHEDULING + SCHEDULING_PATH}/appointment/save`;
export const LIST_AGENDAMENTO = () => `${BASE_URL +  PORT_SCHEDULING + SCHEDULING_PATH}/appointment/list`;
export const UPDATE_AGENDAMENTO = (id: number) => `${BASE_URL +  PORT_SCHEDULING + SCHEDULING_PATH}/appointment/atualizar/${id}`;
export const DELETE_AGENDAMENTO = (id: number) => `${BASE_URL +  PORT_SCHEDULING + SCHEDULING_PATH}/appointment/deletar/${id}+`;
export const BUSCAR_AGENDAMENTO = (id: number) => `${BASE_URL +  PORT_SCHEDULING + SCHEDULING_PATH}/appointment/buscar/${id}`;

//Especialidades médicas
export const LIST_ESPECIALIDADES = () => `${BASE_URL}${PORT_USER}${USERS_PATH}/medico/especialidades`;