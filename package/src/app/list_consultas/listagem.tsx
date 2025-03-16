import React, { useState, useEffect } from 'react';
import {
    Typography,
    Box,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    IconButton,
    Modal,
    Button,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    styled,
} from "@mui/material";
import { Edit, Delete, AccessTime, Add } from "@mui/icons-material";
import DashboardCard from "@/app/(DashboardLayout)//components/shared/DashboardCard";
import {
    CREATE_AGENDAMENTO,
    LIST_AGENDAMENTO,
    UPDATE_AGENDAMENTO,
    DELETE_AGENDAMENTO,
    LIST_CLINICA,
    LIST_MEDICO,
    LIST_PACIENTE // Adicionado
} from "../APIroutes";
import { Consulta } from "../interfaces";
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useTheme } from "@mui/material/styles";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Estilização para a linha da tabela com hover
const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:hover': {
        backgroundColor: theme.palette.action.hover,
        cursor: 'pointer',
    },
}));

const ListagemConsultas = () => {
    const theme = useTheme();

    const [consultas, setConsultas] = useState<Consulta[]>([]);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [consultaEdit, setConsultaEdit] = useState<Consulta | null>(null);
    const [consultaDelete, setConsultaDelete] = useState<Consulta | null>(null);

    const [openDetails, setOpenDetails] = useState(false);
    const [selectedConsulta, setSelectedConsulta] = useState<Consulta | null>(null);

    // State for New Consultation Modal
    const [openNovaConsulta, setOpenNovaConsulta] = useState(false);
    const [selectedClinica, setSelectedClinica] = useState('');
    const [selectedMedico, setSelectedMedico] = useState('');
    const [selectedPaciente, setSelectedPaciente] = useState(''); // Adicionado
    const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);

    // Options for Clinic and Doctors Selects
    const [clinicas, setClinicas] = useState<{ id: number, nome: string }[]>([]);
    const [medicos, setMedicos] = useState<{ id: number, nome: string }[]>([]);
    const [pacientes, setPacientes] = useState<{ id: number, nome: string }[]>([]); // Adicionado

    useEffect(() => {
        const fetchConsultas = async () => {
            try {
                const response = await fetch(LIST_AGENDAMENTO());
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setConsultas(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Erro ao buscar Consultas:", error);
            }
        };

        const fetchClinicas = async () => {
            try {
                const response = await fetch(LIST_CLINICA());
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setClinicas(data.map((clinica: any) => ({ id: clinica.id, nome: clinica.nomeFantasia })));
            } catch (error) {
                console.error("Erro ao buscar Clínicas:", error);
            }
        };

        const fetchMedicos = async () => {
            try {
                const response = await fetch(LIST_MEDICO());
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setMedicos(data.map((medico: any) => ({ id: medico.id, nome: medico.nome })));
            } catch (error) {
                console.error("Erro ao buscar Médicos:", error);
            }
        };

        const fetchPacientes = async () => { // Adicionado
            try {
                const response = await fetch(LIST_PACIENTE());
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setPacientes(data.map((paciente: any) => ({ id: paciente.id, nome: paciente.nome })));
            } catch (error) {
                console.error("Erro ao buscar Pacientes:", error);
            }
        };

        fetchConsultas();
        fetchClinicas();
        fetchMedicos();
        fetchPacientes(); // Adicionado
    }, []);


    const handleOpenDetails = (consulta: Consulta) => {
        setSelectedConsulta(consulta);
        setOpenDetails(true);
    };

    const handleCloseDetails = () => {
        setOpenDetails(false);
        setSelectedConsulta(null);
    };

    const handleEditClick = (consulta: Consulta) => {
        setConsultaEdit(consulta);
        setOpenEdit(true);
    };

    const handleDeleteClick = (consulta: Consulta) => {
        setConsultaDelete(consulta);
        setOpenDelete(true);
    };

    const handleSave = async () => {
        if (consultaEdit) {
            try {
                const response = await fetch(UPDATE_AGENDAMENTO(consultaEdit.id),
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(consultaEdit),
                    }
                );
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const updatedConsulta = await response.json();
                setConsultas(
                    consultas.map((p) =>
                        p.id === updatedConsulta.id ? updatedConsulta : p
                    )
                );
                setOpenEdit(false);
            } catch (error) {
                console.error("Erro ao atualizar Consulta:", error);
            }
        }
    };

    const handleDelete = async () => {
        if (consultaDelete) {
            try {
                const response = await fetch(DELETE_AGENDAMENTO(consultaDelete.id),
                    {
                        method: "DELETE",
                    }
                );
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                setConsultas(consultas.filter((p) => p.id !== consultaDelete.id));
                setOpenDelete(false);
            } catch (error) {
                console.error("Erro ao excluir consulta:", error);
            }
        }
    };

    const handleNovaConsultaClick = () => {
        setOpenNovaConsulta(true);
    };

    const handleCloseNovaConsulta = () => {
        setOpenNovaConsulta(false);
        setSelectedClinica('');
        setSelectedMedico('');
        setSelectedPaciente(''); // Adicionado
        setSelectedDateTime(null);
    };

    const handleSalvarNovaConsulta = async () => {
        if (!selectedClinica || !selectedMedico || !selectedPaciente || !selectedDateTime) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        // Format the date to yyyy-MM-dd HH:mm:ss format, adapt timezone if needed
        const formattedDateTime = format(selectedDateTime, "yyyy-MM-dd HH:mm:ss", { locale: ptBR });

        const novaConsulta = {
            clinicId: parseInt(selectedClinica), // clinicId is a number
            doctorId: parseInt(selectedMedico), // doctorId is a number
            patientId: parseInt(selectedPaciente), //  Adicionado
            dateTime: formattedDateTime, // dateTime is a string in "yyyy-MM-dd HH:mm:ss" format
            status: "PENDING"  // Must match one of the enum values
        };

        try {
            const response = await fetch(CREATE_AGENDAMENTO(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(novaConsulta),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao criar consulta');
            }

            const novaConsultaResponse = await response.json();
            setConsultas([...consultas, novaConsultaResponse]);
            alert('Consulta criada com sucesso!');
            handleCloseNovaConsulta();
        } catch (error: any) {
            console.error(error);
            alert(`Erro ao criar consulta: ${error.message}`);
        }
    };

    return (
        <DashboardCard title="Listagem geral de Consultas">
            <>
                <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<Add />}
                        onClick={handleNovaConsultaClick}
                    >
                        Nova consulta
                    </Button>
                </Box>
                <Box sx={{ overflow: "auto", width: { xs: "280px", sm: "auto" } }}>
                    <Table aria-label="simple table" sx={{ whiteSpace: "nowrap", mt: 2 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Id</TableCell>
                                <TableCell>Data/Hora</TableCell>
                                <TableCell>Médico</TableCell>
                                <TableCell>Paciente</TableCell>
                                <TableCell>Clínica</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell align="right">Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {consultas.map((consulta) => (
                                <StyledTableRow key={consulta.id} onClick={() => handleOpenDetails(consulta)}>
                                    <TableCell>{consulta.id}</TableCell>
                                    <TableCell>{consulta.dateTime}</TableCell>
                                    <TableCell>{consulta.doctorName}</TableCell>
                                    <TableCell>{consulta.patientName}</TableCell>
                                    <TableCell>{consulta.clinicName}</TableCell>
                                    <TableCell>{consulta.status}</TableCell>
                                    <TableCell align="right">
                                        <IconButton
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleOpenDetails(consulta);
                                            }}
                                            color="secondary">
                                            <AccessTime />
                                        </IconButton>

                                        <IconButton
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEditClick(consulta);
                                            }}
                                            color="primary"
                                        >
                                            <Edit />
                                        </IconButton>
                                        <IconButton
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteClick(consulta);
                                            }}
                                            color="error"
                                        >
                                            <Delete />
                                        </IconButton>
                                    </TableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>

                {/* Modal de Detalhes */}
                <Modal
                    open={openDetails}
                    onClose={handleCloseDetails}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: 400,
                            bgcolor: "background.paper",
                            boxShadow: 24,
                            p: 4,
                            textAlign: "center",
                        }}
                    >
                        <Typography variant="h6" gutterBottom>
                            Detalhes da Consulta
                        </Typography>
                        {selectedConsulta && (
                            <>
                                <Typography variant="subtitle1">
                                    Médico: {selectedConsulta.doctorName}
                                </Typography>
                                <Typography variant="subtitle1">
                                    Horário: {selectedConsulta.dateTime}
                                </Typography>
                                <Typography variant="subtitle1">
                                    Paciente: {selectedConsulta.patientName}
                                </Typography>
                            </>
                        )}
                        <Button onClick={handleCloseDetails} sx={{ mt: 3 }} variant="outlined">
                            Fechar
                        </Button>
                    </Box>
                </Modal>

                {/* Modal para Nova Consulta */}
                <Modal open={openNovaConsulta} onClose={handleCloseNovaConsulta}>
                    <Box
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: 400,
                            bgcolor: theme.palette.background.paper,
                            border: `2px solid ${theme.palette.primary.main}`,
                            borderRadius: '8px',
                            boxShadow: theme.shadows[5],
                            p: 4,
                        }}
                    >
                        <Typography variant="h6" gutterBottom textAlign="center">
                            Nova Consulta
                        </Typography>
                        <FormControl fullWidth margin="dense">
                            <InputLabel id="clinica-select-label">Clínica</InputLabel>
                            <Select
                                labelId="clinica-select-label"
                                id="clinica-select"
                                value={selectedClinica}
                                label="Clínica"
                                onChange={(e) => setSelectedClinica(e.target.value as string)}
                            >
                                {clinicas.map((clinica) => (
                                    <MenuItem key={clinica.id} value={clinica.id}>{clinica.nome}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth margin="dense">
                            <InputLabel id="medico-select-label">Médico</InputLabel>
                            <Select
                                labelId="medico-select-label"
                                id="medico-select"
                                value={selectedMedico}
                                label="Médico"
                                onChange={(e) => setSelectedMedico(e.target.value as string)}
                            >
                                {medicos.map((medico) => (
                                    <MenuItem key={medico.id} value={medico.id}>{medico.nome}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        {/* Select para Paciente */}
                        <FormControl fullWidth margin="dense">
                            <InputLabel id="paciente-select-label">Paciente</InputLabel>
                            <Select
                                labelId="paciente-select-label"
                                id="paciente-select"
                                value={selectedPaciente}
                                label="Paciente"
                                onChange={(e) => setSelectedPaciente(e.target.value as string)}
                            >
                                {pacientes.map((paciente) => (
                                    <MenuItem key={paciente.id} value={paciente.id}>{paciente.nome}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth margin="dense">
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DateTimePicker
                                    label="Data e Hora"
                                    value={selectedDateTime}
                                    onChange={(newValue) => {
                                        setSelectedDateTime(newValue);
                                    }}
                                    renderInput={(params: TextFieldProps) => <TextField {...params} />}
                                />
                            </LocalizationProvider>
                        </FormControl>
                        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                            <Button variant="outlined" color="secondary" onClick={handleCloseNovaConsulta}>
                                Cancelar
                            </Button>
                            <Button variant="contained" color="primary" onClick={handleSalvarNovaConsulta}>
                                Salvar
                            </Button>
                        </Box>
                    </Box>
                </Modal>

                {/* Modal de Edição */}
                <Modal open={openEdit} onClose={() => setOpenEdit(false)}>
                    <Box
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: 300,
                            bgcolor: "background.paper",
                            boxShadow: 24,
                            p: 4,
                            textAlign: "center",
                        }}
                    >
                        <Typography variant="h6" gutterBottom>
                            Editar Consulta
                        </Typography>
                        {consultaEdit && (
                            <>
                                <TextField
                                    fullWidth
                                    margin="dense"
                                    label="Nome do Médico"
                                    value={consultaEdit.doctorName}
                                    onChange={(e) =>
                                        setConsultaEdit({
                                            ...consultaEdit,
                                            doctorName: e.target.value,
                                        })
                                    }
                                />

                                <TextField
                                    fullWidth
                                    margin="dense"
                                    label="Nome do Paciente"
                                    value={consultaEdit.patientName}
                                    onChange={(e) =>
                                        setConsultaEdit({
                                            ...consultaEdit,
                                            patientName: e.target.value,
                                        })
                                    }
                                />
                            </>
                        )}
                        <Box
                            sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}
                        >
                            <Button variant="contained" color="primary" onClick={handleSave}>
                                Salvar
                            </Button>
                            <Button
                                variant="outlined"
                                color="secondary"
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
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: 300,
                            bgcolor: "background.paper",
                            boxShadow: 24,
                            p: 4,
                            textAlign: "center",
                        }}
                    >
                        <Typography variant="h6" gutterBottom>
                            Deseja realmente excluir? <br></br> Esta ação não pode ser desfeita.
                        </Typography>
                        <Box
                            sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}
                        >
                            <Button variant="contained" color="error" onClick={handleDelete}>
                                Excluir
                            </Button>
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={() => setOpenDelete(false)}
                            >
                                Cancelar
                            </Button>
                        </Box>
                    </Box>
                </Modal>
            </>
        </DashboardCard>
    );
};

export default ListagemConsultas;