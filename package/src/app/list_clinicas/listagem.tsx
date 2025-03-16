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
    FormControl
} from '@mui/material';
import DashboardCard from '@/app/(DashboardLayout)//components/shared/DashboardCard';
import { useEffect, useState } from 'react';
import { Delete, Edit, Add, VisibilityOff } from '@mui/icons-material';
import { LIST_CLINICA, UPDATE_CLINICA, DELETE_CLINICA, CREATE_CLINICA } from '../APIroutes';
import { Clinica } from '../interfaces';
import { useTheme } from '@mui/material/styles';

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

    const [openAdd, setOpenAdd] = useState(false);
    const [newClinica, setNewClinica] = useState<NewClinica>({
        nomeFantasia: '',
        cnpj: '',
        telefone: '',
        horarioAbertura: '',
        horarioFechamento: '',
        tipo: 'CLINICA_GERAL', // Valor padrão para o tipo
        gerenteId: 1, // Valor padrão para o ID do gerente
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
                            width: 400,
                            bgcolor: theme.palette.background.paper,
                            border: `2px solid ${theme.palette.primary.main}`,
                            borderRadius: '8px',
                            boxShadow: theme.shadows[5],
                            p: 4,
                        }}>
                            <Typography id='modal-modal-title' variant='h6' component='h2' mb={2} textAlign='center'>
                                Detalhes da Clínica
                            </Typography>
                            {selectedClinicDetails && (
                                <Table aria-label='clinic details table'>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell component='th' scope='row'>Nome:</TableCell>
                                            <TableCell>{selectedClinicDetails.nomeFantasia}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell component='th' scope='row'>CNPJ:</TableCell>
                                            <TableCell>{selectedClinicDetails.cnpj}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell component='th' scope='row'>Telefone:</TableCell>
                                            <TableCell>{selectedClinicDetails.telefone}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell component='th' scope='row'>Horário de Abertura:</TableCell>
                                            <TableCell>{selectedClinicDetails.horarioAbertura}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell component='th' scope='row'>Horário de Fechamento:</TableCell>
                                            <TableCell>{selectedClinicDetails.horarioFechamento}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell component='th' scope='row'>Tipo:</TableCell>
                                            <TableCell>{selectedClinicDetails.tipo}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            )}
                            <Box display='flex' justifyContent='center'>
                                <Button onClick={handleCloseClinicDetails} sx={{ mt: 3 }} variant='outlined'>Fechar</Button>
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
                                            setClinicaEdit({
                                                ...clinicaEdit,
                                                telefone: e.target.value,
                                            })
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
