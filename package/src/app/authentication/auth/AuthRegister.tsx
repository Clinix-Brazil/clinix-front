import React, { useState, ChangeEvent, useEffect } from "react";
import {
    Box,
    Typography,
    Button,
    RadioGroup,
    FormControlLabel,
    Radio,
    Snackbar,
    Alert,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
} from "@mui/material";
import CustomTextField from "@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField";
import { Stack, styled } from "@mui/system";
import {
    CREATE_PACIENTE,
    CREATE_MEDICO,
    CREATE_GERENTE,
    LIST_ESPECIALIDADES,
} from "@/app/APIroutes";
import CustomRadioGroup from "./CustomRadioGroup";
import SnackbarAlert from "./SnackbarAlert";
import {
    validateName,
    validateUsername,
    validateEmail,
    validatePassword,
    validateCPF,
    validateRG,
    validateCRM,
    formatNumber,
} from "./validations";
import axios from "axios"; // Importe o axios
import { useRouter } from "next/navigation"; // Use o useRouter do Next.js

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

interface RegistrationData {
    nome: string;
    nomeUsuario: string;
    email: string;
    senha: string;
    cpf: string;
    rg: string;
    role: "paciente" | "medico" | "gerente";
    crm?: string;
    inicioAtendimento?: string;
    fimAtendimento?: string;
    especialidade?: string;
}

