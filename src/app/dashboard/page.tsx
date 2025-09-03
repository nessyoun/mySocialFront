"use client";

import { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import { Chart } from 'primereact/chart';
import { ProgressBar } from 'primereact/progressbar';
import AppShell from '@/components/layout/AppShell';
import Guard from '@/components/auth/Guard';
import { DashboardKPI } from '@/lib/types';
import { mockDashboardKPI } from '@/lib/mock-data';

export default function DashboardPage() {
  const [kpis, setKpis] = useState<DashboardKPI | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO(api): Replace with real API call
    setTimeout(() => {
      setKpis(mockDashboardKPI);
      setLoading(false);
    }, 1000);
  }, []);

  const budgetUtilisationPercent = kpis ? (kpis.budgetUtilise / kpis.budgetTotal) * 100 : 0;

  const chartData = {
    labels: ['Confirmées', 'En attente', 'Annulées'],
    datasets: [
      {
        data: [756, 89, 402],
        backgroundColor: ['#10B981', '#F59E0B', '#EF4444'],
        hoverBackgroundColor: ['#059669', '#D97706', '#DC2626']
      }
    ]
  };

  const chartOptions = {
    plugins: {
      legend: {
        position: 'bottom' as const
      }
    }
  };

  if (loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </AppShell>
    );
  }

  return (
    <Guard role="superviseur">
      <AppShell>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
            <p className="text-gray-600">Vue d'ensemble des activités sociales</p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total demandes</p>
                  <p className="text-2xl font-bold">{kpis?.totalDemandes.toLocaleString()}</p>
                </div>
                <i className="pi pi-file text-2xl text-blue-200"></i>
              </div>
            </Card>

            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">En attente</p>
                  <p className="text-2xl font-bold">{kpis?.demandesEnAttente}</p>
                </div>
                <i className="pi pi-clock text-2xl text-orange-200"></i>
              </div>
            </Card>

            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Activités actives</p>
                  <p className="text-2xl font-bold">{kpis?.activitesActives}</p>
                </div>
                <i className="pi pi-calendar text-2xl text-green-200"></i>
              </div>
            </Card>

            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Utilisateurs actifs</p>
                  <p className="text-2xl font-bold">{kpis?.utilisateursActifs.toLocaleString()}</p>
                </div>
                <i className="pi pi-users text-2xl text-purple-200"></i>
              </div>
            </Card>
          </div>

          {/* Charts and detailed info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title="Répartition des demandes" className="h-fit">
              <Chart type="doughnut" data={chartData} options={chartOptions} className="w-full md:w-30rem" />
            </Card>

            <Card title="Utilisation du budget" className="h-fit">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Budget utilisé</span>
                  <span className="text-sm text-gray-500">
                    {budgetUtilisationPercent.toFixed(1)}%
                  </span>
                </div>
                <ProgressBar 
                  value={budgetUtilisationPercent} 
                  className="h-3"
                  color={budgetUtilisationPercent > 80 ? '#EF4444' : '#10B981'}
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{kpis?.budgetUtilise.toLocaleString()} MAD</span>
                  <span>{kpis?.budgetTotal.toLocaleString()} MAD</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Recent activities */}
          <Card title="Activités récentes" className="mt-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <i className="pi pi-calendar text-blue-500"></i>
                  <div>
                    <p className="font-medium">Voyage à Marrakech</p>
                    <p className="text-sm text-gray-600">Module: Récréatives</p>
                  </div>
                </div>
                <Tag value="Publiée" severity="success" />
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <i className="pi pi-ticket text-purple-500"></i>
                  <div>
                    <p className="font-medium">Concert de musique andalouse</p>
                    <p className="text-sm text-gray-600">Module: Billetterie</p>
                  </div>
                </div>
                <Tag value="Publiée" severity="success" />
              </div>
            </div>
          </Card>
        </div>
      </AppShell>
    </Guard>
  );
}