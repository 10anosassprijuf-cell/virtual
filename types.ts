
export interface IDCardData {
  id: string;
  photoUrl: string;
  brandLogoUrl: string;
  secondaryLogoUrl?: string;
  fullName: string;
  category: string;
  masp: string;
  bloodType: string;
  registration: string;
  cpf: string;
  identity: string;
  birthDate: string;
  expiryDate: string;
  code: string;
  visualTheme: 'clean' | 'black' | 'metal' | 'rubro';
  validationUrl?: string;
}

export type CardSide = 'FRONT' | 'BACK';
