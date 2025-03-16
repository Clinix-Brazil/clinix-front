'use client'
import React, { useState } from 'react';
import { Grid, Box, Typography } from '@mui/material';
import MSidebarPaciente from '../(DashboardLayout)/layout/sidebar/SidebarPaciente';
import Header from '../(DashboardLayout)/layout/header/Header';
import Dashboard from '../(DashboardLayout)/page';


const CustomerDashboard = () => {
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
      <MSidebarPaciente // Renderiza o menu lateral do paciente
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

export default CustomerDashboard;