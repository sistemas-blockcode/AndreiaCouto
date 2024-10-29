'use client';
import { useState } from 'react';
import { Eye, EyeSlash } from 'iconsax-react';
import { useRouter } from 'next/navigation'; 
import { useToast } from '@/hooks/use-toast'; 

export default function FormularioLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter(); 
  const { toast } = useToast(); 

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);

        toast({
          title: 'Login bem-sucedido!',
          description: 'Redirecionando...',
          variant: 'success',
        });

        setTimeout(() => {
          router.push(data.redirectRoute);
        }, 2500);
      } else {
        toast({
          title: 'Erro ao fazer login',
          description: data.message || 'Credenciais inválidas!',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Erro no login:', error);
      toast({
        title: 'Erro no servidor',
        description: 'Tente novamente mais tarde.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="w-full max-w-md" onSubmit={handleLogin}>
      <input
        type="email"
        placeholder="E-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-2 mb-4 rounded-md focus:outline-none focus:ring-2 focus:ring-verdeAgua"
      />

      <div className="relative mb-4">
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-verdeAgua"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
        >
          {showPassword ? (
            <EyeSlash size="24" variant="Bold" />
          ) : (
            <Eye size="24" variant="Outline" />
          )}
        </button>
      </div>

      <div className="flex justify-between items-center mb-4">
        <a href="/esqueci-a-senha" className="text-sm text-verde hover:underline">
          Esqueceu sua senha?
        </a>
      </div>

      <button
        type="submit"
        className="w-full py-2 bg-verde text-white font-semibold rounded-md hover:bg-verdeAgua transition-colors"
        disabled={loading}
      >
        {loading ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  );
}
