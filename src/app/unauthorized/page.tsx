import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { useRouter } from 'next/navigation';

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="max-w-md w-full text-center p-6">
        <div className="space-y-4">
          <i className="pi pi-lock text-6xl text-red-500"></i>
          <h1 className="text-2xl font-bold text-gray-900">Accès refusé</h1>
          <p className="text-gray-600">
            Vous n'avez pas les permissions nécessaires pour accéder à cette page.
          </p>
          <div className="flex gap-2 justify-center">
            <Button
              label="Retour"
              icon="pi pi-arrow-left"
              outlined
              onClick={() => router.back()}
            />
            <Button
              label="Tableau de bord"
              icon="pi pi-home"
              onClick={() => router.push('/dashboard')}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}