import {
    Typography, Box,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    IconButton,
    Modal,
    Button,
    TextField,
    styled,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Grid,
    Tabs,
    Tab,
    SelectChangeEvent,
} from '@mui/material';
import DashboardCard from '@/app/(DashboardLayout)//components/shared/DashboardCard';
import { useEffect, useState } from 'react';
import { Delete, Edit, Add, Link, Event, Check, Close } from '@mui/icons-material'; // Importe os ícones Check e Close
import { LIST_CLINICA, UPDATE_CLINICA, DELETE_CLINICA, CREATE_CLINICA, LIST_PACIENTE, LIST_MEDICO, LIST_GERENTE, SOLICITAR_VINCULO, SOLICITACOES_VINCULO, ACEITAR_VINCULO, RECUSAR_VINCULO, VINCULAR_CLINICA } from '../APIroutes';
import { Clinica, Gerente, Medico, Paciente, Solicitacao } from '../interfaces';
import { useTheme } from '@mui/material/styles';
import Image from 'next/image';

// Estilização para a linha da tabela com hover
const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:hover': {
        backgroundColor: theme.palette.action.hover,
        cursor: 'pointer',
    },
}));

// Definição dos tipos de clínica
const tiposClinica = [
    "HOSPITAL",
    "CLINICA_GERAL",
    "ESPECIALIZADA",
    "URGENCIA"
];

// Interface para Omit<Clinica, 'id'> com os tipos corretos
interface NewClinica extends Omit<Clinica, 'id'> {
    tipo: string;
    gerenteId: number;
    medicos: number[];
    gerentes: number[];
    pacientes: number[];
}

