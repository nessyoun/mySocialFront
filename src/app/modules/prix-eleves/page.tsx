"use client";

import { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { TabView, TabPanel } from 'primereact/tabview';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import SideMenu from '../../shared/nav-menu/SideMenu';
import { ActiveMenu } from '../../shared/nav-menu/activeMenu';
import Guard from '@/components/auth/Guard';

interface EleveNote {
  id: string;
  nom: string;
  prenom: string;
  niveau: string;
  etablissement: string;
  moyenne: number;
  rang: number;
  parentMatricule: string;
  parentNom: string;
  statut: 'valide' | 'en_attente' | 'rejete';
}

const mockNiveaux = [
  { label: 'Tous les niveaux', value: '' },
  { label: 'CP', value: 'cp' },
  { label: 'CE1', value: 'ce1' },
  { label: 'CE2', value: 'ce2' },
  { label: 'CM1', value: 'cm1' },
  { label: 'CM2', value: 'cm2' },
  { label: '6ème', value: '6eme' },
  { label: '5ème', value: '5eme' },
  { label: '4ème', value: '4eme' },
  { label: '3ème', value: '3eme' },
  { label: '2nde', value: '2nde' },
  { label: '1ère', value: '1ere' },
  { label: 'Terminale', value: 'terminale' }
];

const mockEleves: EleveNote[] = [
  {
    id: '1',
    nom: 'AIT HADDOU',
    prenom: 'Salma',
    niveau: 'CE2',
    etablissement: 'École Primaire Al Massira',
    moyenne: 18.5,
    rang: 1,
    parentMatricule: 'H9984',
    parentNom: 'Youness AIT HADDOU',
    statut: 'valide'
  },
  {
    id: '2',
    nom: 'EL MANSOURI',
    prenom: 'Amal',
    niveau: 'CE2',
    etablissement: 'École Primaire Al Massira',
    moyenne: 17.8,
    rang: 2,
    parentMatricule: 'H4521',
    parentNom: 'Omar EL MANSOURI',
    statut: 'valide'
  },
  {
    id: '3',
    nom: 'BENALI',
    prenom: 'Aya',
    niveau: '1ère',
    etablissement: 'Lycée Mohammed V',
    moyenne: 16.2,
    rang: 1,
    parentMatricule: 'H7643',
    parentNom: 'Sara BENALI',
    statut: 'en_attente'
  }
];

export default function PrixElevesPage() {
  const [eleves, setEleves] = useState<EleveNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNoteDialog, setShowNoteDialog] = useState(false);
  const [editingEleve, setEditingEleve] = useState<EleveNote | null>(null);
  const [selectedNiveau, setSelectedNiveau] = useState<string>('');
  const [newNote, setNewNote] = useState<{
    nom: string;
    prenom: string;
    niveau: string;
    etablissement: string;
    moyenne: number;
  }>({
    nom: '',
    prenom: '',
    niveau: '',
    etablissement: '',
    moyenne: 0
  });

  useEffect(() => {
    // TODO(api): Fetch student grades
    setTimeout(() => {
      let filtered = [...mockEleves];
      
      if (selectedNiveau) {
        filtered = filtered.filter(e => e.niveau.toLowerCase() === selectedNiveau);
      }
      
      // Sort by niveau then by moyenne (descending)
      filtered.sort((a, b) => {
        if (a.niveau !== b.niveau) {
          return a.niveau.localeCompare(b.niveau);
        }
        return b.moyenne - a.moyenne;
      });
      
      // Recalculate ranks by niveau
      const niveaux = [...new Set(filtered.map(e => e.niveau))];
      niveaux.forEach(niveau => {
        const elevesNiveau = filtered.filter(e => e.niveau === niveau);
        elevesNiveau.forEach((eleve, index) => {
          eleve.rang = index + 1;
        });
      });
      
      setEleves(filtered);
      setLoading(false);
    }, 500);
  }, [selectedNiveau]);

  const moyenneBodyTemplate = (rowData: EleveNote) => {
    const color = rowData.moyenne >= 16 ? 'text-green-600' : 
                  rowData.moyenne >= 14 ? 'text-blue-600' : 
                  rowData.moyenne >= 12 ? 'text-orange-600' : 'text-red-600';
    
    return <span className={`font-semibold ${color}`}>{rowData.moyenne.toFixed(2)}</span>;
  };

  const rangBodyTemplate = (rowData: EleveNote) => {
    return (
      <div className="flex items-center gap-2">
        <span className="font-semibold">#{rowData.rang}</span>
        {rowData.rang <= 3 && (
          <i className={`pi ${
            rowData.rang === 1 ? 'pi-star-fill text-yellow-500' :
            rowData.rang === 2 ? 'pi-star-fill text-gray-400' :
            'pi-star-fill text-orange-500'
          }`} />
        )}
      </div>
    );
  };

  const statutBodyTemplate = (rowData: EleveNote) => {
    const severityMap = {
      'valide': 'success',
      'en_attente': 'warning',
      'rejete': 'danger'
    } as const;

    const labelMap = {
      'valide': 'Validé',
      'en_attente': 'En attente',
      'rejete': 'Rejeté'
    };

    return <Tag value={labelMap[rowData.statut]} severity={severityMap[rowData.statut]} />;
  };

  const columns = [
    {
      field: 'rang',
      header: 'Rang',
      body: rangBodyTemplate,
      sortable: true,
      style: { width: '80px' }
    },
    {
      field: 'nom',
      header: 'Nom',
      sortable: true,
      style: { width: '120px' }
    },
    {
      field: 'prenom',
      header: 'Prénom',
      sortable: true,
      style: { width: '120px' }
    },
    {
      field: 'niveau',
      header: 'Niveau',
      sortable: true,
      style: { width: '100px' }
    },
    {
      field: 'etablissement',
      header: 'Établissement',
      sortable: true,
      style: { minWidth: '200px' }
    },
    {
      field: 'moyenne',
      header: 'Moyenne',
      body: moyenneBodyTemplate,
      sortable: true,
      style: { width: '100px' }
    },
    {
      field: 'parentNom',
      header: 'Parent (OCP)',
      sortable: true,
      style: { width: '150px' }
    },
    {
      field: 'statut',
      header: 'Statut',
      body: statutBodyTemplate,
      sortable: true,
      style: { width: '120px' }
    }
  ];

  const handleNewNote = () => {
    setEditingEleve(null);
    setNewNote({
      nom: '',
      prenom: '',
      niveau: '',
      etablissement: '',
      moyenne: 0
    });
    setShowNoteDialog(true);
  };

  const handleEditNote = (eleve: EleveNote) => {
    setEditingEleve(eleve);
    setNewNote({
      nom: eleve.nom,
      prenom: eleve.prenom,
      niveau: eleve.niveau,
      etablissement: eleve.etablissement,
      moyenne: eleve.moyenne
    });
    setShowNoteDialog(true);
  };

  const handleSubmitNote = () => {
    // TODO(api): Submit or update student grade
    console.log('Submit note:', newNote);
    setShowNoteDialog(false);
  };

  return (
    <SideMenu activeMenu={ActiveMenu.Activities}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Module Prix Élèves</h1>
            <p className="text-gray-600">Saisie et classement des notes scolaires</p>
          </div>
          <Guard role="back-office">
            <Button
              label="Saisir une note"
              icon="pi pi-plus"
              onClick={handleNewNote}
            />
          </Guard>
        </div>

        <TabView>
          <TabPanel header="Classement général">
            <Card className="mb-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Filtrer par niveau</h3>
                <Dropdown
                  value={selectedNiveau}
                  options={mockNiveaux}
                  onChange={(e) => setSelectedNiveau(e.value)}
                  placeholder="Tous les niveaux"
                />
              </div>
            </Card>

            <DataTable
              value={eleves}
              loading={loading}
              paginator
              rows={15}
              showGridlines
              stripedRows
              className="p-datatable-sm"
              header={
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Classement par moyenne (décroissant)</h3>
                  <Button
                    label="Exporter PDF"
                    icon="pi pi-file-pdf"
                    outlined
                    onClick={() => console.log('Export grades PDF')}
                  />
                </div>
              }
            >
              {columns.map((col) => (
                <Column
                  key={col.field}
                  field={col.field}
                  header={col.header}
                  body={col.body}
                  sortable={col.sortable}
                  style={col.style}
                />
              ))}
              <Guard role="back-office">
                <Column
                  header="Actions"
                  body={(rowData: EleveNote) => (
                    <div className="flex gap-2">
                      <Button
                        icon="pi pi-pencil"
                        rounded
                        outlined
                        tooltip="Modifier"
                        onClick={() => handleEditNote(rowData)}
                      />
                      <Button
                        icon="pi pi-trash"
                        rounded
                        outlined
                        severity="danger"
                        tooltip="Supprimer"
                        onClick={() => console.log('Delete grade:', rowData.id)}
                      />
                    </div>
                  )}
                  style={{ width: '120px' }}
                />
              </Guard>
            </DataTable>
          </TabPanel>

          <TabPanel header="Statistiques par niveau">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockNiveaux.slice(1).map(niveau => {
                const elevesNiveau = mockEleves.filter(e => e.niveau.toLowerCase() === niveau.value);
                const moyenneNiveau = elevesNiveau.length > 0 
                  ? elevesNiveau.reduce((sum, e) => sum + e.moyenne, 0) / elevesNiveau.length 
                  : 0;
                
                return (
                  <Card key={niveau.value} title={niveau.label}>
                    <div className="space-y-3">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {elevesNiveau.length}
                        </div>
                        <div className="text-sm text-gray-600">Élèves inscrits</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-xl font-semibold text-green-600">
                          {moyenneNiveau.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-600">Moyenne générale</div>
                      </div>
                      
                      {elevesNiveau.length > 0 && (
                        <div className="text-center">
                          <div className="text-lg font-medium text-orange-600">
                            {Math.max(...elevesNiveau.map(e => e.moyenne)).toFixed(2)}
                          </div>
                          <div className="text-sm text-gray-600">Meilleure note</div>
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </TabPanel>

          <TabPanel header="Mes enfants">
            <DataTable
              value={mockEleves.filter(e => e.parentMatricule === 'H9984')} // Current user's children
              loading={loading}
              showGridlines
              stripedRows
              className="p-datatable-sm"
              header={
                <h3 className="text-lg font-semibold">Notes de mes enfants</h3>
              }
            >
              <Column field="prenom" header="Prénom" sortable />
              <Column field="niveau" header="Niveau" sortable />
              <Column field="etablissement" header="École" sortable />
              <Column field="moyenne" header="Moyenne" body={moyenneBodyTemplate} sortable />
              <Column field="rang" header="Rang" body={rangBodyTemplate} sortable />
              <Column field="statut" header="Statut" body={statutBodyTemplate} sortable />
            </DataTable>
          </TabPanel>
        </TabView>
      </div>

      {/* Note Dialog */}
      <Dialog
        header={editingEleve ? 'Modifier la note' : 'Saisir une nouvelle note'}
        visible={showNoteDialog}
        onHide={() => setShowNoteDialog(false)}
        style={{ width: '600px' }}
        modal
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom <span className="text-red-500">*</span>
              </label>
              <InputText
                value={newNote.nom}
                onChange={(e) => setNewNote(prev => ({ ...prev, nom: e.target.value }))}
                placeholder="Nom de l'élève"
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prénom <span className="text-red-500">*</span>
              </label>
              <InputText
                value={newNote.prenom}
                onChange={(e) => setNewNote(prev => ({ ...prev, prenom: e.target.value }))}
                placeholder="Prénom de l'élève"
                className="w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Niveau <span className="text-red-500">*</span>
              </label>
              <Dropdown
                value={newNote.niveau}
                options={mockNiveaux.slice(1)}
                onChange={(e) => setNewNote(prev => ({ ...prev, niveau: e.value }))}
                placeholder="Sélectionner le niveau"
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Moyenne <span className="text-red-500">*</span>
              </label>
              <InputNumber
                value={newNote.moyenne}
                onValueChange={(e) => setNewNote(prev => ({ ...prev, moyenne: e.value || 0 }))}
                placeholder="Note sur 20"
                className="w-full"
                min={0}
                max={20}
                minFractionDigits={2}
                maxFractionDigits={2}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Établissement <span className="text-red-500">*</span>
            </label>
            <InputText
              value={newNote.etablissement}
              onChange={(e) => setNewNote(prev => ({ ...prev, etablissement: e.target.value }))}
              placeholder="Nom de l'établissement"
              className="w-full"
            />
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <i className="pi pi-info-circle text-blue-500"></i>
              <span className="font-medium text-blue-800">Information</span>
            </div>
            <p className="text-sm text-blue-700">
              Le classement est automatiquement calculé par niveau et par moyenne décroissante.
              Les prix seront attribués aux 3 premiers de chaque niveau.
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              label="Annuler"
              outlined
              onClick={() => setShowNoteDialog(false)}
            />
            <Button
              label={editingEleve ? 'Modifier' : 'Enregistrer'}
              icon="pi pi-check"
              onClick={handleSubmitNote}
              disabled={!newNote.nom || !newNote.prenom || !newNote.niveau || !newNote.etablissement || newNote.moyenne === 0}
            />
          </div>
        </div>
      </Dialog>
    </SideMenu>
  );
}