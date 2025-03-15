'use client';

import { Box, Button, Container, Grid, Typography, Avatar, useMediaQuery } from '@mui/material';
import Link from "next/link";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import Timeline from '@mui/lab/Timeline/Timeline';
import timelineOppositeContentClasses from '@mui/lab/TimelineOppositeContent/timelineOppositeContentClasses';
import TimelineItem from '@mui/lab/TimelineItem/TimelineItem';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent/TimelineOppositeContent';
import TimelineSeparator from '@mui/lab/TimelineSeparator/TimelineSeparator';
import TimelineDot from '@mui/lab/TimelineDot/TimelineDot';
import TimelineConnector from '@mui/lab/TimelineConnector/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent/TimelineContent';
import { useTheme } from '@mui/material/styles';
import Image from 'next/image'; // Importe o componente Image

const LandingPage = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <PageContainer title="Clinix" description="Sua ferramenta para saúde e gestão.">
      <div>
        {/* Hero Section */}
        <Box
  sx={{
    textAlign: 'center',
    py: 12,
    bgcolor: 'primary.main',
    color: 'white',
    backgroundImage: 'url(/images/backgrounds/hero.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.5)',
    },
  }}
>
  <Container sx={{ position: 'relative', zIndex: 1 }}>
    <Image
      src="/images/logos/dark-logo.svg" // Caminho para o SVG
      alt="Clinix Logo" // Texto alternativo para acessibilidade
      width={200} // Defina a largura desejada
      height={50} // Defina a altura desejada
      style={{
        maxWidth: '100%', // Garante que a imagem não ultrapasse o container
        height: 'auto', // Mantém a proporção da imagem
      }}
    />
    <Typography
      variant="h5"
      sx={{
        mt: 2,
        color: 'white',
        fontWeight: 'normal',
        fontSize: isSmallScreen ? '1.2rem' : '1.5rem',
      }}
    >
      Sua ferramenta para saúde e gestão.
    </Typography>
    <Button
      variant="contained"
      color="primary"
      sx={{
        mt: 4,
        px: 4,
        py: 2,
        fontSize: '1.2rem',
        fontWeight: 'bold',
        '&:hover': {
          opacity: 0.9,
        },
      }}
      component={Link}
      href="/authentication/register"
    >
      Cadastrar
    </Button>
  </Container>
</Box>

        {/* Features Section */}
        <Container sx={{ mt: 8, mb: 8 }}>
          <Typography variant="h4" textAlign="center" fontWeight="bold" mb={4}>
            Recursos Poderosos
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <FeatureList
                features={[
                  'Agendamento de Consultas Simplificado',
                  'Prontuários Digitais Seguros',
                  'Relatórios Personalizados e Detalhados',
                ]}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FeatureList
                features={[
                  'Gestão Financeira Integrada',
                  'Notificações e Lembretes Automáticos',
                  'Acesso Multiplataforma (Web e Mobile)',
                ]}
              />
            </Grid>
          </Grid>
        </Container>

        {/* Testimonials Section */}
        <Box sx={{ bgcolor: 'grey.100', py: 8 }}>
          <Container>
            <Typography variant="h4" textAlign="center" fontWeight="bold" mb={4}>
              O que nossos clientes dizem
            </Typography>
            <Grid container spacing={3}>
              <TestimonialCard
                name="Dr. João"
                testimonial="Clinix transformou minha clínica! Muito mais organização e eficiência."
                avatar="/images/avatars/avatar1.jpg" // Substitua pelo caminho do avatar
              />
              <TestimonialCard
                name="Dra. Maria"
                testimonial="Ferramenta indispensável para qualquer profissional de saúde."
                avatar="/images/avatars/avatar2.jpg" // Substitua pelo caminho do avatar
              />
              <TestimonialCard
                name="Enfermeira Clara"
                testimonial="Facilidade de uso e suporte excelente. Recomendo!"
                avatar="/images/avatars/avatar3.jpg" // Substitua pelo caminho do avatar
              />
            </Grid>
          </Container>
        </Box>

        {/* CTA Section */}
        <Container sx={{ textAlign: 'center', py: 6 }}>
          <Typography variant="h5" fontWeight="bold" mb={3}>
            Pronto para transformar sua clínica?
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ mx: 2, px: 4, py: 2, fontSize: '1.1rem', fontWeight: 'bold' }}
            component={Link}
            href="/authentication/register"
          >
            Cadastrar
          </Button>
          <Button variant="outlined" color="primary" sx={{ mx: 2, px: 4, py: 2, fontSize: '1.1rem' }}>
            Entrar em contato
          </Button>
        </Container>

        {/* Footer */}
        <Box sx={{ bgcolor: 'primary.dark', color: 'white', textAlign: 'center', py: 3 }}>
          <Typography variant="body2">© 2025 Clinix. Todos os direitos reservados.</Typography>
        </Box>
      </div>
    </PageContainer>
  );
};

// Componente auxiliar para a lista de recursos
const FeatureList = ({ features }: { features: string[] }) => (
  <ul>
    {features.map((feature, index) => (
      <li key={index} style={{ marginBottom: '0.5rem', fontSize: '1.1rem', listStyleType: 'disc', marginLeft: '1.5rem' }}>
        {feature}
      </li>
    ))}
  </ul>
);

// Componente auxiliar para os depoimentos
const TestimonialCard = ({ name, testimonial, avatar }: { name: string; testimonial: string; avatar: string }) => (
  <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
    <Avatar sx={{ width: 56, height: 56, mx: 'auto', mb: 2 }} src={avatar} />
    <Typography variant="body1" fontWeight="medium" mb={1}>
      "{testimonial}"
    </Typography>
    <Typography variant="subtitle2">- {name}</Typography>
  </Grid>
);

export default LandingPage;
