import Image from 'next/image';
import { Logo } from '../../components/auth/Logotipo';
import Code from '@/app/components/auth/OTPCode';

export default function OTPCode() {

  return (
    <div className="flex min-h-screen bg-cinzaSuave">
      <div className="flex flex-1 flex-col justify-center items-center p-4">
        <div className="-mb-12 items-center lg:ml-11">
          <Logo size={420}/>
        </div>
        <h2 className="text-xl font-semibold mb-4">Digite o código que chegou em seu e-mail!</h2>
        <Code/>
      </div>
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
