// lib/verificationStore.ts
const verificationCodes = new Map<string, string>();

export function setVerificationCode(email: string, code: string) {
  console.log(`Armazenando código ${code} para o email ${email}`); // Adicionando log para depuração
  verificationCodes.set(email, code);
}

export function getVerificationCode(email: string) {
  console.log(`Recuperando código para o email ${email}`); // Log para depuração
  return verificationCodes.get(email);
}

export function deleteVerificationCode(email: string) {
  console.log(`Deletando código para o email ${email}`); // Log para depuração
  verificationCodes.delete(email);
}
