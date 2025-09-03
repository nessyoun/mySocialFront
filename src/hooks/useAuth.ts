import { useState, useEffect } from 'react';
import { AuthService } from '@/lib/auth';
import { User } from '@/lib/types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const user = await AuthService.login(email, password);
    setUser(user);
    return user;
  };

  const logout = async () => {
    await AuthService.logout();
    setUser(null);
  };

  const hasRole = (role: User['role']) => {
    return AuthService.hasRole(role);
  };

  return {
    user,
    loading,
    login,
    logout,
    hasRole,
    isAuthenticated: !!user
  };
}