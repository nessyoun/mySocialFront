import type { MenuItem } from 'primereact/menuitem';

export const navItems: MenuItem[] = [
  {
    label: 'Home',
    icon: 'pi pi-home',
    url: '/',
    },
  {
    label: 'Users',
    icon: 'pi pi-users',
    items: [
      { label: 'All Users', icon: 'pi pi-list', url: '/users' },
      { label: 'Create User', icon: 'pi pi-user-plus', url: '/users/new' },
    ],
  },
  {
    label: 'Roles',
    icon: 'pi pi-users',
    items: [
      { label: 'All Users', icon: 'pi pi-list', url: '/users' },
      { label: 'Create User', icon: 'pi pi-user-plus', url: '/users/new' },
    ],
  },
  {
    label: 'Activities',
    icon: 'pi pi-flag-fill',
    items: [
      { label: 'Consulter les activités', icon: 'pi pi-bolt', url: '/posts' },
      { label: 'Voir les inscriptions', icon: 'pi pi-file', url: '/posts/drafts' },
    ],
  },
  {
    label: 'Settings',
    icon: 'pi pi-cog',
    url: '/settings',
  },
];