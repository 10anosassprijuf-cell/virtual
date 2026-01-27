import React from 'react';
import { IDCardData } from '../types';

interface IDCardFrontProps {
  data: IDCardData;
}

const IDCardFront: React.FC<IDCardFrontProps> = ({ data }) => {
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
      {/* Faixa Superior */}
      <div className="w-full h-[100px] flex items-center justify-center border-b-[4px] border-black/5" style={{ backgroundColor: style.header }}></div>
      
      <div className="flex flex-col items-center w-full px-20 pt-10 flex-1 relative">
        {/* Brasão */}
        <div className="w-[320px] h-[320px] mb-6 relative flex items-center justify-center">
          {data.brandLogoUrl ? (
            <img src={data.brandLogoUrl} alt="Brasão" className="w-full h-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.3)]" />
          ) : (
            <div className="w-full h-full border-4 border-dashed border-black/10 rounded-full flex items-center justify-center">
               <span className="text-[20px] font-black text-black/10 uppercase tracking-widest text-center px-8">Brasão</span>
            </div>
          )}
        </div>

        {/* Cabeçalho */}
        <div className="text-center mb-8 w-full">
          <h1 className={`text-[110px] font-black tracking-tight uppercase leading-[0.8] drop-shadow-2xl ${style.textMain}`}>POLÍCIA PENAL</h1>
          <div className="flex items-center justify-center gap-12 mt-10">
            <div className="h-2.5 w-52 bg-red-600 rounded-full shadow-lg"></div>
            <div className="h-2.5 w-52 bg-red-600 rounded-full shadow-lg"></div>
          </div>
        </div>

        {/* Foto */}
        <div className="relative mb-8">
          <div className={`w-[480px] h-[600px] border-[20px] bg-slate-200 shadow-[0_40px_80px_rgba(0,0,0,0.6)] overflow-hidden flex items-center justify-center ${style.photoBorder}`}>
            {data.photoUrl ? (
              <img src={data.photoUrl} alt="Foto" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center opacity-20">
                <svg className="h-40 w-40 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Informações do Servidor */}
        <div className="text-center w-full px-2">
          {/* Badge de Categoria (TITULAR/DEPENDENTE) */}
          <div className="flex justify-center mb-6">
            <div className={`px-16 py-3 rounded-full border-2 border-black/10 shadow-lg ${style.categoryTag}`}>
              <span className={`text-[45px] font-black uppercase tracking-[0.3em] ${style.categoryText}`}>
                {data.category || 'TITULAR'}
              </span>
            </div>
          </div>

          <div className={`rounded-[40px] min-h-[180px] w-full flex items-center justify-center py-8 px-12 shadow-2xl border-b-8 border-black/10 ${style.nameBg}`}>
            <p className={`${getNameFontSize(data.fullName)} font-black uppercase leading-[1.0] tracking-tighter text-center ${style.textName}`}>
              {data.fullName || `NOME DO ${data.category || 'TITULAR'}`}
            </p>
          </div>
        </div>
      </div>

      {/* Rodapé */}
      <div className="w-full h-64 flex flex-col items-center justify-center border-t-[12px] border-black/10 shadow-[0_-20px_50px_rgba(0,0,0,0.2)]" style={{ backgroundColor: style.footer }}>
        <p className="text-white text-[130px] font-black tracking-[0.05em] uppercase leading-none drop-shadow-lg">ASSPRIJUF</p>
      </div>
    </div>
  );
};

export default IDCardFront;