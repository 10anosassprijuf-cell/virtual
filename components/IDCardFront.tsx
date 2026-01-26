
import React from 'react';
import { IDCardData } from '../types';

interface IDCardFrontProps {
  data: IDCardData;
  id?: string;
}

const IDCardFront: React.FC<IDCardFrontProps> = ({ data, id }) => {
  const themes = {
    clean: {
      bg: '#E9EAEC',
      gradient: 'linear-gradient(135deg, #E9EAEC 0%, #D1D3D6 100%)',
      header: '#A3A5A0',
      footer: '#A4A7A1',
      textMain: 'text-slate-800',
      textName: 'text-slate-900',
      nameBg: 'bg-white/40',
      photoBorder: 'border-white'
    },
    black: {
      bg: '#0a0a0a',
      gradient: 'linear-gradient(135deg, #1a1a1a 0%, #000000 100%)',
      header: '#333333',
      footer: '#000000',
      textMain: 'text-gray-200',
      textName: 'text-white',
      nameBg: 'bg-white/10',
      photoBorder: 'border-zinc-800'
    },
    metal: {
      bg: '#52525b',
      gradient: 'linear-gradient(135deg, #71717a 0%, #3f3f46 100%)',
      header: '#27272a',
      footer: '#18181b',
      textMain: 'text-zinc-100',
      textName: 'text-white',
      nameBg: 'bg-black/20',
      photoBorder: 'border-zinc-400'
    },
    rubro: {
      bg: '#450a0a',
      gradient: 'linear-gradient(135deg, #7f1d1d 0%, #450a0a 100%)',
      header: '#991b1b',
      footer: '#1a0000',
      textMain: 'text-red-50',
      textName: 'text-white',
      nameBg: 'bg-black/30',
      photoBorder: 'border-red-900'
    }
  };

  const style = themes[data.visualTheme || 'clean'];

  return (
    <div 
      id={id}
      className="relative flex flex-col items-center overflow-hidden shadow-2xl"
      style={{ 
        width: '1080px', 
        height: '1920px', 
        backgroundColor: style.bg,
        backgroundImage: style.gradient
      }}
    >
      {/* Faixa Superior */}
      <div 
        className="w-full h-24 shadow-xl flex items-center justify-center border-b-[8px] border-black/10"
        style={{ backgroundColor: style.header }}
      >
        <div className="h-2.5 bg-white/20 w-1/3 rounded-full"></div>
      </div>
      
      {/* Conteúdo Principal */}
      <div className="flex flex-col items-center w-full px-20 pt-24 pb-12">
        
        {/* LOGO INSTITUCIONAL - TEMPLATE DE CARREGAMENTO */}
        <div className="w-80 h-80 mb-16 relative">
          <div className="absolute inset-0 bg-red-600 rounded-full blur-[60px] opacity-10"></div>
          <div className={`relative w-full h-full flex items-center justify-center ${!data.brandLogoUrl ? 'border-[10px] border-dashed border-slate-400 rounded-full' : ''}`}>
            {data.brandLogoUrl ? (
              <img 
                src={data.brandLogoUrl} 
                alt="Logo Institucional"
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-center opacity-30 px-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-slate-800 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-3xl font-black uppercase tracking-tighter text-slate-800 leading-none">
                  INCLUA A MARCA
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="text-center space-y-4 mb-16">
          <h1 className={`text-[120px] font-black tracking-tighter uppercase leading-[0.8] drop-shadow-md ${style.textMain}`}>
            POLÍCIA PENAL
          </h1>
          <div className="flex items-center justify-center gap-10 mt-8">
            <div className="h-2 w-48 bg-red-600 rounded-full"></div>
            <div className="h-6 w-6 rounded-full bg-slate-800 border-4 border-white shadow-md"></div>
            <div className="h-2 w-48 bg-red-600 rounded-full"></div>
          </div>
        </div>

        {/* ÁREA DA FOTO */}
        <div className="relative mb-24">
          <div className={`w-[560px] h-[740px] border-[16px] bg-slate-300 shadow-[0_30px_70px_rgba(0,0,0,0.5)] overflow-hidden flex items-center justify-center rounded-sm ring-2 ring-black/20 ${style.photoBorder}`}>
            {data.photoUrl ? (
              <img src={data.photoUrl} alt="Servidor" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center justify-center gap-8 px-10 text-center opacity-30">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-48 w-48 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-3xl font-black uppercase tracking-[0.1em] text-slate-800 leading-tight">
                  INCLUA FOTO POLICIAL OU DEPENDENTE
                </span>
              </div>
            )}
          </div>
          
          <div className={`absolute -bottom-12 -right-12 w-52 h-52 rounded-full border-[12px] flex flex-col items-center justify-center shadow-2xl overflow-hidden ring-4 ring-white/10 ${data.visualTheme === 'clean' ? 'bg-white border-[#E9EAEC]' : 'bg-slate-900 border-slate-700'}`}>
            <span className={`relative font-black text-6xl leading-none tracking-tighter ${data.visualTheme === 'clean' ? 'text-slate-800' : 'text-white'}`}>ID</span>
            <span className={`relative font-bold text-2xl uppercase tracking-[0.1em] mt-1 ${data.visualTheme === 'clean' ? 'text-slate-500' : 'text-slate-400'}`}>OFICIAL</span>
          </div>
        </div>

        {/* NOME DO SERVIDOR */}
        <div className="text-center w-full px-10">
          <p className={`text-4xl font-black uppercase tracking-[0.4em] mb-6 opacity-60 ${style.textMain}`}>Servidor Público</p>
          <div className="relative inline-block w-full">
            <div className={`backdrop-blur-md rounded-3xl py-8 px-12 border border-white/10 shadow-2xl ${style.nameBg}`}>
              <p className={`text-[84px] font-black uppercase leading-[1.1] tracking-tight drop-shadow-sm ${style.textName}`}>
                {data.fullName || "IDENTIFICAÇÃO"}
              </p>
            </div>
            <div className="mt-4 h-2.5 w-full bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-80"></div>
          </div>
        </div>
      </div>

      {/* Rodapé */}
      <div 
        className="absolute bottom-0 w-full h-56 flex flex-col items-center justify-center border-t-[12px] border-black/20 shadow-[0_-20px_50px_rgba(0,0,0,0.2)]"
        style={{ backgroundColor: style.footer }}
      >
         <p className="text-white text-5xl font-black tracking-[0.6em] uppercase mb-3">ASSPRIJUF</p>
         <div className="h-1 w-64 bg-white/20 rounded-full mb-3"></div>
         <p className="text-white/70 text-2xl font-bold tracking-tight uppercase">Secretaria de Estado de Justiça e Segurança Pública</p>
      </div>
    </div>
  );
};

export default IDCardFront;
