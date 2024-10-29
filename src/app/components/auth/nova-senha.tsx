// nova-senha.tsx
'use client';
import { useState, useEffect } from 'react';
import { Eye, EyeSlash } from 'iconsax-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function RedefinirSenha() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    // Depuração: Verifique se o email e código estão corretos no localStorage
    console.log("Email no localStorage:", localStorage.getItem('email'));
    console.log("Código de verificação no localStorage:", localStorage.getItem('verificationCode'));
  }, []);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast({
        title: 'Erro!',
        description: 'As senhas não coincidem.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    // Verificar valores antes de enviar a requisição
    const email = localStorage.getItem('email');
    const verificationCode = localStorage.getItem('verificationCode');

    console.log("Enviando solicitação com:");
    console.log("Email:", email);
    console.log("Código:", verificationCode);
    console.log("Nova senha:", newPassword);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email, // Usar o e-mail salvo
          newPassword,
          code: verificationCode, // Usar o código salvo
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Sucesso!',
          description: 'Senha redefinida com sucesso!',
          variant: 'success',
        });

        // Limpar o localStorage
        localStorage.removeItem('email');
        localStorage.removeItem('verificationCode');

        // Redirecionar para a página de login
        router.push('/login');
      } else {
        toast({
          title: 'Erro!',
          description: data.message || 'Falha ao redefinir a senha.',
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
    <form className="w-full max-w-md" onSubmit={handleResetPassword}>
      <div className="relative mb-4">
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Nova senha"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-verdeAgua"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
        >
          {showPassword ? <EyeSlash size="24" variant="Bold" /> : <Eye size="24" variant="Outline" />}
        </button>
      </div>

      <div className="relative mb-4">
        <input
          type={showConfirmPassword ? 'text' : 'password'}
          placeholder="Confirme a nova senha"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-verdeAgua"
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
        >
          {showConfirmPassword ? <EyeSlash size="24" variant="Bold" /> : <Eye size="24" variant="Outline" />}
        </button>
      </div>

      <button
        type="submit"
        className="w-full py-2 bg-verde text-white font-semibold rounded-md hover:bg-verdeAgua transition-colors"
        disabled={loading}
      >
        {loading ? 'Trocando senha...' : 'Trocar senha'}
      </button>
    </form>
  );
}
