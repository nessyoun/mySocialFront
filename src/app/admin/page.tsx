"use client";

import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';
import AppShell from '@/components/layout/AppShell';
import Guard from '@/components/auth/Guard';

export default function AdminPage() {
  const router = useRouter();

  const adminModules = [
    {
      title: 'Gestion des utilisateurs',
      description: 'Créer, modifier et gérer les comptes utilisateurs',
      icon: 'pi pi-users',
      href: '/admin/users',
      color: 'bg-blue-500'
    },
    {
      title: 'Rôles et permissions',
      description: 'Configurer les rôles et leurs autorisations',
      icon: 'pi pi-lock',
      href: '/admin/roles',
      color: 'bg-purple-500'
    },
    {
      title: 'Catégories et formulaires',
      description: 'Gérer les catégories et modèles de formulaires',
      icon: 'pi pi-list',
      href: '/admin/categories',
      color: 'bg-green-500'
    },
    {
      title: 'Modèles d\'emails',
      description: 'Créer et modifier les templates d\'emails',
      icon: 'pi pi-envelope',
      href: '/admin/email-templates',
      color: 'bg-orange-500'
    },
    {
      title: 'Import/Export',
      description: 'Importer et exporter les données',
      icon: 'pi pi-upload',
      href: '/admin/import-export',
      color: 'bg-indigo-500'
    },
    {
      title: 'Journaux d\'audit',
      description: 'Consulter les logs et activités système',
      icon: 'pi pi-history',
      href: '/admin/audit-logs',
      color: 'bg-gray-500'
    }
  ];

  return (
    <Guard role="admin">
      <AppShell>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Administration</h1>
            <p className="text-gray-600">Gestion et configuration du système</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminModules.map((module) => (
              <Card key={module.href} className="hover:shadow-lg transition-shadow cursor-pointer">
                <div 
                  className="space-y-4"
                  onClick={() => router.push(module.href)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 ${module.color} rounded-lg flex items-center justify-center`}>
                      <i className={`${module.icon} text-white text-xl`}></i>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{module.title}</h3>
                  </div>
                  
                  <p className="text-gray-600 text-sm">{module.description}</p>
                  
                  <Button
                    label="Accéder"
                    icon="pi pi-arrow-right"
                    text
                    className="w-full justify-center"
                  />
                </div>
              </Card>
            ))}
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
            <Card className="text-center">
              <div className="text-2xl font-bold text-blue-600">3,420</div>
              <div className="text-sm text-gray-600">Utilisateurs totaux</div>
            </Card>
            
            <Card className="text-center">
              <div className="text-2xl font-bold text-green-600">15</div>
              <div className="text-sm text-gray-600">Activités actives</div>
            </Card>
            
            <Card className="text-center">
              <div className="text-2xl font-bold text-orange-600">89</div>
              <div className="text-sm text-gray-600">Demandes en attente</div>
            </Card>
            
            <Card className="text-center">
              <div className="text-2xl font-bold text-purple-600">5</div>
              <div className="text-sm text-gray-600">Rôles configurés</div>
            </Card>
          </div>
        </div>
      </AppShell>
    </Guard>
  );
}