import {
  IconAperture,
  IconCopy,
  IconLayoutDashboard,
  IconLogin,
  IconMoodHappy,
  IconUser,
  IconUserPlus,
  IconHeart,       // Pacientes
  IconStethoscope, // Médicos
  IconBuildingHospital, // Clínicas
  IconCalendarEvent, // Consultas
  IconShieldCheck,  // Gerentes (ou use IconUsers se preferir)
  IconUsers,       // Icone alternativo para Gerentes
  IconChartBar
} from "@tabler/icons-react";

import { uniqueId } from "lodash";

const Menuitems = [
  {
    navlabel: true,
    subheader: "Início",
  },

  {
    id: uniqueId(),
    title: "Painel geral",
    icon: IconLayoutDashboard,
    href: "/",
  },
  {
    navlabel: true,
    subheader: "Recursos",
  },
  // {
  //   id: uniqueId(),
  //   title: "Relatórios",
  //   icon: IconChartBar,
  //   href: "/utilities/shadow",
  // },
  {
    id: uniqueId(),
    title: "Pacientes",
    icon: IconHeart,
    href: "/list_pacientes",
  },
  {
    id: uniqueId(),
    title: "Clinicas",
    icon: IconBuildingHospital,
    href: "/list_clinicas",
  },
  {
    id: uniqueId(),
    title: "Médicos",
    icon: IconStethoscope,
    href: "/list_medicos",
  },
  {
    id: uniqueId(),
    title: "Gerentes",
    icon: IconUsers, // Ou IconUsers
    href: "/gerentes",
  },
  {
    id: uniqueId(),
    title: "Consultas",
    icon: IconCalendarEvent,
    href: "/list_consultas",
  },
  // {
  //   id: uniqueId(),
  //   title: "Exames",
  //   icon: IconAperture,
  //   href: "/utilities/typography",
  // },
  {
    navlabel: true,
    subheader: "Configurações",
  },
  {
    id: uniqueId(),
    title: "Meu perfil",
    icon: IconUser,
    href: "/userProfile",
  },
  {
    id: uniqueId(),
    title: "Logout",
    icon: IconLogin,
    href: "/landing",
  },
  // {
  //   id: uniqueId(),
  //   title: "Editar perfil",
  //   icon: IconUserPlus,
  //   href: "/authentication/register",
  // },
  // {
  //   navlabel: true,
  //   subheader: "Listagens",
  // },
  // {
  //   id: uniqueId(),
  //   title: "Solicitações",
  //   icon: IconMoodHappy,
  //   href: "/icons",
  // },
  // {
  //   id: uniqueId(),
  //   title: "resultados",
  //   icon: IconAperture,
  //   href: "/sample-page",
  // },
];

export default Menuitems;