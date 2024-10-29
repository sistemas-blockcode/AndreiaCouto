// OTPCode.tsx
'use client';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function Code() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: localStorage.getItem('email'), code }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Sucesso!',
          description: 'Código verificado com sucesso!',
          variant: 'success',
        });

        
        localStorage.setItem('verificationCode', code);

        
        router.push('/redefinir-senha');
      } else {
        toast({
          title: 'Erro!',
          description: data.message || 'Código inválido ou expirado.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Erro no servidor!',
        description: 'Tente novamente mais tarde.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="w-full max-w-md" onSubmit={handleVerifyCode}>
      <input
        type="tel"
        inputMode="numeric"
        pattern="[0-9]*"
        placeholder="Código"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-verdeAgua"
      />

      <button
        type="submit"
        className="w-full py-2 bg-verde text-white font-semibold rounded-md hover:bg-verdeAgua transition-colors"
        disabled={loading}
      >
        {loading ? 'Verificando...' : 'Confirmar código'}
      </button>
    </form>
  );
}
