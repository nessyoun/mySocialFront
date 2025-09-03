import { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { EligibilityRules } from '@/lib/rules';

interface RankingItem {
  userId: string;
  userName: string;
  matricule: string;
  points: number;
  anciennete: number;
  rank: number;
  statut: 'confirmee' | 'en_attente' | 'liste_attente';
}

interface RankingViewProps {
  activiteId: string;
  inscriptions: Array<{
    userId: string;
    userName: string;
    matricule: string;
    points: number;
    anciennete: number;
    dateInscription: string;
  }>;
  capacite: number;
  onExport?: () => void;
}

export default function RankingView({
  activiteId,
  inscriptions,
  capacite,
  onExport
}: RankingViewProps) {
  const [ranking, setRanking] = useState<RankingItem[]>([]);

  useEffect(() => {
    // Calculate ranking using centralized rules
    const rankedInscriptions = EligibilityRules.calculateRanking(inscriptions);
    
    const rankingWithStatus: RankingItem[] = rankedInscriptions.map((item, index) => {
      const inscription = inscriptions.find(i => i.userId === item.userId)!;
      
      return {
        userId: item.userId,
        userName: inscription.userName,
        matricule: inscription.matricule,
        points: item.points,
        anciennete: item.anciennete,
        rank: item.rank,
        statut: index < capacite ? 'confirmee' : 'liste_attente'
      };
    });

    setRanking(rankingWithStatus);
  }, [inscriptions, capacite]);

  const rankBodyTemplate = (rowData: RankingItem) => {
    return (
      <div className="flex items-center gap-2">
        <span className="font-semibold">#{rowData.rank}</span>
        {rowData.rank <= 3 && (
          <i className={`pi ${
            rowData.rank === 1 ? 'pi-star-fill text-yellow-500' :
            rowData.rank === 2 ? 'pi-star-fill text-gray-400' :
            'pi-star-fill text-orange-500'
          }`} />
        )}
      </div>
    );
  };

  const statutBodyTemplate = (rowData: RankingItem) => {
    const severity = rowData.statut === 'confirmee' ? 'success' : 'warning';
    const label = rowData.statut === 'confirmee' ? 'Confirmée' : 'Liste d\'attente';
    
    return <Tag value={label} severity={severity} />;
  };

  const exportToCsv = () => {
    const csvContent = [
      ['Rang', 'Matricule', 'Nom', 'Points', 'Ancienneté', 'Statut'],
      ...ranking.map(item => [
        item.rank,
        item.matricule,
        item.userName,
        item.points,
        item.anciennete,
        item.statut === 'confirmee' ? 'Confirmée' : 'Liste d\'attente'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `classement-activite-${activiteId}.csv`;
    link.click();
    
    onExport?.();
  };

  const header = (
    <div className="flex justify-between items-center">
      <div>
        <h3 className="text-lg font-semibold m-0">Classement des inscriptions</h3>
        <p className="text-sm text-gray-600 mt-1">
          {ranking.filter(r => r.statut === 'confirmee').length} confirmées sur {capacite} places
        </p>
      </div>
      <Button
        label="Exporter CSV"
        icon="pi pi-download"
        onClick={exportToCsv}
        outlined
      />
    </div>
  );

  return (
    <div className="card">
      <DataTable
        value={ranking}
        header={header}
        paginator
        rows={20}
        loading={false}
        showGridlines
        stripedRows
        className="p-datatable-sm"
      >
        <Column
          field="rank"
          header="Rang"
          body={rankBodyTemplate}
          style={{ width: '80px' }}
          sortable
        />
        <Column
          field="matricule"
          header="Matricule"
          style={{ width: '120px' }}
          sortable
        />
        <Column
          field="userName"
          header="Nom complet"
          sortable
        />
        <Column
          field="points"
          header="Points"
          style={{ width: '100px' }}
          sortable
        />
        <Column
          field="anciennete"
          header="Ancienneté"
          style={{ width: '120px' }}
          sortable
          body={(rowData) => `${rowData.anciennete} ans`}
        />
        <Column
          field="statut"
          header="Statut"
          body={statutBodyTemplate}
          style={{ width: '140px' }}
        />
      </DataTable>
    </div>
  );
}