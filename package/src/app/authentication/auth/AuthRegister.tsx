import React, { useState, ChangeEvent, useEffect } from 'react';
import { Box, Typography, Button, RadioGroup, FormControlLabel, Radio, Snackbar, Alert,  MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import CustomTextField from '@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField';
import { Stack, styled } from '@mui/system';
import {
    CREATE_PACIENTE,
    CREATE_PACIENTE_FILA,
    CREATE_MEDICO,
    CREATE_GERENTE, LIST_ESPECIALIDADES
} from "@/app/APIroutes";
import CustomRadioGroup from './CustomRadioGroup';
import SnackbarAlert from './SnackbarAlert';

import { validateName, validateUsername, validateEmail, validatePassword, validateCPF, validateRG, validateCRM, formatNumber } from './validations'

interface AuthRegisterProps {
    title?: string;
    subtitle?: React.ReactNode;
    subtext?: React.ReactNode;
}

// Estilo para o Stack que envolve cada campo para melhor organização
const FieldWrapper = styled(Stack)(({ theme }) => ({
    marginBottom: theme.spacing(3),
    //alignItems: 'center', // Remove a centralização horizontal dos itens
}));

const AuthRegister: React.FC<AuthRegisterProps> = ({ title, subtitle, subtext }) => {
    const [nome, setNome] = useState<string>('');
    const [nomeUsuario, setNomeUsuario] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [senha, setSenha] = useState<string>('');
    const [cpf, setCpf] = useState<string>('');
    const [rg, setRg] = useState<string>('');
    const [role, setRole] = useState<string>('paciente');
    const [crm, setCrm] = useState<string>('');
    const [inicioAtendimento, setInicioAtendimento] = useState<string>('');
    const [fimAtendimento, setFimAtendimento] = useState<string>('');
    const [especialidade, setEspecialidade] = useState<string[]>([]);
    const [especialidadeSelecionada, setEspecialidadeSelecionada] = useState('');

    const [nomeError, setNomeError] = useState<string>('');
    const [nomeUsuarioError, setNomeUsuarioError] = useState<string>('');
    const [emailError, setEmailError] = useState<string>('');
    const [senhaError, setSenhaError] = useState<string>('');
    const [cpfError, setCpfError] = useState<string>('');
    const [rgError, setRgError] = useState<string>('');
    const [crmError, setCrmError] = useState<string>('');
    const [inicioAtendimentoError, setInicioAtendimentoError] = useState<string>('');
    const [fimAtendimentoError, setFimAtendimentoError] = useState<string>('');

    //Snackbar
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = React.useState<'success' | 'error'>('success');

    const handleRoleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setRole(event.target.value);
        setCpf('');
        setRg('');
        setCrm('');
        setNomeUsuario('');
        setNome('');
        setEmail('');
        setSenha('');
        setInicioAtendimento('');
        setFimAtendimento('');

        setNomeError('');
        setNomeUsuarioError('');
        setEmailError('');
        setSenhaError('');
        setCpfError('');
        setRgError('');
        setCrmError('');
        setInicioAtendimentoError('');
        setFimAtendimentoError('');
    };

    useEffect(() => {
        fetch(LIST_ESPECIALIDADES())
            .then((response) => response.json())
            .then((data) => {
                setEspecialidade(data);
            })
            .catch((error) => console.error("Erro ao buscar ESPECIALIDADES:", error));
    }, []);

    const handleEspecialidadeChange = (event: any) => {
        setEspecialidadeSelecionada(event.target.value);
    };

    const handleCPFChange = (e: any) => {
        const formattedCPF = formatNumber(e.target.value, 'XXX.XXX.XXX-XX');
        setCpf(formattedCPF);
    };

    const handleRGChange = (e: any) => {
        const formattedRG = formatNumber(e.target.value, 'X.XXX.XXX');
        setRg(formattedRG);
    };

    const handleTimeChange = (setter: (value: string) => void, e: any) => {
        const formattedTime = formatNumber(e.target.value, 'XX:XX');
        setter(formattedTime);
    };

    const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };


    const handleRegister = async () => {
        let isValid = true;

        // Validar campos
        if (!validateName(nome)) {
            setNomeError('Nome inválido.');
            isValid = false;
        }
        if (!validateUsername(nomeUsuario)) {
            setNomeUsuarioError('Nome de usuário inválido.');
            isValid = false;
        }
        if (!validateEmail(email)) {
            setEmailError('E-mail inválido.');
            isValid = false;
        }
        if (!validatePassword(senha)) {
            setSenhaError('Senha inválida (mínimo de 5 caracteres).');
            isValid = false;
        }

        if (cpf && !validateCPF(cpf)) {
            setCpfError('CPF inválido.');
            isValid = false;
        }

        if (rg && !validateRG(rg)) {
            setRgError('RG inválido.');
            isValid = false;
        }

        //Validar crm
        if (role === 'medico' && !validateCRM(crm)) {
            setCrmError("CRM inválido");
            isValid = false;
        }

        if (!isValid) {
            return;
        }

        //Dados em comum a todos os usuários:
        const usuarioData = {
            nome: nome,
            nomeUsuario: nomeUsuario,
            email: email,
            senha: senha,
            cpf: cpf,
            rg: rg,
            enabled: true,
            dataCadastro: new Date().toISOString()
        };

        let specificData = {};
        let createSpecificUrl = "";

        switch (role) {
            case 'paciente':
                createSpecificUrl = CREATE_PACIENTE_FILA();
                break;
            case 'medico':
                createSpecificUrl = CREATE_MEDICO();
                specificData = {
                    crm: crm,
                    inicioAtendimento: inicioAtendimento,
                    fimAtendimento: fimAtendimento,
                    especialidade: especialidadeSelecionada
                };
                break;
            case 'gerente':
                createSpecificUrl = CREATE_GERENTE();
                break;
            default:
                console.error('Perfil inválido');
                return;
        }

        try {
            console.log(usuarioData, specificData)
            const response = await fetch(createSpecificUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...usuarioData, ...specificData }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setSnackbarMessage(errorData.message || 'Erro ao cadastrar perfil específico');
                setSnackbarSeverity('error');
                setOpenSnackbar(true);
                throw new Error(errorData.message || 'Erro ao cadastrar perfil específico');
            }

            //Exibir mensagem de sucesso
            setSnackbarMessage('Usuário cadastrado com sucesso!');
            setSnackbarSeverity('success');
            setOpenSnackbar(true);

            //Limpar os campos do formulário após o sucesso do cadastro
            setNome('');
            setNomeUsuario('');
            setEmail('');
            setSenha('');
            setCpf('');
            setRg('');
            setCrm('');
            setInicioAtendimento('');
            setFimAtendimento('');
        } catch (error: any) {
            console.error(error);
            setSnackbarMessage(`Erro ao cadastrar usuário: ${error.message}`);
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
    };

    return (
        <>
            {title && (
                <Typography fontWeight="700" variant="h2" mb={1} align="center">
                    {title}
                </Typography>
            )}
            {subtext}

            <Box>
                <Stack mb={3}>
                    <CustomRadioGroup role={role} handleRoleChange={handleRoleChange} />
                    <FieldWrapper>
                        <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor="nome" mb="5px">
                            Nome *
                        </Typography>
                        <CustomTextField
                            id="nome"
                            variant="outlined"
                            fullWidth
                            value={nome}
                            onChange={(e: any) => setNome(e.target.value)}
                            error={!!nomeError}
                            helperText={nomeError}
                        />
                    </FieldWrapper>

                    <FieldWrapper>
                        <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor="nomeUsuario" mb="5px">
                            Nome de usuário *
                        </Typography>
                        <CustomTextField
                            id="nomeUsuario"
                            variant="outlined"
                            fullWidth
                            value={nomeUsuario}
                            onChange={(e: any) => setNomeUsuario(e.target.value)}
                            error={!!nomeUsuarioError}
                            helperText={nomeUsuarioError}
                        />
                    </FieldWrapper>

                    <FieldWrapper>
                        <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor="email" mb="5px">
                            E-mail *
                        </Typography>
                        <CustomTextField
                            id="email"
                            variant="outlined"
                            fullWidth
                            value={email}
                            onChange={(e: any) => setEmail(e.target.value)}
                            error={!!emailError}
                            helperText={emailError}
                        />
                    </FieldWrapper>

                    <FieldWrapper>
                        <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor="senha" mb="5px">
                            Senha *
                        </Typography>
                        <CustomTextField
                            id="senha"
                            variant="outlined"
                            fullWidth
                            type="password"
                            value={senha}
                            onChange={(e: any) => setSenha(e.target.value)}
                            error={!!senhaError}
                            helperText={senhaError}
                        />
                    </FieldWrapper>

                    <FieldWrapper>
                        <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor="cpf" mb="5px">
                            CPF
                        </Typography>
                        <CustomTextField
                            id="cpf"
                            variant="outlined"
                            fullWidth
                            value={cpf}
                            onChange={handleCPFChange}
                            error={!!cpfError}
                            helperText={cpfError}
                            placeholder="Exemplo: 123.456.789-00"
                            inputProps={{ maxLength: 14 }}
                        />
                    </FieldWrapper>

                    <FieldWrapper>
                        <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor="rg" mb="5px">
                            RG
                        </Typography>
                        <CustomTextField
                            id="rg"
                            variant="outlined"
                            fullWidth
                            value={rg}
                            onChange={handleRGChange}
                            error={!!rgError}
                            helperText={rgError}
                            placeholder="Exemplo: 1.234.567"
                            inputProps={{ maxLength: 10 }}
                        />
                    </FieldWrapper>

                    {role === 'medico' && (
                        <>
                            <FieldWrapper>
                                <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor="crm" mb="5px">
                                    CRM *
                                </Typography>
                                <CustomTextField
                                    id="crm"
                                    variant="outlined"
                                    fullWidth
                                    value={crm}
                                    onChange={(e: any) => setCrm(e.target.value)}
                                    error={!!crmError}
                                    helperText={crmError}
                                    placeholder="Exemplo: 123456"
                                    inputProps={{ maxLength: 6 }}
                                />
                            </FieldWrapper>
                            <FieldWrapper>
                                <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor="especialidade" mb="5px">
                                    Especialidade Médica *
                                </Typography>
                                <FormControl fullWidth>
                                    <InputLabel>Especialidade</InputLabel>
                                    <Select
                                        value={especialidadeSelecionada}
                                        onChange={handleEspecialidadeChange}
                                    >
                                        {especialidade.map((esp, index) => (
                                            <MenuItem key={index} value={esp}>
                                                {esp}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </FieldWrapper>
                            <FieldWrapper>
                                <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor="inicioAtendimento" mb="5px">
                                    Horário de Início do Atendimento
                                </Typography>
                                <CustomTextField
                                    id="inicioAtendimento"
                                    variant="outlined"
                                    fullWidth
                                    value={inicioAtendimento}
                                    onChange={(e: any) => handleTimeChange(setInicioAtendimento, e)}
                                    placeholder="HH:MM"
                                    error={!!inicioAtendimentoError}
                                    helperText={inicioAtendimentoError}
                                    inputProps={{ maxLength: 5 }}
                                />
                            </FieldWrapper>
                            <FieldWrapper>
                                <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor="fimAtendimento" mb="5px">
                                    Horário de Término do Atendimento
                                </Typography>
                                <CustomTextField
                                    id="fimAtendimento"
                                    variant="outlined"
                                    fullWidth
                                    value={fimAtendimento}
                                    onChange={(e: any) => handleTimeChange(setFimAtendimento, e)}
                                    placeholder="HH:MM"
                                    error={!!fimAtendimentoError}
                                    helperText={fimAtendimentoError}
                                    inputProps={{ maxLength: 5 }}
                                />
                            </FieldWrapper>
                        </>
                    )}
                </Stack>

                <Button color="primary" variant="contained" size="large" fullWidth onClick={handleRegister} sx={{ maxWidth: '400px' }}>
                    Cadastrar
                </Button>
            </Box>

            <SnackbarAlert
                open={openSnackbar}
                onClose={handleCloseSnackbar}
                severity={snackbarSeverity}
                message={snackbarMessage}
            />

            {subtitle}
        </>
    );
};

export default AuthRegister;