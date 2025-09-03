"use client";

import { useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card } from 'primereact/card';
import { Steps } from 'primereact/steps';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { MenuItem } from 'primereact/menuitem';
import AppShell from '@/components/layout/AppShell';
import Guard from '@/components/auth/Guard';
import FormBuilder, { FormField } from '@/components/forms/FormBuilder';
import { z } from 'zod';

export default function InscriptionWizardPage() {
  const params = useParams();
  const router = useRouter();
  const toast = useRef<Toast>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);

  const activiteId = params.id as string;

  const steps: MenuItem[] = [
    { label: 'Informations personnelles' },
    { label: 'Documents requis' },
    { label: 'Paiement' },
    { label: 'Confirmation' }
  ];

  // Step 1: Personal Information
  const personalInfoFields: FormField[] = [
    {
      name: 'participantType',
      label: 'Type de participant',
      type: 'select',
      required: true,
      options: [
        { label: 'Moi-même', value: 'self' },
        { label: 'Conjoint(e)', value: 'spouse' },
        { label: 'Enfant', value: 'child' }
      ],
      validation: z.string().min(1, 'Sélection requise')
    },
    {
      name: 'familyMember',
      label: 'Membre de la famille',
      type: 'select',
      conditional: {
        field: 'participantType',
        value: 'spouse'
      },
      options: [
        { label: 'Salma AIT HADDOU', value: '1-1' }
      ],
      validation: z.string().optional()
    },
    {
      name: 'specialRequests',
      label: 'Demandes spéciales',
      type: 'textarea',
      placeholder: 'Régime alimentaire, accessibilité, etc.',
      validation: z.string().optional()
    }
  ];

  // Step 2: Documents
  const documentsFields: FormField[] = [
    {
      name: 'identityDocument',
      label: 'Pièce d\'identité',
      type: 'file',
      required: true
    },
    {
      name: 'medicalCertificate',
      label: 'Certificat médical',
      type: 'file',
      required: false
    }
  ];

  // Step 3: Payment
  const paymentFields: FormField[] = [
    {
      name: 'paymentMethod',
      label: 'Mode de paiement',
      type: 'select',
      required: true,
      options: [
        { label: 'Virement bancaire', value: 'transfer' },
        { label: 'Prélèvement sur salaire', value: 'payroll' },
        { label: 'Espèces', value: 'cash' }
      ],
      validation: z.string().min(1, 'Mode de paiement requis')
    }
  ];

  const handleStepSubmit = (data: any) => {
    setFormData(prev => ({ ...prev, ...data }));
    
    if (activeStep < steps.length - 1) {
      setActiveStep(prev => prev + 1);
    } else {
      handleFinalSubmit();
    }
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    
    try {
      // TODO(api): Submit inscription to backend
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.current?.show({
        severity: 'success',
        summary: 'Inscription réussie',
        detail: 'Votre inscription a été enregistrée avec succès',
        life: 3000
      });
      
      setTimeout(() => {
        router.push('/mes-inscriptions');
      }, 2000);
    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Une erreur est survenue lors de l\'inscription',
        life: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  const getCurrentStepFields = (): FormField[] => {
    switch (activeStep) {
      case 0: return personalInfoFields;
      case 1: return documentsFields;
      case 2: return paymentFields;
      default: return [];
    }
  };

  const renderStepContent = () => {
    if (activeStep === steps.length - 1) {
      // Confirmation step
      return (
        <div className="space-y-6">
          <div className="text-center">
            <i className="pi pi-check-circle text-6xl text-green-500 mb-4"></i>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Récapitulatif de votre inscription
            </h3>
            <p className="text-gray-600">
              Vérifiez les informations avant de confirmer
            </p>
          </div>

          <Card title="Informations saisies" className="bg-gray-50">
            <div className="space-y-3">
              {Object.entries(formData).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="font-medium text-gray-700 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').toLowerCase()}:
                  </span>
                  <span className="text-gray-900">{String(value)}</span>
                </div>
              ))}
            </div>
          </Card>

          <div className="flex justify-between">
            <Button
              label="Précédent"
              icon="pi pi-arrow-left"
              outlined
              onClick={() => setActiveStep(prev => prev - 1)}
            />
            <Button
              label="Confirmer l'inscription"
              icon="pi pi-check"
              loading={loading}
              onClick={handleFinalSubmit}
            />
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <FormBuilder
          fields={getCurrentStepFields()}
          onSubmit={handleStepSubmit}
          defaultValues={formData}
          submitLabel={activeStep === steps.length - 2 ? 'Finaliser' : 'Suivant'}
        />
        
        {activeStep > 0 && (
          <Button
            label="Précédent"
            icon="pi pi-arrow-left"
            outlined
            onClick={() => setActiveStep(prev => prev - 1)}
            className="w-full mt-4"
          />
        )}
      </div>
    );
  };

  return (
    <Guard role="collaborateur">
      <AppShell>
        <Toast ref={toast} />
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <Button
              icon="pi pi-arrow-left"
              label="Retour à l'activité"
              text
              onClick={() => router.push(`/activites/${activiteId}`)}
              className="mb-4"
            />
            <h1 className="text-2xl font-bold text-gray-900">Inscription</h1>
            <p className="text-gray-600">Suivez les étapes pour finaliser votre inscription</p>
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