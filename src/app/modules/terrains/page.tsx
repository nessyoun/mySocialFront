"use client";

import { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { TabView, TabPanel } from 'primereact/tabview';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Dialog } from 'primereact/dialog';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import SideMenu from '../../shared/nav-menu/SideMenu';
import { ActiveMenu } from '../../shared/nav-menu/activeMenu';
import dayjs from 'dayjs';

interface TerrainReservation {
  id: string;
  terrain: string;
  date: string;
  creneau: string;
  statut: 'confirmee' | 'en_attente' | 'annulee';
  participants: string[];
}

interface TerrainSlot {
  id: string;
  terrain: string;
  date: string;
  creneau: string;
  disponible: boolean;
  capacite: number;
  reserves: number;
}

const mockTerrains = [
  { label: 'Terrain Football A', value: 'football-a' },
  { label: 'Terrain Football B', value: 'football-b' },
  { label: 'Court Tennis 1', value: 'tennis-1' },
  { label: 'Court Tennis 2', value: 'tennis-2' },
  { label: 'Terrain Basketball', value: 'basketball' },
  { label: 'Terrain Volleyball', value: 'volleyball' }
];

const mockCreneaux = [
  { label: '08:00 - 10:00', value: '08:00-10:00' },
  { label: '10:00 - 12:00', value: '10:00-12:00' },
  { label: '14:00 - 16:00', value: '14:00-16:00' },
  { label: '16:00 - 18:00', value: '16:00-18:00' },
  { label: '18:00 - 20:00', value: '18:00-20:00' }
];

const mockReservations: TerrainReservation[] = [
  {
    id: '1',
    terrain: 'Terrain Football A',
    date: '2025-02-20',
    creneau: '16:00 - 18:00',
    statut: 'confirmee',
    participants: ['Youness AIT HADDOU', 'Omar EL MANSOURI']
  },
  {
    id: '2',
    terrain: 'Court Tennis 1',
    date: '2025-02-22',
    creneau: '10:00 - 12:00',
    statut: 'en_attente',
    participants: ['Sara BENALI']
  }
];