const ListagemClinicas = () => {
    const theme = useTheme();

    const [clinicas, setClinicas] = useState<Clinica[]>([]);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [clinicaEdit, setClinicaEdit] = useState<Clinica | null>(null);
    const [clinicaDelete, setClinicaDelete] = useState<Clinica | null>(null);
    const [openClinicDetails, setOpenClinicDetails] = useState(false);
    const [selectedClinicDetails, setSelectedClinicDetails] = useState<Clinica | null>(null);
    const [openVinculos, setOpenVinculos] = useState(false); // Estado para o modal de vínculos
    const [tabValue, setTabValue] = useState(0); // Estado para controlar a aba ativa

    const [gerentes, setGerentes] = useState<Gerente[]>([]);
    const [medicos, setMedicos] = useState<Medico[]>([]);
    const [pacientes, setPacientes] = useState<Paciente[]>([]);
    const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);

    const [selectedGerente, setSelectedGerente] = useState<number | null>(null);
    const [selectedMedico, setSelectedMedico] = useState<number | null>(null);
    const [selectedPaciente, setSelectedPaciente] = useState<number | null>(null);
    const [selectedSolicitacao, setSelectedSolicitacao] = useState<number | null>(null);

    const [openAdd, setOpenAdd] = useState(false);
    const [newClinica, setNewClinica] = useState<NewClinica>({
        nomeFantasia: '',
        cnpj: '',
        telefone: '',
        horarioAbertura: '',
        horarioFechamento: '',
        tipo: 'CLINICA_GERAL', // Valor padrão para o tipo
        gerenteId: 1, // Valor padrão para o ID do gerente
        medicos: [] as number[],
        gerentes: [] as number[],
        pacientes: [] as number[],
    });

    useEffect(() => {
        fetch(LIST_CLINICA())
            .then((response) => response.json())
            .then((data) => {
                setClinicas(data);
            })
            .catch((error) => console.error('Erro ao buscar clinicas:', error));
    }, []);

    const handleEditClick = (clinica: Clinica) => {
        setClinicaEdit(clinica);
        setOpenEdit(true);
    };

    const handleDeleteClick = (clinica: Clinica) => {
        setClinicaDelete(clinica);
        setOpenDelete(true);
    };

    const handleSave = () => {
        if (clinicaEdit) {
            fetch(
                UPDATE_CLINICA(clinicaEdit.id),
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(clinicaEdit),
                }
            )
                .then((response) => response.json())
                .then((updatedClinica) => {
                    setClinicas(prevClinicas =>
                        prevClinicas.map((clinica) =>
                            clinica.id === updatedClinica.id ? updatedClinica : clinica
                        )
                    );
                    setOpenEdit(false);
                })
                .catch((error) => console.error('Erro ao atualizar clinica:', error));
        }
    };

    const handleDelete = () => {
        if (clinicaDelete) {
            fetch(
                DELETE_CLINICA(clinicaDelete.id),
                {
                    method: 'DELETE',
                }
            )
                .then(() => {
                    setClinicas(clinicas.filter((clinica) => clinica.id !== clinicaDelete.id));
                    setOpenDelete(false);
                })
                .catch((error) => console.error('Erro ao excluir clinica:', error));
        }
    };

    const handleOpenClinicDetails = (clinica: Clinica) => {
        setSelectedClinicDetails(clinica);
        setOpenClinicDetails(true);
    };

    const handleCloseClinicDetails = () => {
        setOpenClinicDetails(false);
        setSelectedClinicDetails(null);
    };

    const handleOpenAddModal = () => {
        setOpenAdd(true);
    };

    const handleCloseAddModal = () => {
        setOpenAdd(false);
        setNewClinica(
            {
                nomeFantasia: '',
                cnpj: '',
                telefone: '',
                horarioAbertura: '',
                horarioFechamento: '',
                tipo: 'CLINICA_GERAL',
                gerenteId: 1,
                medicos: [] as number[],
                gerentes: [] as number[],
                pacientes: [] as number[],
            });
    };

    const handleAddClinica = () => {
        fetch(CREATE_CLINICA(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newClinica),
        })
            .then(response => response.json())
            .then(data => {
                setClinicas([...clinicas, data]);
                handleCloseAddModal();
            })
            .catch(error => console.error('Erro ao adicionar clínica:', error));
    };

    const handleOpenVinculosModal = () => {
        // Carrega os dados dos usuários quando o modal é aberto
        Promise.all([
            fetch(LIST_GERENTE()).then(response => response.json()),
            fetch(LIST_MEDICO()).then(response => response.json()),
            fetch(LIST_PACIENTE()).then(response => response.json()),
            fetch(SOLICITACOES_VINCULO(selectedClinicDetails!.id)).then(response => response.json()),
        ])
            .then(([gerentesData, medicosData, pacientesData, vinculosData]) => {
                setGerentes(gerentesData);
                setMedicos(medicosData);
                setPacientes(pacientesData);
                setSolicitacoes(vinculosData);
                setOpenVinculos(true);
            })
            .catch(error => console.error('Erro ao buscar dados de usuários:', error));
    };

    const handleCloseVinculosModal = () => {
        setOpenVinculos(false);
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleGerenteChange = (event: SelectChangeEvent<number>) => {
        setSelectedGerente(event.target.value as number);
    };

    const handleMedicoChange = (event: SelectChangeEvent<number>) => {
        setSelectedMedico(event.target.value as number);
    };

    const handlePacienteChange = (event: SelectChangeEvent<number>) => {
        setSelectedPaciente(event.target.value as number);
    };

    const handleSolicitacaoChange = (event: SelectChangeEvent<number>) => {
        setSelectedSolicitacao(event.target.value as number);
    }

    const handleAceitarVinculo = (solicitacao: Solicitacao) => {
        console.log(solicitacao);
        const clinicaId = selectedClinicDetails!.id;  // Garante que selectedClinicDetails existe

        fetch(ACEITAR_VINCULO(clinicaId, solicitacao.medicoId), {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao aceitar vínculo');
                }
                // Atualizar a lista de solicitações após a aceitação
                setSolicitacoes(prevSolicitacoes =>
                    prevSolicitacoes.filter(s => s.id !== solicitacao.id)
                );
            })
            .catch(error => console.error('Erro ao aceitar vínculo:', error));
    };

    const handleRecusarVinculo = (solicitacao: Solicitacao) => {
        console.log(solicitacao);
        const clinicaId = selectedClinicDetails!.id;  // Garante que selectedClinicDetails existe
        console.log(clinicaId);
        fetch(RECUSAR_VINCULO(clinicaId, solicitacao.medicoId), {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao recusar vínculo');
                }
                // Atualizar a lista de solicitações após a recusa
                setSolicitacoes(prevSolicitacoes =>
                    prevSolicitacoes.filter(s => s.id !== solicitacao.id)
                );
            })
            .catch(error => console.error('Erro ao recusar vínculo:', error));
    };

    const handleSaveVinculos = () => {
        if (selectedClinicDetails) {
            let selectedId: number | null = null;
            switch (tabValue) {
                case 0: // Gerentes
                    selectedId = selectedGerente;
                    break;
                case 1: // Medicos
                    selectedId = selectedMedico;
                    break;
                case 2: // Pacientes
                    selectedId = selectedPaciente;
                    break;
                default:
                    break;
            }

            const requestBody = {
                clinicaId: selectedClinicDetails.id,
                usuarioId: selectedId,
            };

            fetch(VINCULAR_CLINICA(requestBody.clinicaId, requestBody.usuarioId), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            })
                .then(response => response.json())
                .then(updatedClinica => {
                    // Atualizar a clínica no estado local
                    setClinicas(prevClinicas =>
                        prevClinicas.map(clinica =>
                            clinica.id === updatedClinica.id ? updatedClinica : clinica
                        )
                    );
                    // Fechar o modal
                    handleCloseVinculosModal();
                })
                .catch(error => console.error('Erro ao atualizar vínculos da clínica:', error));
        }
    };

    return (
        <DashboardCard title='Listagem geral de clinicas'>
            <>
                <Button variant='contained' color='primary' startIcon={<Add />} onClick={handleOpenAddModal}>
                    Adicionar nova clínica
                </Button>
                <>
                    <Box sx={{ overflow: 'auto', width: { xs: '280px', sm: 'auto' } }}>
                        <Table aria-label='simple table' sx={{ whiteSpace: 'nowrap', mt: 2 }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Nome</TableCell>
                                    <TableCell>CNPJ</TableCell>
                                    <TableCell>Telefone</TableCell>
                                    <TableCell>Horário abertura</TableCell>
                                    <TableCell>Horário fechamento</TableCell>
                                    <TableCell align='right'>Ações</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {clinicas.map((clinica) => (
                                    <StyledTableRow key={clinica.id} onClick={() => handleOpenClinicDetails(clinica)}>
                                        <TableCell>{clinica.nomeFantasia}</TableCell>
                                        <TableCell>{clinica.cnpj}</TableCell>
                                        <TableCell>{clinica.telefone}</TableCell>
                                        <TableCell>{clinica.horarioAbertura}</TableCell>
                                        <TableCell>{clinica.horarioFechamento}</TableCell>
                                        <TableCell align='right'>
                                            <IconButton
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Impede que o evento de clique na linha seja disparado
                                                    handleEditClick(clinica);
                                                }}
                                                color='primary'
                                            >
                                                <Edit />
                                            </IconButton>
                                            <IconButton
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Impede que o evento de clique na linha seja disparado
                                                    handleDeleteClick(clinica);
                                                }}
                                                color='error'
                                            >
                                                <Delete />
                                            </IconButton>
                                        </TableCell>
                                    </StyledTableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Box>
                    {/* Modal para exibir detalhes da clínica */}
                    <Modal
                        open={openClinicDetails}
                        onClose={handleCloseClinicDetails}
                        aria-labelledby='modal-modal-title'
                        aria-describedby='modal-modal-description'
                    >
                        <Box sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '60%', // Ocupa 60% da tela
                            height: '70%', // Ocupa 70% da tela
                            bgcolor: theme.palette.background.paper,
                            border: `1px solid ${theme.palette.divider}`, // Borda mais suave
                            borderRadius: '8px',
                            boxShadow: theme.shadows[5],
                            p: 4,
                            display: 'flex',
                            flexDirection: 'column', // Garante que os botões fiquem abaixo das informações
                        }}>
                            {selectedClinicDetails && (
                                <>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sx={{ textAlign: 'center', mb: 2 }}>
                                            <Typography variant='h4'>
                                            Detalhes da clínica: <br />
                                            </Typography>
                                            <Typography variant='h4' fontWeight='bold'>
                                            {selectedClinicDetails.nomeFantasia}
                                            </Typography>
                                            <br />
                                        </Grid>

                                        <Grid item xs={12} md={6} sx={{ textAlign: 'center' }}>
                                            {/*  Componente de imagem */}
                                            <Image
                                                src="/images/logos/medicos.webp" // Substitua pelo caminho da sua imagem estática
                                                alt="Imagem da Clínica"
                                                width={300}
                                                height={200}
                                                style={{
                                                    maxWidth: '100%',
                                                    height: 'auto',
                                                    borderRadius: '8px',
                                                }}
                                            />
                                        </Grid>

                                        <Grid item xs={12} md={6}>
                                            {/* Informações da clínica formatadas */}
                                            <Box>
                                                <Typography variant="subtitle2" fontWeight="bold">CNPJ:</Typography>
                                                <Typography variant="body2">{selectedClinicDetails.cnpj}</Typography>
                                            </Box>
                                            <Box mt={2}>
                                                <Typography variant="subtitle2" fontWeight="bold">Telefone:</Typography>
                                                <Typography variant="body2">{selectedClinicDetails.telefone}</Typography>
                                            </Box>
                                            <Box mt={2}>
                                                <Typography variant="subtitle2" fontWeight="bold">Horário de Abertura:</Typography>
                                                <Typography variant="body2">{selectedClinicDetails.horarioAbertura}</Typography>
                                            </Box>
                                            <Box mt={2}>
                                                <Typography variant="subtitle2" fontWeight="bold">Horário de Fechamento:</Typography>
                                                <Typography variant="body2">{selectedClinicDetails.horarioFechamento}</Typography>
                                            </Box>
                                            <Box mt={2}>
                                                <Typography variant="subtitle2" fontWeight="bold">Tipo:</Typography>
                                                <Typography variant="body2">{selectedClinicDetails.tipo}</Typography>
                                            </Box>
                                        </Grid>
                                    </Grid>

                                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-around' }}>
                                        <Button variant="contained" color="primary" startIcon={<Link />} onClick={handleOpenVinculosModal}>
                                            Gerenciar vínculos
                                        </Button>
                                        <Button variant="contained" color="primary" startIcon={<Event />}>
                                            Solicitar agendamento
                                        </Button>
                                    </Box>
                                </>
                            )}
                            <br />
                            <Box display='flex' justifyContent='center' mt={3}>
                                <Button onClick={handleCloseClinicDetails} variant='outlined'>Fechar</Button>
                            </Box>
                        </Box>
                    </Modal>

                    {/* Modal de Gerenciar Vínculos */}
                    <Modal open={openVinculos} onClose={handleCloseVinculosModal}>
                        <Box sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '60%', // Ajuste o tamanho conforme necessário
                            height: '70%',
                            bgcolor: theme.palette.background.paper,
                            border: `1px solid ${theme.palette.divider}`,
                            borderRadius: '8px',
                            boxShadow: theme.shadows[5],
                            p: 4,
                            display: 'flex',
                            flexDirection: 'column',
                        }}>
                            <Typography variant="h6" gutterBottom>
                                Gerenciando vínculos de: {selectedClinicDetails?.nomeFantasia}
                            </Typography>
                            <Tabs value={tabValue} onChange={handleTabChange} aria-label="abas de vínculos">
                                <Tab label="Gerentes" />
                                <Tab label="Médicos" />
                                <Tab label="Pacientes" />
                                <Tab label="Solicitações" />
                            </Tabs>
                            <Box mt={2}>
                                {tabValue === 0 && (
                                    <FormControl fullWidth>
                                        <InputLabel id="gerente-select-label">Selecionar Gerente</InputLabel>
                                        <Select
                                            labelId="gerente-select-label"
                                            id="gerente-select"
                                            value={selectedGerente || ''}
                                            label="Selecionar Gerente"
                                            onChange={handleGerenteChange}
                                        >
                                            {gerentes.map((gerente) => (
                                                <MenuItem key={gerente.id} value={gerente.id}>{gerente.nome}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                )}
                                {tabValue === 1 && (
                                    <FormControl fullWidth>
                                        <InputLabel id="medico-select-label">Selecionar Médico</InputLabel>
                                        <Select
                                            labelId="medico-select-label"
                                            id="medico-select"
                                            value={selectedMedico || ''}
                                            label="Selecionar Médico"
                                            onChange={handleMedicoChange}
                                        >
                                            {medicos.map((medico) => (
                                                <MenuItem key={medico.id} value={medico.id}>{medico.nome}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                )}
                                {tabValue === 2 && (
                                    <FormControl fullWidth>
                                        <InputLabel id="paciente-select-label">Selecionar Paciente</InputLabel>
                                        <Select
                                            labelId="paciente-select-label"
                                            id="paciente-select"
                                            value={selectedPaciente || ''}
                                            label="Selecionar Paciente"
                                            onChange={handlePacienteChange}
                                        >
                                            {pacientes.map((paciente) => (
                                                <MenuItem key={paciente.id} value={paciente.id}>{paciente.nome}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                )}
                                {tabValue === 3 && (
                                    <Box sx={{ overflow: 'auto' }}>
                                        <Table aria-label="Solicitações de Vínculo">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>ID</TableCell>
                                                    {/* <TableCell>Usuário</TableCell> */}
                                                    <TableCell>Ações</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {solicitacoes && Array.isArray(solicitacoes) ? (
                                                    solicitacoes.map((solicitacao) => (
                                                        <TableRow key={solicitacao.id}>
                                                            <TableCell>{solicitacao.id}</TableCell>
                                                           {/*  <TableCell>{solicitacao.userId}</TableCell> */}
                                                            <TableCell>
                                                                <IconButton color="success" aria-label="Aceitar" onClick={() => handleAceitarVinculo(solicitacao)}>
                                                                    <Check />
                                                                </IconButton>
                                                                <IconButton color="error" aria-label="Recusar" onClick={() => handleRecusarVinculo(solicitacao)}>
                                                                    <Close />
                                                                </IconButton>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                ) : (
                                                    <TableRow>
                                                        <TableCell colSpan={2}>Nenhuma solicitação encontrada</TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </Box>
                                )}
                            </Box>
                            <Box mt={3} display="flex" justifyContent="space-between">
                                <Button onClick={handleCloseVinculosModal} variant="outlined">Fechar</Button>
                            </Box>
                        </Box>
                    </Modal>

                    {/* Modal de Edição */}
                    <Modal open={openEdit} onClose={() => setOpenEdit(false)}>
                        <Box
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: 300,
                                bgcolor: 'background.paper',
                                boxShadow: 24,
                                p: 4,
                                textAlign: 'center',
                            }}
                        >
                            <Typography variant='h6' gutterBottom>
                                Editar Clinica
                            </Typography>
                            {clinicaEdit && (
                                <>
                                    <TextField
                                        fullWidth
                                        margin='dense'
                                        label='nomeFantasia'
                                        value={clinicaEdit.nomeFantasia}
                                        onChange={(e) =>
                                            setClinicaEdit({ ...clinicaEdit, nomeFantasia: e.target.value })
                                        }
                                    />
                                    <TextField
                                        fullWidth
                                        margin='dense'
                                        label='cnpj'
                                        value={clinicaEdit.cnpj}
                                        onChange={(e) =>
                                            setClinicaEdit({ ...clinicaEdit, cnpj: e.target.value })
                                        }
                                    />
                                    <TextField
                                        fullWidth
                                        margin='dense'
                                        label='telefone'
                                        value={clinicaEdit.telefone}
                                        onChange={(e) =>
                                            setClinicaEdit({ ...clinicaEdit, telefone: e.target.value })
                                        }
                                    />
                                    <TextField
                                        fullWidth
                                        margin='dense'
                                        label='horarioAbertura'
                                        value={clinicaEdit.horarioAbertura}
                                        onChange={(e) =>
                                            setClinicaEdit({ ...clinicaEdit, horarioAbertura: e.target.value })
                                        }
                                    />
                                    <TextField
                                        fullWidth
                                        margin='dense'
                                        label='horarioFechamento'
                                        value={clinicaEdit.horarioFechamento}
                                        onChange={(e) =>
                                            setClinicaEdit({ ...clinicaEdit, horarioFechamento: e.target.value })
                                        }
                                    />
                                    <FormControl fullWidth margin="dense">
                                        <InputLabel id="tipo-clinica-label">Tipo de Clínica</InputLabel>
                                        <Select
                                            labelId="tipo-clinica-label"
                                            id="tipo-clinica"
                                            value={clinicaEdit.tipo}
                                            label="Tipo de Clínica"
                                            onChange={(e) => setClinicaEdit({ ...clinicaEdit, tipo: e.target.value })}
                                        >
                                            {tiposClinica.map((tipo) => (
                                                <MenuItem key={tipo} value={tipo}>{tipo}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <TextField
                                        fullWidth
                                        margin='dense'
                                        label='ID do Gerente'
                                        type="number"
                                        value={clinicaEdit.gerenteId}
                                        onChange={(e) =>
                                            setClinicaEdit({ ...clinicaEdit, gerenteId: Number(e.target.value) })
                                        }
                                    />

                                </>
                            )}
                            <Box
                                sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}
                            >
                                <Button variant='contained' color='primary' onClick={handleSave}>
                                    Salvar
                                </Button>
                                <Button
                                    variant='outlined'
                                    color='secondary'
                                    onClick={() => setOpenEdit(false)}
                                >
                                    Cancelar
                                </Button>
                            </Box>
                        </Box>
                    </Modal>

                    {/* Modal de Exclusão */}
                    <Modal open={openDelete} onClose={() => setOpenDelete(false)}>
                        <Box
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: 300,
                                bgcolor: 'background.paper',
                                boxShadow: 24,
                                p: 4,
                                textAlign: 'center',
                            }}
                        >
                            <Typography variant='h6' gutterBottom>
                                Deseja realmente excluir? <br></br> Esta ação não pode ser desfeita.
                            </Typography>
                            <Box
                                sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}
                            >
                                <Button variant='contained' color='error' onClick={handleDelete}>
                                    Excluir
                                </Button>
                                <Button
                                    variant='outlined'
                                    color='secondary'
                                    onClick={() => setOpenDelete(false)}
                                >
                                    Cancelar
                                </Button>
                            </Box>
                        </Box>
                    </Modal>
                    <Modal open={openAdd} onClose={handleCloseAddModal}>
                        <Box
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: 300,
                                bgcolor: 'background.paper',
                                boxShadow: 24,
                                p: 4,
                                textAlign: 'center',
                            }}
                        >
                            <Typography variant='h6' gutterBottom>
                                Adicionar nova Clinica
                            </Typography>

                            <TextField
                                fullWidth
                                margin='dense'
                                label='Nome Fantasia'
                                value={newClinica.nomeFantasia}
                                onChange={(e) => setNewClinica({ ...newClinica, nomeFantasia: e.target.value })}
                            />
                            <TextField
                                fullWidth
                                margin='dense'
                                label='CNPJ'
                                value={newClinica.cnpj}
                                onChange={(e) => setNewClinica({ ...newClinica, cnpj: e.target.value })}
                            />
                            <TextField
                                fullWidth
                                margin='dense'
                                label='Telefone'
                                value={newClinica.telefone}
                                onChange={(e) => setNewClinica({ ...newClinica, telefone: e.target.value })}
                            />
                            <TextField
                                fullWidth
                                margin='dense'
                                label='Horário Abertura'
                                value={newClinica.horarioAbertura}
                                onChange={(e) => setNewClinica({ ...newClinica, horarioAbertura: e.target.value })}
                            />
                            <TextField
                                fullWidth
                                margin='dense'
                                label='Horário Fechamento'
                                value={newClinica.horarioFechamento}
                                onChange={(e) => setNewClinica({ ...newClinica, horarioFechamento: e.target.value })}
                            />

                            <FormControl fullWidth margin="dense">
                                <InputLabel id="tipo-clinica-label">Tipo de Clínica</InputLabel>
                                <Select
                                    labelId="tipo-clinica-label"
                                    id="tipo-clinica"
                                    value={newClinica.tipo}
                                    label="Tipo de Clínica"
                                    onChange={(e) => setNewClinica({ ...newClinica, tipo: e.target.value })}
                                >
                                    {tiposClinica.map((tipo) => (
                                        <MenuItem key={tipo} value={tipo}>{tipo}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            
                            <TextField
                                fullWidth
                                margin='dense'
                                label='ID do Gerente'
                                type="number"
                                value={newClinica.gerenteId}
                                onChange={(e) => setNewClinica({ ...newClinica, gerenteId: Number(e.target.value) })}
                            />

                            <Box
                                sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}
                            >
                                <Button variant='contained' color='primary' onClick={handleAddClinica}>
                                    Salvar
                                </Button>
                                <Button
                                    variant='outlined'
                                    color='secondary'
                                    onClick={handleCloseAddModal}
                                >
                                    Cancelar
                                </Button>
                            </Box>
                        </Box>
                    </Modal>
                </>
            </>
        </DashboardCard>
    );
};

export default ListagemClinicas;
