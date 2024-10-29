// forgot-password.tsx
'use client';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function FormularioEsqueciSenha() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Sucesso!',
          description: 'Código de verificação enviado para o seu e-mail!',
          variant: 'success',
        });

      
        localStorage.setItem('email', email);

        
        router.push('/codigo');
      } else {
        toast({
          title: 'Erro!',
          description: data.message || 'Falha ao enviar o código de verificação.',
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
    <form className="w-full max-w-md" onSubmit={handleForgotPassword}>
      <input
        type="email"
        placeholder="E-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-2 mb-4 rounded-md focus:outline-none focus:ring-2 focus:ring-verdeAgua"
      />

      <button
        type="submit"
        className="w-full py-2 bg-verde text-white font-semibold rounded-md hover:bg-verdeAgua transition-colors"
        disabled={loading}
      >
        {loading ? 'Enviando...' : 'Enviar código'}
      </button>
    </form>
  );
}