export default function TerrainsPage() {
  const [reservations, setReservations] = useState<TerrainReservation[]>([]);
  const [availableSlots, setAvailableSlots] = useState<TerrainSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReservationDialog, setShowReservationDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTerrain, setSelectedTerrain] = useState<string>('');
  const [selectedCreneau, setSelectedCreneau] = useState<string>('');

  useEffect(() => {
    // TODO(api): Fetch terrain reservations and available slots
    setTimeout(() => {
      setReservations(mockReservations);
      
      // Generate available slots for next week (S-1 rule)
      const slots: TerrainSlot[] = [];
      const startDate = dayjs().add(1, 'week').startOf('week');
      
      for (let i = 0; i < 7; i++) {
        const date = startDate.add(i, 'day');
        mockTerrains.forEach(terrain => {
          mockCreneaux.forEach(creneau => {
            slots.push({
              id: `${terrain.value}-${date.format('YYYY-MM-DD')}-${creneau.value}`,
              terrain: terrain.label,
              date: date.format('YYYY-MM-DD'),
              creneau: creneau.label,
              disponible: Math.random() > 0.3,
              capacite: terrain.value.includes('football') ? 22 : 4,
              reserves: Math.floor(Math.random() * 10)
            });
          });
        });
      }
      
      setAvailableSlots(slots);
      setLoading(false);
    }, 500);
  }, []);

  const statutBodyTemplate = (rowData: TerrainReservation) => {
    const severityMap = {
      'confirmee': 'success',
      'en_attente': 'warning',
      'annulee': 'danger'
    } as const;

    const labelMap = {
      'confirmee': 'Confirmée',
      'en_attente': 'En attente',
      'annulee': 'Annulée'
    };

    return <Tag value={labelMap[rowData.statut]} severity={severityMap[rowData.statut]} />;
  };

  const participantsBodyTemplate = (rowData: TerrainReservation) => {
    return (
      <div className="flex flex-wrap gap-1">
        {rowData.participants.slice(0, 2).map((participant, index) => (
          <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
            {participant}
          </span>
        ))}
        {rowData.participants.length > 2 && (
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
            +{rowData.participants.length - 2}
          </span>
        )}
      </div>
    );
  };

  const disponibiliteBodyTemplate = (rowData: TerrainSlot) => {
    return (
      <div className="flex items-center gap-2">
        <Tag 
          value={rowData.disponible ? 'Disponible' : 'Complet'} 
          severity={rowData.disponible ? 'success' : 'danger'} 
        />
        <span className="text-sm text-gray-600">
          {rowData.reserves}/{rowData.capacite}
        </span>
      </div>
    );
  };

  const reservationColumns = [
    {
      field: 'terrain',
      header: 'Terrain',
      sortable: true,
      style: { width: '180px' }
    },
    {
      field: 'date',
      header: 'Date',
      sortable: true,
      style: { width: '120px' },
      body: (rowData: TerrainReservation) => dayjs(rowData.date).format('DD/MM/YYYY')
    },
    {
      field: 'creneau',
      header: 'Créneau',
      sortable: true,
      style: { width: '140px' }
    },
    {
      field: 'participants',
      header: 'Participants',
      body: participantsBodyTemplate,
      style: { minWidth: '200px' }
    },
    {
      field: 'statut',
      header: 'Statut',
      body: statutBodyTemplate,
      sortable: true,
      style: { width: '120px' }
    }
  ];

  const slotsColumns = [
    {
      field: 'terrain',
      header: 'Terrain',
      sortable: true,
      style: { width: '180px' }
    },
    {
      field: 'date',
      header: 'Date',
      sortable: true,
      style: { width: '120px' },
      body: (rowData: TerrainSlot) => dayjs(rowData.date).format('DD/MM/YYYY')
    },
    {
      field: 'creneau',
      header: 'Créneau',
      sortable: true,
      style: { width: '140px' }
    },
    {
      field: 'disponible',
      header: 'Disponibilité',
      body: disponibiliteBodyTemplate,
      style: { width: '150px' }
    }
  ];

  const handleNewReservation = () => {
    setSelectedDate(null);
    setSelectedTerrain('');
    setSelectedCreneau('');
    setShowReservationDialog(true);
  };

  const handleSubmitReservation = () => {
    // TODO(api): Submit terrain reservation
    // Check max 2 reservations per week rule
    // Check not same day rule
    console.log('New reservation:', { selectedDate, selectedTerrain, selectedCreneau });
    setShowReservationDialog(false);
  };

  const getNextWeekDates = () => {
    const startOfNextWeek = dayjs().add(1, 'week').startOf('week');
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = startOfNextWeek.add(i, 'day');
      dates.push({
        label: date.format('dddd DD/MM/YYYY'),
        value: date.toDate()
      });
    }
    return dates;
  };

  const checkReservationRules = () => {
    // TODO(api): Check if user already has 2 reservations this week
    // TODO(api): Check if selected date conflicts with existing reservations
    const weeklyReservations = reservations.filter(r => 
      dayjs(r.date).isSame(dayjs(selectedDate), 'week') && r.statut === 'confirmee'
    );
    
    const hasMaxReservations = weeklyReservations.length >= 2;
    const hasSameDayReservation = weeklyReservations.some(r => 
      dayjs(r.date).isSame(dayjs(selectedDate), 'day')
    );

    return { hasMaxReservations, hasSameDayReservation };
  };

  const rules = selectedDate ? checkReservationRules() : { hasMaxReservations: false, hasSameDayReservation: false };

  return (
    <SideMenu activeMenu={ActiveMenu.Activities}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Module Terrains</h1>
            <p className="text-gray-600">Réservation de créneaux sportifs (S-1, max 2/semaine)</p>
          </div>
          <Button
            label="Nouvelle réservation"
            icon="pi pi-plus"
            onClick={handleNewReservation}
          />
        </div>

        <TabView>
          <TabPanel header="Mes réservations">
            <DataTable
              value={reservations}
              loading={loading}
              paginator
              rows={10}
              showGridlines
              stripedRows
              className="p-datatable-sm"
            >
              {reservationColumns.map((col) => (
                <Column
                  key={col.field}
                  field={col.field}
                  header={col.header}
                  body={col.body}
                  sortable={col.sortable}
                  style={col.style}
                />
              ))}
              <Column
                header="Actions"
                body={(rowData: TerrainReservation) => (
                  <div className="flex gap-2">
                    <Button
                      icon="pi pi-eye"
                      rounded
                      outlined
                      tooltip="Voir détails"
                      onClick={() => console.log('View reservation:', rowData.id)}
                    />
                    {rowData.statut === 'confirmee' && dayjs(rowData.date).diff(dayjs(), 'hour') > 24 && (
                      <Button
                        icon="pi pi-times"
                        rounded
                        outlined
                        severity="danger"
                        tooltip="Annuler (>24h avant)"
                        onClick={() => console.log('Cancel reservation:', rowData.id)}
                      />
                    )}
                  </div>
                )}
                style={{ width: '120px' }}
              />
            </DataTable>
          </TabPanel>

          <TabPanel header="Créneaux disponibles (S-1)">
            <Card className="mb-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <i className="pi pi-info-circle text-blue-500"></i>
                  <span className="font-medium text-blue-800">Règles de réservation</span>
                </div>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Réservation possible uniquement pour la semaine suivante (S-1)</li>
                  <li>• Maximum 2 réservations par semaine</li>
                  <li>• Pas de réservation le même jour</li>
                  <li>• Annulation possible jusqu'à 24h avant</li>
                </ul>
              </div>
            </Card>

            <DataTable
              value={availableSlots.filter(slot => slot.disponible)}
              loading={loading}
              paginator
              rows={15}
              showGridlines
              stripedRows
              className="p-datatable-sm"
              header={
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Créneaux disponibles</h3>
                  <span className="text-sm text-gray-600">
                    Semaine du {dayjs().add(1, 'week').startOf('week').format('DD/MM')} au {dayjs().add(1, 'week').endOf('week').format('DD/MM/YYYY')}
                  </span>
                </div>
              }
            >
              {slotsColumns.map((col) => (
                <Column
                  key={col.field}
                  field={col.field}
                  header={col.header}
                  body={col.body}
                  sortable={col.sortable}
                  style={col.style}
                />
              ))}
              <Column
                header="Actions"
                body={(rowData: TerrainSlot) => (
                  <Button
                    label="Réserver"
                    icon="pi pi-calendar-plus"
                    size="small"
                    disabled={!rowData.disponible}
                    onClick={() => {
                      setSelectedDate(dayjs(rowData.date).toDate());
                      setSelectedTerrain(rowData.terrain);
                      setSelectedCreneau(rowData.creneau);
                      setShowReservationDialog(true);
                    }}
                  />
                )}
                style={{ width: '120px' }}
              />
            </DataTable>
          </TabPanel>

          <TabPanel header="Planning hebdomadaire">
            <Card>
              <div className="grid grid-cols-8 gap-2 text-sm">
                <div className="font-semibold p-2">Terrain</div>
                {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
                  <div key={day} className="font-semibold p-2 text-center">{day}</div>
                ))}
                
                {mockTerrains.map(terrain => (
                  <div key={terrain.value} className="contents">
                    <div className="p-2 font-medium bg-gray-50">{terrain.label}</div>
                    {[0,1,2,3,4,5,6].map(dayOffset => {
                      const date = dayjs().add(1, 'week').startOf('week').add(dayOffset, 'day');
                      const daySlots = availableSlots.filter(slot => 
                        slot.terrain === terrain.label && 
                        dayjs(slot.date).isSame(date, 'day')
                      );
                      const availableCount = daySlots.filter(s => s.disponible).length;
                      
                      return (
                        <div key={dayOffset} className="p-2 text-center border border-gray-200">
                          <div className="text-xs text-gray-600">{date.format('DD/MM')}</div>
                          <div className={`text-xs font-medium ${
                            availableCount > 3 ? 'text-green-600' : 
                            availableCount > 0 ? 'text-orange-600' : 'text-red-600'
                          }`}>
                            {availableCount}/5
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </Card>
          </TabPanel>
        </TabView>
      </div>

      {/* Reservation Dialog */}
      <Dialog
        header="Nouvelle réservation terrain"
        visible={showReservationDialog}
        onHide={() => setShowReservationDialog(false)}
        style={{ width: '500px' }}
        modal
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date (semaine suivante uniquement)
            </label>
            <Calendar
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.value as Date)}
              placeholder="Sélectionner une date"
              className="w-full"
              showIcon
              dateFormat="dd/mm/yy"
              minDate={dayjs().add(1, 'week').startOf('week').toDate()}
              maxDate={dayjs().add(1, 'week').endOf('week').toDate()}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Terrain
            </label>
            <Dropdown
              value={selectedTerrain}
              options={mockTerrains}
              onChange={(e) => setSelectedTerrain(e.value)}
              placeholder="Sélectionner un terrain"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Créneau
            </label>
            <Dropdown
              value={selectedCreneau}
              options={mockCreneaux}
              onChange={(e) => setSelectedCreneau(e.value)}
              placeholder="Sélectionner un créneau"
              className="w-full"
            />
          </div>

          {/* Rules validation */}
          {selectedDate && (
            <div className="space-y-2">
              {rules.hasMaxReservations && (
                <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg">
                  <i className="pi pi-times-circle text-red-500"></i>
                  <span className="text-sm text-red-700">
                    Vous avez déjà 2 réservations cette semaine
                  </span>
                </div>
              )}
              
              {rules.hasSameDayReservation && (
                <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg">
                  <i className="pi pi-exclamation-triangle text-orange-500"></i>
                  <span className="text-sm text-orange-700">
                    Vous avez déjà une réservation ce jour-là
                  </span>
                </div>
              )}
              
              {!rules.hasMaxReservations && !rules.hasSameDayReservation && (
                <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                  <i className="pi pi-check-circle text-green-500"></i>
                  <span className="text-sm text-green-700">
                    Réservation autorisée
                  </span>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button
              label="Annuler"
              outlined
              onClick={() => setShowReservationDialog(false)}
            />
            <Button
              label="Réserver"
              icon="pi pi-calendar-plus"
              onClick={handleSubmitReservation}
              disabled={!selectedDate || !selectedTerrain || !selectedCreneau || rules.hasMaxReservations || rules.hasSameDayReservation}
            />
          </div>
        </div>
      </Dialog>
    </SideMenu>
  );
}