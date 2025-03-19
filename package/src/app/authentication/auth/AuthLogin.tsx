import React, {useState} from "react";
import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Button,
  Stack,
  Checkbox,
  Alert,
} from "@mui/material";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation"
import Cookies from 'js-cookie';

import CustomTextField from "@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField";

interface loginType {
  title?: string;
  subtitle?: JSX.Element | JSX.Element[];
  subtext?: JSX.Element | JSX.Element[];
}

const AuthLogin = ({ title, subtitle, subtext }: loginType) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); // Hook para navegação
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault(); // Evita o recarregamento da página ao enviar o formulário

  try {
    const response = await axios.post("http://localhost:8084/clinix_brazil_requisicoes/login/validacao", {
      username,
      password,
    });

    const token = response.data.token;

    // Armazena o token em um cookie seguro
    Cookies.set('jwt', token, { expires: 7 }); // Expires in 7 days

    // Redireciona para a página inicial
    router.push('/');

  } catch (error: any) {
    setError('Invalid username or password.');
    console.error("Login error:", error); // Log the error for debugging
  }
};


  return (
    <>
      {title && (
          <Typography fontWeight="700" variant="h2" mb={1}>
            {title}
          </Typography>
      )}

      {subtext}

      <form onSubmit={handleLogin}>
        <Stack>
          <Box>
            <Typography
                variant="subtitle1"
                fontWeight={600}
                component="label"
                htmlFor="username"
                mb="5px"
            >
              Usuário
            </Typography>
            <CustomTextField
                variant="outlined"
                fullWidth
                value={username}
                onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setUsername(e.target.value)}
            />
          </Box>
          <Box mt="25px">
            <Typography
                variant="subtitle1"
                fontWeight={600}
                component="label"
                htmlFor="password"
                mb="5px"
            >
              Senha
            </Typography>
            <CustomTextField
                type="password"
                variant="outlined"
                fullWidth
                value={password}
                onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setPassword(e.target.value)}
            />
          </Box>
          <Stack
              justifyContent="space-between"
              direction="row"
              alignItems="center"
              my={2}
          >
            <FormGroup>
              <FormControlLabel
                  control={<Checkbox defaultChecked />}
                  label="Lembrar deste dispositivo"
              />
            </FormGroup>
            <Typography
                component={Link}
                href="/"
                fontWeight="500"
                sx={{
                  textDecoration: "none",
                  color: "primary.main",
                }}
            >
              Esqueceu sua senha?
            </Typography>
          </Stack>
        </Stack>
        {error && <Alert severity="error">{error}</Alert>}
        <Box>
          <Button color="primary" variant="contained" size="large" fullWidth type="submit">
            Acessar
          </Button>
        </Box>
      </form>

      {subtitle}
    </>
);
};

export default AuthLogin;
