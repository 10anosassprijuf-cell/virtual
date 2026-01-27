
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

  const securityHash = btoa(`${data.masp || '0'}-${data.cpf || '0'}-${expeditionDate}`).substring(0, 16).toUpperCase();

  const qrValue = `https://depen.seguranca.mg.gov.br/`;

  const InfoRow = ({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) => (
    <div className={`w-full border-b-[3px] border-gray-100 py-3 px-10 ${highlight ? 'bg-slate-50' : ''}`}>
      <p className="text-[16px] text-gray-400 font-bold uppercase tracking-widest mb-1 leading-none">{label}</p>
      <p className={`text-[32px] font-black leading-tight tracking-tight text-gray-900`}>
        {value || '---'}
      </p>
    </div>
  );

  return (
    <div 
      id={id}
      className="flex flex-col bg-white overflow-hidden relative m-0 p-0"
      style={{ 
        width: '1080px', 
        height: '1528px',
        minWidth: '1080px',
        minHeight: '1528px',
        boxSizing: 'border-box'
      }}
    >
      <div 
        className="absolute left-0 top-0 bottom-0 w-10" 
        style={{ backgroundColor: accentColor }}
      />

      <div className="flex flex-col items-center pt-14 px-24 h-full">
        
        <div className="flex justify-between items-center w-full mb-8">
          <h2 className="text-[50px] font-black text-slate-800 tracking-widest border-l-[16px] border-red-600 pl-8 uppercase leading-none">
            Dados Funcionais
          </h2>
        </div>

        <div className="flex flex-col w-full">
          <InfoRow label="MASP" value={data.masp} />
          
          <div className="flex w-full">
             <div className="flex-1 border-r-[3px] border-gray-100"><InfoRow label="Matrícula" value={data.registration} /></div>
             <div className="flex-1"><InfoRow label="CPF" value={data.cpf} /></div>
          </div>
          
          <div className="flex w-full">
            <div className="flex-[2] border-r-[3px] border-gray-100"><InfoRow label="RG / Identidade" value={data.identity} /></div>
            <div className="flex-1"><InfoRow label="Tipo Sanguíneo" value={data.bloodType} /></div>
          </div>
          
          <div className="flex w-full">
            <div className="flex-1 border-r-[3px] border-gray-100"><InfoRow label="Nascimento" value={data.birthDate} /></div>
            <div className="flex-1"><InfoRow label="Validade" value={data.expiryDate} /></div>
          </div>

          <div className="flex w-full">
            <div className="flex-1 border-r-[3px] border-gray-100"><InfoRow label="Código de Controle" value={data.code} /></div>
            <div className="flex-1"><InfoRow label="Expedição" value={expeditionDate} /></div>
          </div>
        </div>

        <div className="w-full flex justify-end mt-4 mb-2">
           <div className="flex flex-col items-end opacity-40">
              <span className="text-[12px] font-bold uppercase tracking-[0.3em] mb-1">Criptografia de Segurança</span>
              <span className="text-[26px] font-mono font-black text-slate-900">{securityHash}</span>
           </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center w-full">
          <div className="p-8 border-[16px] border-slate-50 rounded-[60px] bg-white shadow-[0_40px_100px_rgba(0,0,0,0.1)] relative">
             <QRCodeSVG value={qrValue} size={340} level="H" includeMargin={true} />
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-2xl border-4 border-slate-100">
                   <span className="text-red-600 font-black text-[36px]">PP</span>
                </div>
             </div>
          </div>
          
          <div className="mt-8 text-center">
            <h3 className="text-[40px] text-slate-800 font-black tracking-[0.5em] uppercase leading-none">Validação Digital</h3>
            <p className="text-[20px] text-slate-400 font-bold uppercase tracking-widest mt-4">
              Acesse o portal para confirmar os dados do servidor
            </p>
          </div>
        </div>

        <div className="w-full text-center pb-10 mt-auto">
          <p className="italic text-slate-400 text-[20px] mb-4">Documento oficial de uso pessoal e intransferível.</p>
          <div className="h-[2px] w-64 bg-slate-200 mx-auto mb-6"></div>
          <p className="font-black text-slate-900 text-[30px] uppercase tracking-[0.2em] leading-none">ASSPRIJUF - Juiz de Fora</p>
        </div>
      </div>
    </div>
  );
};

export default IDCardBack;
