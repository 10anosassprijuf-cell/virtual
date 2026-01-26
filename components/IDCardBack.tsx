
import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { IDCardData } from '../types';

interface IDCardBackProps {
  data: IDCardData;
  id?: string;
}

const IDCardBack: React.FC<IDCardBackProps> = ({ data, id }) => {
  const themeColors = {
    clean: '#A3A5A0',
    black: '#1a1a1a',
    metal: '#3f3f46',
    rubro: '#7f1d1d'
  };

  const accentColor = themeColors[data.visualTheme || 'clean'];

  const today = new Date();
  const expeditionDate = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;

  // Gerar um Hash simples para simular autenticidade
  const securityHash = btoa(`${data.masp}-${data.cpf}-${expeditionDate}`).substring(0, 16).toUpperCase();

  // QR Code configurado para exibir o JSON conforme solicitado
  const qrValue = JSON.stringify({
    AUTENTICIDADE: securityHash,
    NOME: data.fullName || 'NÃO INFORMADO',
    MASP: data.masp,
    STATUS: data.status,
    EXPEDICAO: expeditionDate,
    VALIDACAO: "POLÍCIA PENAL - ASSPRIJUF"
  });

  const InfoRow = ({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) => (
    <div className={`w-full border-b-2 border-gray-100 py-6 ${highlight ? 'bg-slate-50/50' : ''}`}>
      <p className="text-2xl text-gray-400 font-bold uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-4xl font-semibold ${highlight ? (value === 'ATIVO' ? 'text-green-600' : 'text-red-600') : 'text-gray-800'}`}>
        {value || '---'}
      </p>
    </div>
  );

  return (
    <div 
      id={id}
      className="flex flex-col bg-white overflow-hidden shadow-2xl relative"
      style={{ width: '1080px', height: '1920px' }}
    >
      <div 
        className="absolute left-0 top-0 bottom-0 w-8 transition-colors duration-500" 
        style={{ backgroundColor: accentColor }}
      />

      <div className="flex flex-col items-center pt-20 px-20 h-full">
        <div className="flex justify-between items-center w-full mb-16">
          <h2 className="text-5xl font-black text-gray-800 tracking-widest border-l-8 border-red-600 pl-6 uppercase">
            Dados Funcionais
          </h2>
          <div className={`px-6 py-2 rounded-full border-4 ${data.status === 'ATIVO' ? 'border-green-500 text-green-600' : 'border-red-500 text-red-600'} font-black text-3xl`}>
             {data.status}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2 w-full mb-10">
          <InfoRow label="MASP" value={data.masp} />
          <InfoRow label="Status do Cadastro" value={data.status} highlight />
          <InfoRow label="Matrícula" value={data.registration} />
          <InfoRow label="CPF" value={data.cpf} />
          <InfoRow label="Identidade" value={data.identity} />
          <div className="grid grid-cols-2 gap-10">
            <InfoRow label="Data de Nascimento" value={data.birthDate} />
            <InfoRow label="Validade" value={data.expiryDate} />
          </div>
          <div className="grid grid-cols-2 gap-10">
            <InfoRow label="Codificação" value={data.code} />
            <InfoRow label="Expedição" value={expeditionDate} />
          </div>
        </div>

        {/* SELO DE AUTENTICIDADE */}
        <div className="w-full flex justify-end mb-4">
           <div className="flex flex-col items-end opacity-40">
              <span className="text-sm font-bold uppercase tracking-tighter">Selo de Autenticidade Digital</span>
              <span className="text-2xl font-mono font-black">{securityHash}</span>
           </div>
        </div>

        <div className="mt-auto mb-24 flex flex-col items-center">
          <div className="p-8 border-[12px] border-gray-100 rounded-[40px] bg-white shadow-2xl relative">
             <QRCodeSVG value={qrValue} size={480} level="H" includeMargin={true} />
             {/* Pequeno logo no centro do QR Code para parecer oficial */}
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center shadow-lg border-4 border-gray-100">
                   <span className="text-red-600 font-black text-4xl">PP</span>
                </div>
             </div>
          </div>
          <div className="mt-10 flex flex-col items-center gap-2">
            <p className="text-3xl text-gray-800 font-black tracking-[0.3em] uppercase">Validação Digital</p>
            <p className="text-xl text-gray-400 font-bold uppercase tracking-widest text-center">
              Escaneie para conferir a integridade e autenticidade dos dados
            </p>
          </div>
        </div>

        <div className="w-full text-center pb-20 italic text-gray-400 text-xl px-20">
          Esta carteira é pessoal e intransferível. O porte é obrigatório em serviço.
          <br/>
          <span className="font-bold not-italic mt-4 block">ASSPRIJUF - JUIZ DE FORA</span>
        </div>
      </div>
    </div>
  );
};

export default IDCardBack;
