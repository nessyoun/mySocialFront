"use client";

import { useState, useRef } from 'react';
import { Card } from 'primereact/card';
import { Steps } from 'primereact/steps';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { FileUpload } from 'primereact/fileupload';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { MenuItem } from 'primereact/menuitem';
import AppShell from '@/components/layout/AppShell';
import Guard from '@/components/auth/Guard';
import FormBuilder, { FormField } from '@/components/forms/FormBuilder';
import { z } from 'zod';

export default function BourseFondPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const toast = useRef<Toast>(null);

  const steps: MenuItem[] = [
    { label: 'Formulaire de demande' },
    { label: 'Documents justificatifs' },
    { label: 'Bulletins scolaires' },
    { label: 'Suivi de la demande' }
  ];

  // Step 1: Application form
  const applicationFields: FormField[] = [
    {
      name: 'childName',
      label: 'Nom de l\'enfant',
      type: 'text',
      required: true,
      validation: z.string().min(2, 'Nom requis')
    },
    {
      name: 'childAge',
      label: 'Âge',
      type: 'number',
      required: true,
      validation: z.number().min(16, 'Âge minimum 16 ans').max(30, 'Âge maximum 30 ans')
    },
    {
      name: 'studyLevel',
      label: 'Niveau d\'études',
      type: 'select',
      required: true,
      options: [
        { label: 'Licence', value: 'licence' },
        { label: 'Master', value: 'master' },
        { label: 'Doctorat', value: 'doctorat' },
        { label: 'École d\'ingénieur', value: 'ingenieur' }
      ],
      validation: z.string().min(1, 'Niveau requis')
    },
    {
      name: 'institution',
      label: 'Établissement',
      type: 'text',
      required: true,
      validation: z.string().min(2, 'Établissement requis')
    },
    {
      name: 'requestedAmount',
      label: 'Montant demandé (MAD)',
      type: 'number',
      required: true,
      validation: z.number().min(1000, 'Montant minimum 1,000 MAD').max(50000, 'Montant maximum 50,000 MAD')
    },
    {
      name: 'justification',
      label: 'Justification de la demande',
      type: 'textarea',
      required: true,
      validation: z.string().min(50, 'Justification détaillée requise (min 50 caractères)')
    }
  ];

  const handleStepSubmit = (data: any) => {
    setFormData(prev => ({ ...prev, ...data }));
    
    if (activeStep < steps.length - 1) {
      setActiveStep(prev => prev + 1);
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <FormBuilder
            fields={applicationFields}
            onSubmit={handleStepSubmit}
            defaultValues={formData}
            submitLabel="Suivant"
          />
        );

      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Documents justificatifs requis</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Certificat de scolarité <span className="text-red-500">*</span>
                </label>
                <FileUpload
                  name="certificatScolarite"
                  accept=".pdf,.jpg,.png"
                  maxFileSize={5000000}
                  emptyTemplate={<p className="text-center">Glissez-déposez le certificat de scolarité</p>}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Relevé d'identité bancaire <span className="text-red-500">*</span>
                </label>
                <FileUpload
                  name="rib"
                  accept=".pdf,.jpg,.png"
                  maxFileSize={5000000}
                  emptyTemplate={<p className="text-center">Glissez-déposez le RIB</p>}
                />
              </div>
            </div>

            <div className="flex justify-between">
              <Button
                label="Précédent"
                icon="pi pi-arrow-left"
                outlined
                onClick={() => setActiveStep(prev => prev - 1)}
              />
              <Button
                label="Suivant"
                icon="pi pi-arrow-right"
                onClick={() => setActiveStep(prev => prev + 1)}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Bulletins scolaires</h3>
            <p className="text-gray-600">Téléchargez les bulletins des 2 dernières années</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bulletins année précédente <span className="text-red-500">*</span>
                </label>
                <FileUpload
                  name="bulletinsPrecedent"
                  accept=".pdf,.jpg,.png"
                  maxFileSize={10000000}
                  multiple
                  emptyTemplate={<p className="text-center">Glissez-déposez les bulletins</p>}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bulletins année en cours <span className="text-red-500">*</span>
                </label>
                <FileUpload
                  name="bulletinsCourant"
                  accept=".pdf,.jpg,.png"
                  maxFileSize={10000000}
                  multiple
                  emptyTemplate={<p className="text-center">Glissez-déposez les bulletins</p>}
                />
              </div>
            </div>

            <div className="flex justify-between">
              <Button
                label="Précédent"
                icon="pi pi-arrow-left"
                outlined
                onClick={() => setActiveStep(prev => prev - 1)}
              />
              <Button
                label="Soumettre la demande"
                icon="pi pi-check"
                onClick={() => setActiveStep(prev => prev + 1)}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <i className="pi pi-check-circle text-6xl text-green-500 mb-4"></i>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Demande soumise avec succès
              </h3>
              <p className="text-gray-600">
                Votre demande de bourse est en cours de traitement
              </p>
            </div>

            <Card title="Suivi de votre demande">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <i className="pi pi-check text-green-500"></i>
                    <span>Demande reçue</span>
                  </div>
                  <span className="text-sm text-gray-600">15/02/2025</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <i className="pi pi-clock text-blue-500"></i>
                    <span>En cours d'examen</span>
                  </div>
                  <span className="text-sm text-gray-600">En cours...</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg opacity-50">
                  <div className="flex items-center gap-3">
                    <i className="pi pi-circle text-gray-400"></i>
                    <span>Décision finale</span>
                  </div>
                  <span className="text-sm text-gray-600">En attente</span>
                </div>
              </div>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Guard role="collaborateur">
      <AppShell>
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Bourse de fond</h1>
            <p className="text-gray-600">Demande d'aide financière pour les études supérieures</p>
          </div>

          <Card>
            <Steps
              model={steps}
              activeIndex={activeStep}
              className="mb-6"
            />
            
            {renderStepContent()}
          </Card>
        </div>
      </AppShell>
    </Guard>
  );
}