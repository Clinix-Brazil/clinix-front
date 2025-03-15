'use client'
import { Box, Typography, styled } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import Image from 'next/image';

// No styled components here, since it's just basic positioning

const Dashboard = () => {
    return (
        <PageContainer title="Clinix" description="Sua ferramenta de gestão de saúde">
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {/* Image positioned as the first element */}
                <Box sx={{ marginBottom: 2 }}> {/* Adjust margin as needed */}
                    <Image
                        src="/images/logos/medicos.webp"
                        alt="Medicos"
                        width={300} // Or whatever the actual image width is
                        height={50}  // Or whatever the actual image height is
                        style={{
                            maxWidth: '100%', // Ensures it doesn't overflow the container
                            height: 'auto',   // Maintains aspect ratio
                            display: 'block',  // Removes extra space below the image
                            borderRadius: '50%'
                        }}
                    />
                </Box>

                <Typography variant="h1" sx={{ fontWeight: 700, fontSize: '3rem', marginBottom: 2, color: 'primary.main' }}>Clinix</Typography>
                <Typography variant="h1" sx={{ fontSize: '1.5rem', marginBottom: 4, color: 'text.secondary' }}>Sua ferramenta de gestão de saúde</Typography>
                <Typography variant="h6" sx={{ fontSize: '1rem', marginBottom: 4, color: 'text.secondary' }}>Utilize os menus ao lado para navegar pelos módulos do sistema</Typography>
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