const AuthRegister: React.FC<AuthRegisterProps> = ({
    title,
    subtitle,
    subtext,
}) => {
    const [registrationData, setRegistrationData] = useState<RegistrationData>({
        nome: "",
        nomeUsuario: "",
        email: "",
        senha: "",
        cpf: "",
        rg: "",
        role: "paciente",
    });

    const [crm, setCrm] = useState<string>("");
    const [inicioAtendimento, setInicioAtendimento] = useState<string>("");
    const [fimAtendimento, setFimAtendimento] = useState<string>("");
    const [especialidade, setEspecialidade] = useState<string[]>([]);
    const [especialidadeSelecionada, setEspecialidadeSelecionada] = useState("");

    const [nomeError, setNomeError] = useState<string>("");
    const [nomeUsuarioError, setNomeUsuarioError] = useState<string>("");
    const [emailError, setEmailError] = useState<string>("");
    const [senhaError, setSenhaError] = useState<string>("");
    const [cpfError, setCpfError] = useState<string>("");
    const [rgError, setRgError] = useState<string>("");
    const [crmError, setCrmError] = useState<string>("");
    const [inicioAtendimentoError, setInicioAtendimentoError] =
        useState<string>("");
    const [fimAtendimentoError, setFimAtendimentoError] = useState<string>("");

    //Snackbar
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = React.useState<
        "success" | "error"
    >("success");

    const router = useRouter(); // Inicialize o useRouter

    const handleInputChange = (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = event.target;
        setRegistrationData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleRoleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const role = event.target.value as "paciente" | "medico" | "gerente";
        setRegistrationData((prevData) => ({ ...prevData, role }));
        // Limpa campos específicos ao mudar de role
        setCrm("");
        setInicioAtendimento("");
        setFimAtendimento("");

        setNomeError("");
        setNomeUsuarioError("");
        setEmailError("");
        setSenhaError("");
        setCpfError("");
        setRgError("");
        setCrmError("");
        setInicioAtendimentoError("");
        setFimAtendimentoError("");
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
        const formattedCPF = formatNumber(e.target.value, "XXX.XXX.XXX-XX");
        setRegistrationData((prevData) => ({ ...prevData, cpf: formattedCPF }));
    };

    const handleRGChange = (e: any) => {
        const formattedRG = formatNumber(e.target.value, "X.XXX.XXX");
        setRegistrationData((prevData) => ({ ...prevData, rg: formattedRG }));
    };

    const handleTimeChange = (setter: (value: string) => void, e: any) => {
        const formattedTime = formatNumber(e.target.value, "XX:XX");
        setter(formattedTime);
    };

    const handleCloseSnackbar = (
        event?: React.SyntheticEvent | Event,
        reason?: string
    ) => {
        if (reason === "clickaway") {
            return;
        }
        setOpenSnackbar(false);
    };

    const handleRegister = async () => {
        let isValid = true;

        // Validar campos
        if (!validateName(registrationData.nome)) {
            setNomeError("Nome inválido.");
            isValid = false;
        } else {
            setNomeError(""); // Limpa o erro se for válido
        }

        if (!validateUsername(registrationData.nomeUsuario)) {
            setNomeUsuarioError("Nome de usuário inválido.");
            isValid = false;
        } else {
            setNomeUsuarioError(""); // Limpa o erro se for válido
        }

        if (!validateEmail(registrationData.email)) {
            setEmailError("E-mail inválido.");
            isValid = false;
        } else {
            setEmailError(""); // Limpa o erro se for válido
        }

        if (!validatePassword(registrationData.senha)) {
            setSenhaError("Senha inválida (mínimo de 5 caracteres).");
            isValid = false;
        } else {
            setSenhaError(""); // Limpa o erro se for válido
        }

        if (registrationData.cpf && !validateCPF(registrationData.cpf)) {
            setCpfError("CPF inválido.");
            isValid = false;
        } else {
            setCpfError(""); // Limpa o erro se for válido
        }

        if (registrationData.rg && !validateRG(registrationData.rg)) {
            setRgError("RG inválido.");
            isValid = false;
        } else {
            setRgError(""); // Limpa o erro se for válido
        }

        //Validar crm
        if (registrationData.role === "medico" && !validateCRM(crm)) {
            setCrmError("CRM inválido");
            isValid = false;
        } else if (registrationData.role === "medico") {
            setCrmError(""); // Limpa o erro se for válido
        }

        if (!isValid) {
            return;
        }

        let specificData: any = {};
        let createSpecificUrl = "";

        switch (registrationData.role) {
            case "paciente":
                createSpecificUrl = CREATE_PACIENTE();
                break;
            case "medico":
                createSpecificUrl = CREATE_MEDICO();
                specificData = {
                    crm: crm,
                    inicioAtendimento: inicioAtendimento,
                    fimAtendimento: fimAtendimento,
                    especialidade: especialidadeSelecionada,
                };
                break;
            case "gerente":
                createSpecificUrl = CREATE_GERENTE();
                break;
            default:
                console.error("Perfil inválido");
                return;
        }

        try {
            // Combine registrationData and specificData
            const combinedData = { ...registrationData, ...specificData };
            console.log("Combined Data:", combinedData);

            const response = await axios.post(createSpecificUrl, combinedData, {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true, // Envie cookies com a requisição (se necessário)
            });

            if (response.status !== 200 && response.status !== 201) {
                // Verifique se o status é diferente de 200 OK ou 201 Created
                setSnackbarMessage(
                    response.data.message || "Erro ao cadastrar perfil específico"
                );
                setSnackbarSeverity("error");
                setOpenSnackbar(true);
                throw new Error(
                    response.data.message || "Erro ao cadastrar perfil específico"
                );
            }

            setSnackbarMessage(
                "Usuário cadastrado com sucesso! Por favor, faça o login."
            );
            setSnackbarSeverity("success");
            setOpenSnackbar(true);
            setTimeout(() => {
                router.push("/authentication/login"); // Redirecione para a página de login
            }, 4000);
        } catch (error: any) {
            console.error(error);
            setSnackbarMessage(
                `Erro ao cadastrar usuário: ${error.response?.data?.message || error.message
                }`
            ); // Acessa a mensagem de erro corretamente
            setSnackbarSeverity("error");
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
                    <CustomRadioGroup
                        role={registrationData.role}
                        handleRoleChange={handleRoleChange}
                    />
                    <FieldWrapper>
                        <Typography
                            variant="subtitle1"
                            fontWeight={600}
                            component="label"
                            htmlFor="nome"
                            mb="5px"
                        >
                            Nome *
                        </Typography>
                        <CustomTextField
                            id="nome"
                            name="nome"
                            variant="outlined"
                            fullWidth
                            value={registrationData.nome}
                            onChange={handleInputChange}
                            error={!!nomeError}
                            helperText={nomeError}
                        />
                    </FieldWrapper>

                    <FieldWrapper>
                        <Typography
                            variant="subtitle1"
                            fontWeight={600}
                            component="label"
                            htmlFor="nomeUsuario"
                            mb="5px"
                        >
                            Nome de usuário *
                        </Typography>
                        <CustomTextField
                            id="nomeUsuario"
                            name="nomeUsuario"
                            variant="outlined"
                            fullWidth
                            value={registrationData.nomeUsuario}
                            onChange={handleInputChange}
                            error={!!nomeUsuarioError}
                            helperText={nomeUsuarioError}
                        />
                    </FieldWrapper>

                    <FieldWrapper>
                        <Typography
                            variant="subtitle1"
                            fontWeight={600}
                            component="label"
                            htmlFor="email"
                            mb="5px"
                        >
                            E-mail *
                        </Typography>
                        <CustomTextField
                            id="email"
                            name="email"
                            variant="outlined"
                            fullWidth
                            value={registrationData.email}
                            onChange={handleInputChange}
                            error={!!emailError}
                            helperText={emailError}
                        />
                    </FieldWrapper>

                    <FieldWrapper>
                        <Typography
                            variant="subtitle1"
                            fontWeight={600}
                            component="label"
                            htmlFor="senha"
                            mb="5px"
                        >
                            Senha *
                        </Typography>
                        <CustomTextField
                            id="senha"
                            name="senha"
                            variant="outlined"
                            fullWidth
                            type="password"
                            value={registrationData.senha}
                            onChange={handleInputChange}
                            error={!!senhaError}
                            helperText={senhaError}
                        />
                    </FieldWrapper>

                    <FieldWrapper>
                        <Typography
                            variant="subtitle1"
                            fontWeight={600}
                            component="label"
                            htmlFor="cpf"
                            mb="5px"
                        >
                            CPF
                        </Typography>
                        <CustomTextField
                            id="cpf"
                            name="cpf"
                            variant="outlined"
                            fullWidth
                            value={registrationData.cpf}
                            onChange={handleCPFChange}
                            error={!!cpfError}
                            helperText={cpfError}
                            placeholder="Exemplo: 123.456.789-00"
                            inputProps={{ maxLength: 14 }}
                        />
                    </FieldWrapper>

                    <FieldWrapper>
                        <Typography
                            variant="subtitle1"
                            fontWeight={600}
                            component="label"
                            htmlFor="rg"
                            mb="5px"
                        >
                            RG
                        </Typography>
                        <CustomTextField
                            id="rg"
                            name="rg"
                            variant="outlined"
                            fullWidth
                            value={registrationData.rg}
                            onChange={handleRGChange}
                            error={!!rgError}
                            helperText={rgError}
                            placeholder="Exemplo: 1.234.567"
                            inputProps={{ maxLength: 10 }}
                        />
                    </FieldWrapper>

                    {registrationData.role === "medico" && (
                        <>
                            <FieldWrapper>
                                <Typography
                                    variant="subtitle1"
                                    fontWeight={600}
                                    component="label"
                                    htmlFor="crm"
                                    mb="5px"
                                >
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
                                <Typography
                                    variant="subtitle1"
                                    fontWeight={600}
                                    component="label"
                                    htmlFor="especialidade"
                                    mb="5px"
                                >
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
                                <Typography
                                    variant="subtitle1"
                                    fontWeight={600}
                                    component="label"
                                    htmlFor="inicioAtendimento"
                                    mb="5px"
                                >
                                    Horário de Início do Atendimento
                                </Typography>
                                <CustomTextField
                                    id="inicioAtendimento"
                                    variant="outlined"
                                    fullWidth
                                    value={inicioAtendimento}
                                    onChange={(e: any) =>
                                        handleTimeChange(setInicioAtendimento, e)
                                    }
                                    placeholder="HH:MM"
                                    error={!!inicioAtendimentoError}
                                    helperText={inicioAtendimentoError}
                                    inputProps={{ maxLength: 5 }}
                                />
                            </FieldWrapper>
                            <FieldWrapper>
                                <Typography
                                    variant="subtitle1"
                                    fontWeight={600}
                                    component="label"
                                    htmlFor="fimAtendimento"
                                    mb="5px"
                                >
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

                <Button
                    color="primary"
                    variant="contained"
                    size="large"
                    fullWidth
                    onClick={handleRegister}
                    sx={{ maxWidth: "400px" }}
                >
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