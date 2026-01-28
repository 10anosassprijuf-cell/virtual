
import React, { useState } from 'react';
import { IDCardData } from '../types';

interface IDCardFrontProps {
  data: IDCardData;
}

const IDCardFront: React.FC<IDCardFrontProps> = ({ data }) => {
  const [logo1Error, setLogo1Error] = useState(false);
  const [logo2Error, setLogo2Error] = useState(false);

  const themes = {
    clean: { bg: '#E9EAEC', gradient: 'linear-gradient(135deg, #E9EAEC 0%, #D1D3D6 100%)', header: '#A3A5A0', footer: '#A4A7A1', textMain: 'text-slate-800', textName: 'text-slate-900', nameBg: 'bg-[#f0f1f3]', photoBorder: 'border-white', categoryTag: 'bg-slate-300/50', categoryText: 'text-slate-600' },
    black: { bg: '#0a0a0a', gradient: 'linear-gradient(135deg, #1a1a1a 0%, #000000 100%)', header: '#333333', footer: '#000000', textMain: 'text-gray-200', textName: 'text-white', nameBg: 'bg-[#1a1a1a]', photoBorder: 'border-zinc-800', categoryTag: 'bg-zinc-800', categoryText: 'text-zinc-400' },
    metal: { bg: '#52525b', gradient: 'linear-gradient(135deg, #71717a 0%, #3f3f46 100%)', header: '#27272a', footer: '#18181b', textMain: 'text-zinc-100', textName: 'text-white', nameBg: 'bg-[#27272a]', photoBorder: 'border-zinc-400', categoryTag: 'bg-zinc-700', categoryText: 'text-zinc-300' },
    rubro: { bg: '#450a0a', gradient: 'linear-gradient(135deg, #7f1d1d 0%, #450a0a 100%)', header: '#991b1b', footer: '#1a0000', textMain: 'text-red-50', textName: 'text-white', nameBg: 'bg-[#310505]', photoBorder: 'border-red-900', categoryTag: 'bg-red-900/50', categoryText: 'text-red-200' }
  };

  const style = themes[data.visualTheme || 'clean'];

  const getNameFontSize = (name: string) => {
    const len = (name || "").length;
    if (len > 30) return 'text-[55px]';
    if (len > 22) return 'text-[65px]';
    return 'text-[78px]';
  };

  return (
    <div className="relative flex flex-col items-center overflow-hidden m-0 p-0 shadow-2xl" style={{ width: '1080px', height: '1528px', backgroundColor: style.bg, backgroundImage: style.gradient }}>
      {/* Barra de Topo */}
      <div className="w-full h-[90px] flex items-center justify-center shadow-lg relative z-10" style={{ backgroundColor: style.header }}>
         <div className="w-[800px] h-[4px] bg-white/20 rounded-full"></div>
      </div>
      
      <div className="flex flex-col items-center w-full px-20 pt-14 flex-1 relative">
        {/* LOGOS DUPLOS LADO A LADO */}
        <div className="flex items-center justify-center gap-20 mb-12">
          {/* Logo 1: ASSPRIJUF */}
          <div className="w-[340px] h-[340px] relative flex items-center justify-center">
            {!logo1Error ? (
              <img 
                src={data.brandLogoUrl} 
                alt="Logo ASSPRIJUF" 
                className="w-full h-full object-contain drop-shadow-[0_25px_50px_rgba(0,0,0,0.35)]" 
                onError={() => setLogo1Error(true)}
              />
            ) : null}
          </div>

          {/* Logo 2: Brasão */}
          <div className="w-[340px] h-[340px] relative flex items-center justify-center">
            {!logo2Error ? (
              <img 
                src={data.secondaryLogoUrl} 
                alt="Brasão Oficial" 
                className="w-full h-full object-contain drop-shadow-[0_25px_50px_rgba(0,0,0,0.35)]" 
                onError={() => setLogo2Error(true)}
              />
            ) : null}
          </div>
        </div>

        {/* Título Principal */}
        <div className="text-center mb-10 w-full">
          <h1 className={`text-[115px] font-black tracking-tighter uppercase leading-[0.85] drop-shadow-xl ${style.textMain}`}>POLÍCIA PENAL</h1>
          <div className="flex items-center justify-center gap-16 mt-12">
            <div className="h-3 w-48 bg-red-600 rounded-full shadow-lg"></div>
            <div className="h-3 w-48 bg-red-600 rounded-full shadow-lg"></div>
          </div>
        </div>

        {/* Fotografia */}
        <div className="relative mb-8">
          <div className={`w-[480px] h-[600px] border-[22px] bg-slate-100 shadow-[0_60px_100px_rgba(0,0,0,0.6)] overflow-hidden flex items-center justify-center ${style.photoBorder}`}>
            {data.photoUrl ? (
              <img src={data.photoUrl} alt="Foto" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center opacity-10">
                <svg className="h-44 w-44 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Nome do Servidor */}
        <div className="text-center w-full px-4">
          <div className="flex justify-center mb-6">
            <div className={`px-16 py-4 rounded-full border-2 border-black/5 shadow-md ${style.categoryTag}`}>
              <span className={`text-[44px] font-black uppercase tracking-[0.4em] ${style.categoryText}`}>
                {data.category || 'TITULAR'}
              </span>
            </div>
          </div>

          <div className={`rounded-[45px] min-h-[190px] w-full flex items-center justify-center py-8 px-12 shadow-2xl border-b-[12px] border-black/15 ${style.nameBg}`}>
            <p className={`${getNameFontSize(data.fullName)} font-black uppercase leading-[1.0] tracking-tighter text-center ${style.textName}`}>
              {data.fullName || "SERVIDOR ASSPRIJUF"}
            </p>
          </div>
        </div>
      </div>

      {/* Rodapé ASSPRIJUF */}
      <div className="w-full h-72 flex flex-col items-center justify-center border-t-[12px] border-black/10 shadow-[0_-20px_50px_rgba(0,0,0,0.2)]" style={{ backgroundColor: style.footer }}>
        <p className="text-white text-[140px] font-black tracking-[0.05em] uppercase leading-none drop-shadow-2xl">ASSPRIJUF</p>
      </div>
    </div>
  );
};

export default IDCardFront;
