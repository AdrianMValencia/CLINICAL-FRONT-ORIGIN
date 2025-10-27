export interface INavbarData {
  menuId?: number;
  route: string;
  icon: string;
  label: string;
  expanded?: boolean;
  items?: INavbarData[];
}

export const navbarData: INavbarData[] = [
  {
    route: 'dashboard',
    icon: 'dashboard',
    label: 'Dashboard',
  },
  {
    route: 'patients',
    icon: 'personal_injury',
    label: 'Pacientes',
  },
  {
    route: 'doctors',
    icon: 'person_add',
    label: 'Médicos',
  },
  {
    route: 'analysis',
    icon: 'troubleshoot',
    label: 'Análisis',
  },
  {
    route: 'exams',
    icon: 'assignment',
    label: 'Exámenes',
  },
  {
    route: 'take-exams',
    icon: 'checklist',
    label: 'Realizar exámenes',
  },
  {
    route: 'results',
    icon: 'monitor_heart',
    label: 'Resultados',
  },
  {
    route: 'users',
    icon: 'group',
    label: 'Usuarios',
  },
  {
    route: 'roles',
    icon: 'add_moderator',
    label: 'Roles',
  }
];
