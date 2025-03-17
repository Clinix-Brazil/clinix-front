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
    Snackbar,
    Alert
} from '@mui/material';
import DashboardCard from '@/app/(DashboardLayout)//components/shared/DashboardCard';
import { useEffect, useState } from 'react';
import { Delete, Edit, Add, Link, Event, Check, Close } from '@mui/icons-material';
import {
    LIST_CLINICA, UPDATE_CLINICA, DELETE_CLINICA, CREATE_CLINICA, LIST_MEDICO,
    SOLICITAR_VINCULO, SOLICITACOES_VINCULO, ACEITAR_VINCULO, RECUSAR_VINCULO,
    BUSCAR_MEDICO, BUSCAR_CLINICA
} from '../APIroutes';
import { Clinica, Medico, Solicitacao } from '../interfaces';
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
    const [openVinculos, setOpenVinculos] = useState(false);
    const [tabValue, setTabValue] = useState(0);

    const [medicos, setMedicos] = useState<Medico[]>([]);
    const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
    const [medicoNomes, setMedicoNomes] = useState<{ [id: number]: string }>({});

    const [selectedMedico, setSelectedMedico] = useState<number | null>(null);
    const [horarioInicio, setHorarioInicio] = useState<string>('');
    const [horarioTermino, setHorarioTermino] = useState<string>('');

    const [openAdd, setOpenAdd] = useState(false);
    const [newClinica, setNewClinica] = useState<NewClinica>({
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

    // Snackbar state
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    useEffect(() => {
        fetch(LIST_CLINICA())
            .then((response) => response.json())
            .then((data) => {
                setClinicas(data);
            })
            .catch((error) => {
                console.error('Erro ao buscar clinicas:', error);
                showSnackbar('Erro ao buscar clínicas.', 'error');
            });
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
                .then((response) => {
                    if (!response.ok) {
                        return response.json().then(err => {
                            throw new Error(err.message || 'Erro ao atualizar clínica.');
                        });
                    }
                    return response.json();
                })
                .then((updatedClinica) => {
                    setClinicas(prevClinicas =>
                        prevClinicas.map((clinica) =>
                            clinica.id === updatedClinica.id ? updatedClinica : clinica
                        )
                    );
                    setOpenEdit(false);
                    showSnackbar('Clínica atualizada com sucesso!', 'success');
                })
                .catch((error) => {
                    console.error('Erro ao atualizar clinica:', error);
                    showSnackbar(error.message || 'Erro ao atualizar clínica.', 'error');
                });
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
                .then((response) => {
                    if (!response.ok) {
                         return response.json().then(err => {
                            throw new Error(err.message || 'Erro ao excluir clínica.');
                        });
                    }
                })
                .then(() => {
                    setClinicas(clinicas.filter((clinica) => clinica.id !== clinicaDelete.id));
                    setOpenDelete(false);
                    showSnackbar('Clínica excluída com sucesso!', 'success');
                })
                .catch((error) => {
                    console.error('Erro ao excluir clinica:', error);
                    showSnackbar(error.message || 'Erro ao excluir clínica.', 'error');
                });
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
        setNewClinica({
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
            .then(response => {
                 if (!response.ok) {
                      return response.json().then(err => {
                            throw new Error(err.message || 'Erro ao adicionar clínica.');
                        });
                    }
                return response.json();
            })
            .then(data => {
                setClinicas([...clinicas, data]);
                handleCloseAddModal();
                showSnackbar('Clínica adicionada com sucesso!', 'success');
            })
            .catch(error => {
                console.error('Erro ao adicionar clínica:', error);
                showSnackbar(error.message || 'Erro ao adicionar clínica.', 'error');
            });
    };

    const handleOpenVinculosModal = () => {
        Promise.all([
            fetch(LIST_MEDICO()).then(response => response.json()),
            fetch(SOLICITACOES_VINCULO(selectedClinicDetails!.id)).then(response => response.json()),
        ])
            .then(async ([medicosData, vinculosData]) => {
                setMedicos(medicosData);
                setSolicitacoes(vinculosData);
                setMedicoNomes({}); // Limpar nomes anteriores

                // Buscar o nome de cada médico
                const nomesMedicos: { [key: number]: string } = {};
                for (const solicitacao of vinculosData) {
                    try {
                        const medico = await fetch(BUSCAR_MEDICO(solicitacao.medicoId)).then(response => response.json());
                        nomesMedicos[solicitacao.medicoId] = medico.nome;
                    } catch (error) {
                        console.error(`Erro ao buscar nome do médico ${solicitacao.medicoId}:`, error);
                        nomesMedicos[solicitacao.medicoId] = 'Nome não encontrado';
                    }
                }
                setMedicoNomes(nomesMedicos);

                setOpenVinculos(true);
                setTabValue(0);
            })
            .catch(error => {
                console.error('Erro ao buscar dados de usuários:', error);
                showSnackbar('Erro ao buscar dados para vínculos.', 'error');
            });
    };

    const handleCloseVinculosModal = () => {
        setOpenVinculos(false);
        setHorarioInicio('');
        setHorarioTermino('');
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleMedicoChange = (event: SelectChangeEvent<number>) => {
        setSelectedMedico(event.target.value as number);
    };

    const handleAceitarVinculo = async (solicitacao: Solicitacao) => {
        const clinicaId = selectedClinicDetails!.id;
        const requestBody = {
            clinicaId: clinicaId,
            medicoId: solicitacao.medicoId,
        };

        try {
            const response = await fetch(ACEITAR_VINCULO(requestBody.clinicaId, requestBody.medicoId), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                return response.json().then(err => {
                    throw new Error(err.message || 'Erro ao aceitar vínculo');
                });
            }

            setSolicitacoes(prevSolicitacoes =>
                prevSolicitacoes.filter(s => s.id !== solicitacao.id)
            );
            showSnackbar('Vínculo aceito com sucesso!', 'success');
        } catch (error) {
            console.error('Erro ao aceitar vínculo:', error);
            showSnackbar((error as any).message || 'Erro ao aceitar vínculo.', 'error');
        }
    };

    const handleRecusarVinculo = async (solicitacao: Solicitacao) => {
        const clinicaId = selectedClinicDetails!.id;
        const requestBody = {
            clinicaId: clinicaId,
            medicoId: solicitacao.medicoId,
        };
        try {
            const response = await fetch(RECUSAR_VINCULO(requestBody.clinicaId, requestBody.medicoId), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                return response.json().then(err => {
                    throw new Error(err.message || 'Erro ao recusar vínculo');
                });
            }
            setSolicitacoes(prevSolicitacoes =>
                prevSolicitacoes.filter(s => s.id !== solicitacao.id)
            );
            showSnackbar('Vínculo recusado com sucesso!', 'success');
        } catch (error) {
            console.error('Erro ao recusar vínculo:', error);
            showSnackbar((error as any).message || 'Erro ao recusar vínculo.', 'error');
        }
    };

    const handleSolicitarVinculo = () => {
        if (!selectedClinicDetails) {
            console.error("Nenhuma clinica selecionada");
            return;
        }

        if (!selectedMedico) {
            console.error("Nenhum médico selecionado");
            return;
        }

        if (!horarioInicio || !horarioTermino) {
            showSnackbar('Por favor, preencha os horários de início e término.', 'error');
            return;
        }

        const requestBody = {
            clinicaId: selectedClinicDetails.id,
            usuarioId: selectedMedico,
            horarioInicio: horarioInicio, // Formato HH:mm:ss
            horarioTermino: horarioTermino // Formato HH:mm:ss
        };

        fetch(SOLICITAR_VINCULO(requestBody.clinicaId, requestBody.usuarioId), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody),
        })
            .then(response => {
                 if (!response.ok) {
                     return response.json().then(err => {
                        throw new Error(err.message || 'Erro ao solicitar vínculo')
                    });
                 }
                showSnackbar('Solicitação de vínculo enviada com sucesso!', 'success');
                setHorarioInicio('');
                setHorarioTermino('');
            })
            .catch(error => {
                console.error("Erro ao solicitar vínculo:", error)
                showSnackbar(error.message || 'Erro ao solicitar vínculo.', 'error');
            })
    }

    // Snackbar handler
    const showSnackbar = (message: string, severity: 'success' | 'error') => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const handleCloseSnackbar = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setSnackbarOpen(false);
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
                                                    e.stopPropagation();
                                                    handleEditClick(clinica);
                                                }}
                                                color='primary'
                                            >
                                                <Edit />
                                            </IconButton>
                                            <IconButton
                                                onClick={(e) => {
                                                    e.stopPropagation();
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

                    {/* Clinic Details Modal */}
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
                            width: '60%',
                            height: '70%',
                            bgcolor: theme.palette.background.paper,
                            border: `1px solid ${theme.palette.divider}`,
                            borderRadius: '8px',
                            boxShadow: theme.shadows[5],
                            p: 4,
                            display: 'flex',
                            flexDirection: 'column',
                        }}>
                            {selectedClinicDetails && (
                                <>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sx={{ textAlign: 'center', mb: 2 }}>
                                            <Typography variant='h4' fontWeight='bold'>
                                                {selectedClinicDetails.nomeFantasia}
                                            </Typography>
                                            <br />
                                        </Grid>

                                        <Grid item xs={12} md={6} sx={{ textAlign: 'center' }}>
                                            <Image
                                                src="/images/logos/medicos.webp"
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

                    {/* Manage Vinculos Modal */}
                    <Modal open={openVinculos} onClose={handleCloseVinculosModal}>
                        <Box sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '60%',
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
                                <Tab label="Médicos" />
                                <Tab label="Solicitações" />
                            </Tabs>
                            <Box mt={2}>
                                {tabValue === 0 && (
                                    <>
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

                                        <Typography variant="subtitle1" mt={2}>
                                            Disponibilidade de horários
                                        </Typography>

                                        <TextField
                                            fullWidth
                                            margin='dense'
                                            label='Horário de início'
                                            type="time" // Use type="time" para um seletor de horário
                                            value={horarioInicio}
                                            onChange={(e) => setHorarioInicio(e.target.value)}
                                            inputProps={{
                                                step: 60, // 60 segundos (1 minuto)
                                            }}
                                        />

                                        <TextField
                                            fullWidth
                                            margin='dense'
                                            label='Horário de término'
                                            type="time" // Use type="time" para um seletor de horário
                                            value={horarioTermino}
                                            onChange={(e) => setHorarioTermino(e.target.value)}
                                            inputProps={{
                                                step: 60, // 60 segundos (1 minuto)
                                            }}
                                        />

                                        <Box mt={3} display="flex" justifyContent="center">
                                            <Button variant="contained" color="primary" onClick={() => handleSolicitarVinculo()}>
                                                Solicitar Vínculo
                                            </Button>
                                        </Box>
                                    </>
                                )}
                                {tabValue === 1 && (
                                    <Box sx={{ overflow: 'auto' }}>
                                        <Table aria-label="Solicitações de Vínculo">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Médico</TableCell>
                                                    <TableCell>Ações</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {solicitacoes && Array.isArray(solicitacoes) ? (
                                                    solicitacoes.map((solicitacao) => (
                                                        <TableRow key={solicitacao.id}>
                                                            <TableCell>{medicoNomes[solicitacao.medicoId] || 'Carregando...'}</TableCell>
                                                            <TableCell>
                                                                <Button
                                                                    variant="contained"
                                                                    color="success"
                                                                    startIcon={<Check />}
                                                                    onClick={() => handleAceitarVinculo(solicitacao)}
                                                                    sx={{ mr: 1 }}
                                                                >
                                                                    Aceitar
                                                                </Button>
                                                                <Button
                                                                    variant="contained"
                                                                    color="error"
                                                                    startIcon={<Close />}
                                                                    onClick={() => handleRecusarVinculo(solicitacao)}
                                                                >
                                                                    Recusar
                                                                </Button>
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

                    {/* Edit Modal */}
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
                                            setClinicaEdit({ ...clinicaEdit, nomeFantasia: e.target.value })}
                                    />
                                    <TextField
                                        fullWidth
                                        margin='dense'
                                        label='cnpj'
                                        value={clinicaEdit.cnpj}
                                        onChange={(e) =>
                                            setClinicaEdit({ ...clinicaEdit, cnpj: e.target.value })}
                                    />
                                    <TextField
                                        fullWidth
                                        margin='dense'
                                        label='telefone'
                                        value={clinicaEdit.telefone}
                                        onChange={(e) =>
                                            setClinicaEdit({ ...clinicaEdit, telefone: e.target.value })}
                                    />
                                    <TextField
                                        fullWidth
                                        margin='dense'
                                        label='horarioAbertura'
                                        type="time"
                                        value={clinicaEdit.horarioAbertura}
                                        onChange={(e) =>
                                            setClinicaEdit({ ...clinicaEdit, horarioAbertura: e.target.value })}
                                        inputProps={{
                                            step: 60,
                                        }}
                                    />
                                    <TextField
                                        fullWidth
                                        margin='dense'
                                        label='horarioFechamento'
                                        type="time"
                                        value={clinicaEdit.horarioFechamento}
                                        onChange={(e) =>
                                            setClinicaEdit({ ...clinicaEdit, horarioFechamento: e.target.value })}
                                        inputProps={{
                                            step: 60,
                                        }}
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
                                            setClinicaEdit({ ...clinicaEdit, gerenteId: Number(e.target.value) })}
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

                    {/* Delete Modal */}
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

                    {/* Add Modal */}
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
                                type="time"
                                value={newClinica.horarioAbertura}
                                onChange={(e) => setNewClinica({ ...newClinica, horarioAbertura: e.target.value })}
                                inputProps={{
                                    step: 60,
                                }}
                            />
                            <TextField
                                fullWidth
                                margin='dense'
                                label='Horário Fechamento'
                                type="time"
                                value={newClinica.horarioFechamento}
                                onChange={(e) => setNewClinica({ ...newClinica, horarioFechamento: e.target.value })}
                                inputProps={{
                                    step: 60,
                                }}
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

                    {/* Snackbar */}
                    <Snackbar
                        open={snackbarOpen}
                        autoHideDuration={6000}
                        onClose={handleCloseSnackbar}
                    >
                        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                            {snackbarMessage}
                        </Alert>
                    </Snackbar>
                </>
            </>
        </DashboardCard>
    );
};

export default ListagemClinicas;