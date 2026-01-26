
export interface IDCardData {
  id: string;
  photoUrl: string;
  brandLogoUrl: string;
  fullName: string;
  masp: string;
  bloodType: string;
  registration: string;
  cpf: string;
  identity: string;
  birthDate: string;
  expiryDate: string;
  code: string;
  status: 'ATIVO' | 'INATIVO' | 'INEXISTENTE';
  visualTheme: 'clean' | 'black' | 'metal' | 'rubro';
  validationUrl?: string;
}

export type CardSide = 'FRONT' | 'BACK';
