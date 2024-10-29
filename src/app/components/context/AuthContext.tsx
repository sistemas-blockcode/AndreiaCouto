// AuthContext.tsx
'use client'
import { createContext, useContext, ReactNode, useState, useEffect } from 'react';

type AuthContextType = {
  userId: number | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({ userId: null, loading: true });

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userId, setUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserId = async () => {
    const token = localStorage.getItem('token');
    console.log("Token encontrado no localStorage:", token);

    if (!token) {
      setLoading(false);
      return; 
    }

    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Dados de autenticação recebidos:", data);
        setUserId(data.userId);
      } else {
        console.log("Falha na autenticação. Status:", response.status);
        setUserId(null);
      }
    } catch (error) {
      console.error('Erro ao buscar autenticação:', error);
      setUserId(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserId();
  }, []);

  return (
    <AuthContext.Provider value={{ userId, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
