import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/lib/auth';
import { User } from '@/lib/types';

interface GuardProps {
  children: React.ReactNode;
  role?: User['role'];
  fallback?: React.ReactNode;
}

export default function Guard({ children, role, fallback }: GuardProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);

    if (!currentUser) {
      router.push('/login');
      return;
    }

    if (role && !AuthService.hasRole(role)) {
      router.push('/unauthorized');
      return;
    }
  }, [role, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return fallback || null;
  }

  if (role && !AuthService.hasRole(role)) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Accès refusé</h2>
          <p className="text-gray-600">Vous n'avez pas les permissions nécessaires.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}