'use client'
import { Grid, Box, Typography } from '@mui/material';
import MSidebarMedico from '../(DashboardLayout)/layout/sidebar/SidebarMedico';
import Header from '../(DashboardLayout)/layout/header/Header';
import { useState } from 'react';
import Dashboard from '../(DashboardLayout)/page';

const EmployeeDashboard = () => {
  // Defina os estados para controlar a abertura e fechamento do menu (se necessário)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Exemplo: Inicia aberto
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
    setIsMobileSidebarOpen(false);
  };

  const handleSidebarOpen = () => {
    setIsSidebarOpen(true);
  };

  const toggleMobileSidebar = (event: React.MouseEvent<HTMLElement>) => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}> {/* Layout com menu lateral */}
      <MSidebarMedico // Renderiza o menu lateral do paciente
        isSidebarOpen={isSidebarOpen}
        isMobileSidebarOpen={isMobileSidebarOpen}
        onSidebarClose={handleSidebarClose}
      />
      <Box sx={{ flexGrow: 1 }}> {/* Adicione um Box para envolver o Header e o PageContainer */}
        <Header toggleMobileSidebar={toggleMobileSidebar} /> {/* Renderiza o Header */}
        <Dashboard></Dashboard>
      </Box>
    </Box>
  );
};

export default EmployeeDashboard;