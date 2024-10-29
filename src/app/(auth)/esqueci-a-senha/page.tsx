import Image from 'next/image';
import { Logo } from '../../components/auth/Logotipo';
import FormularioEsqueciSenha from '@/app/components/auth/FormularioEsqueciSenha';

export default function EsqueciSenha() {

  return (
    <div className="flex min-h-screen bg-cinzaSuave">
      {/* Área de Login */}
      <div className="flex flex-1 flex-col justify-center items-center p-4">
        {/* Logotipo */}
        <div className="-mb-12 items-center lg:ml-11">
          <Logo size={420}/>
        </div>

        {/* Título */}
        <h2 className="text-xl font-semibold mb-4">Insira seu e-mail!</h2>

        {/* Inputs de Email e Senha */}
        <FormularioEsqueciSenha/>
      </div>

      {/* Área com Imagem de fundo */}
      <div className="hidden md:block flex-1 relative rounded-tl-lg rounded-bl-lg">
        <Image
            src="/bg-login.svg"
            alt="Imagem de fundo"
            fill
            className="object-cover"
            priority
        />
        </div>
    </div>
  );
}
