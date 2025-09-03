import { useState } from 'react';
import { Sidebar } from 'primereact/sidebar';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { Menu } from 'primereact/menu';
import { MenuItem } from 'primereact/menuitem';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/lib/auth';
import Link from 'next/link';

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [userMenuVisible, setUserMenuVisible] = useState(false);
  const router = useRouter();
  const user = AuthService.getCurrentUser();

  const handleLogout = async () => {
    await AuthService.logout();
    router.push('/login');
  };

  const userMenuItems: MenuItem[] = [
    {
      label: 'Profil',
      icon: 'pi pi-user',
      command: () => router.push('/profile')
    },
    {
      label: 'Paramètres',
      icon: 'pi pi-cog',
      command: () => router.push('/settings')
    },
    {
      separator: true
    },
    {
      label: 'Déconnexion',
      icon: 'pi pi-sign-out',
      command: handleLogout
    }
  ];

  const navigationItems = [
    {
      label: 'Tableau de bord',
      icon: 'pi pi-home',
      href: '/dashboard',
      roles: ['admin', 'back-office', 'superviseur']
    },
    {
      label: 'Activités',
      icon: 'pi pi-calendar',
      href: '/activites',
      roles: ['admin', 'back-office', 'superviseur', 'delegue', 'collaborateur']
    },
    {
      label: 'Mes inscriptions',
      icon: 'pi pi-list',
      href: '/mes-inscriptions',
      roles: ['collaborateur', 'delegue']
    },
    {
      label: 'Administration',
      icon: 'pi pi-cog',
      href: '/admin',
      roles: ['admin', 'back-office']
    }
  ];

  const filteredNavItems = navigationItems.filter(item => 
    !user || item.roles.includes(user.role)
  );

  const leftContent = (
    <div className="flex items-center gap-2">
      <Button
        icon="pi pi-bars"
        onClick={() => setSidebarVisible(!sidebarVisible)}
        text
        severity="secondary"
      />
      <span className="text-xl font-semibold text-gray-800">Backoffice Social</span>
    </div>
  );

  const rightContent = (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600 hidden md:block">
        {user?.firstName} {user?.lastName}
      </span>
      <Avatar
        label={user ? `${user.firstName[0]}${user.lastName[0]}` : 'U'}
        shape="circle"
        className="cursor-pointer"
        onClick={() => setUserMenuVisible(true)}
      />
      <Menu
        model={userMenuItems}
        popup
        ref={(el) => el?.toggle}
        onHide={() => setUserMenuVisible(false)}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Toolbar
        left={leftContent}
        right={rightContent}
        className="border-b border-gray-200 bg-white shadow-sm"
      />

      <Sidebar
        visible={sidebarVisible}
        onHide={() => setSidebarVisible(false)}
        modal={false}
        className="bg-white border-r border-gray-200"
        style={{ width: '280px' }}
      >
        <div className="p-4">
          <nav className="space-y-2">
            {filteredNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <i className={item.icon}></i>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </Sidebar>

      <main className={`transition-all duration-200 ${sidebarVisible ? 'ml-280' : 'ml-0'}`}>
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}