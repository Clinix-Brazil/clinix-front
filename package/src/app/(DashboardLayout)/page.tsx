'use client'
import { Box, Typography, styled } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import Image from 'next/image';

const Dashboard = () => {
    return (
        <PageContainer title="Clinix" description="Sua ferramenta de gestão de saúde">
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box sx={{ marginBottom: 2 }}>
                    <Image
                        src="/images/logos/medicos.webp"
                        alt="Medicos"
                        width={300}
                        height={50}
                        style={{
                            maxWidth: '100%',
                            height: 'auto',
                            display: 'block',
                            borderRadius: '50%'
                        }}
                    />
                </Box>

                <Typography variant="h1" sx={{ fontWeight: 700, fontSize: '3rem', marginBottom: 2, color: 'primary.main' }}>Clinix</Typography>
                <Typography variant="h1" sx={{ fontSize: '1.5rem', marginBottom: 4, color: 'text.secondary' }}>Sua ferramenta de gestão de saúde</Typography>
                <Typography
                    variant="h6"
                    sx={{
                        fontSize: '1rem',
                        marginBottom: 4,
                        color: 'primary.main',
                        fontWeight: 500,
                        textShadow: '0.5px 0.5px 1px rgba(0, 0, 0, 0.1)'
                    }}
                >
                    Utilize os menus ao lado para navegar pelos módulos do sistema.
                </Typography>
                <Typography variant="body1" sx={{ fontSize: '1rem', color: 'text.secondary', marginBottom: 4 }}>
                    Clinix auxilia na sua gestão de saúde:
                </Typography>
                <Typography variant="body1" sx={{ fontSize: '1rem', color: 'text.secondary', marginBottom: 4 }}>
                <b>• Para clientes:</b> O melhor atendimento e melhor experiência de uso.
                </Typography>
                <Typography variant="body1" sx={{ fontSize: '1rem', color: 'text.secondary', marginBottom: 4 }}>
                <b>• Para profissionais:</b> Gerenciar todo o operacional da sua clínica de forma eficiente.
                </Typography>
                <Typography variant="body1" sx={{ fontSize: '1rem', color: 'text.secondary', marginBottom: 4 }}>
                    Utilize o botão <b>Fale conosco</b> para relatar possiveis problemas na plataforma.
                </Typography>
            </Box>
        </PageContainer>
    );
};

export default Dashboard;