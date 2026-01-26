import React, { useState, useEffect } from 'react';
import IDCardFront from './components/IDCardFront';
import IDCardBack from './components/IDCardBack';
import { IDCardData } from './types';
import { compressImage, exportToPDF } from './utils/imageProcessing';

const DEFAULT_DATA: IDCardData = {
  id: '',
  photoUrl: '',
  brandLogoUrl: '',
  fullName: '',
  masp: '',
  bloodType: '',
  registration: '',
  cpf: '',
  identity: '',
  birthDate: '',
  expiryDate: '',
  code: 'Cód 0001/2026',
  status: 'ATIVO',
  visualTheme: 'clean'
};

const App: React.FC = () => {
  const [cardData, setCardData] = useState<IDCardData>(DEFAULT_DATA);
  const [side, setSide] = useState<'FRONT' | 'BACK'>('FRONT');
  const [loading, setLoading] = useState(false);
  const [isGoogleEnv, setIsGoogleEnv] = useState(false);

  useEffect(() => {
    // Detecta ambiente com segurança
    const win = window as any;
    if (win.google && win.google.script && win.google.script.run) {
      setIsGoogleEnv(true);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCardData(prev => ({ ...prev, [name]: String(value || '') }));
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLoading(true);
      try {
        const compressed = await compressImage(file);
        setCardData(prev => ({ ...prev, photoUrl: compressed }));
      } catch (err) {
        alert("Erro ao processar foto.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBrandLogoFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLoading(true);
      try {
        const compressed = await compressImage(file, 2);
        setCardData(prev => ({ ...prev, brandLogoUrl: compressed }));
      } catch (err) {
        alert("Erro ao processar logotipo.");
      } finally {
        setLoading(false);
      }
    }
  };

  const saveToStorage = () => {
    if (!cardData.masp) {
      alert("Por favor, preencha o MASP antes de salvar.");
      return;
    }

    setLoading(true);
    const win = window as any;

    if (isGoogleEnv && win.google?.script?.run) {
      win.google.script.run
        .withSuccessHandler(() => { 
          setLoading(false); 
          alert("Dados salvos com sucesso na Planilha Google!"); 
        })
        .withFailureHandler((err: any) => { 
          setLoading(false); 
          alert("Erro ao salvar na nuvem: " + err); 
        })
        .saveDataToSheet(cardData);
    } else {
      try {
        localStorage.setItem(`pp_card_${cardData.masp}`, JSON.stringify(cardData));
        setTimeout(() => {
          setLoading(false);
          alert("Salvo com sucesso no armazenamento local deste navegador!");
        }, 500);
      } catch (e) {
        setLoading(false);
        alert("Erro ao salvar localmente: Espaço insuficiente.");
      }
    }
  };

  const loadFromStorage = () => {
    const m = prompt("Informe o MASP para buscar:");
    if (!m) return;
    
    setLoading(true);
    const win = window as any;

    if (isGoogleEnv && win.google?.script?.run) {
      win.google.script.run
        .withSuccessHandler((d: any) => { 
          setLoading(false); 
          if(d) setCardData(d as IDCardData);
          else alert("MASP não encontrado na planilha.");
        })
        .withFailureHandler((err: any) => {
          setLoading(false);
          alert("Erro ao buscar: " + err);
        })
        .getDataFromSheet(m);
    } else {
      const saved = localStorage.getItem(`pp_card_${m}`);
      setTimeout(() => {
        setLoading(false);
        if (saved) {
          setCardData(JSON.parse(saved));
        } else {
          alert("Nenhum registro local encontrado para este MASP.");
        }
      }, 500);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-100">
      <aside className="w-full lg:w-[420px] bg-white p-6 shadow-xl border-r overflow-y-auto max-h-screen">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-slate-800 rounded flex items-center justify-center text-white font-black">PP</div>
          <div className="flex flex-col">
            <h1 className="font-black text-lg uppercase tracking-tight text-slate-800 leading-none">POLÍCIA PENAL</h1>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {isGoogleEnv ? 'Modo Cloud (Google)' : 'Modo Local (Vercel)'}
            </span>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-2">
            <button onClick={saveToStorage} className="bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-lg font-bold text-[10px] uppercase transition-all shadow-md">
              {isGoogleEnv ? 'Salvar Nuvem' : 'Salvar Local'}
            </button>
            <button onClick={loadFromStorage} className="border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 p-3 rounded-lg font-bold text-[10px] uppercase transition-all">
              Buscar MASP
            </button>
          </div>

          <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
             <div className="space-y-1">
               <label className="text-[10px] font-black text-slate-500 uppercase px-1">Nome Completo</label>
               <input type="text" name="fullName" value={cardData.fullName} onChange={handleInputChange} className="w-full p-2.5 border border-slate-300 rounded-lg text-sm uppercase font-bold focus:ring-2 focus:ring-red-100 outline-none text-slate-900 bg-white" />
             </div>

             <div className="grid grid-cols-2 gap-3">
               <div className="space-y-1">
                 <label className="text-[10px] font-black text-slate-500 uppercase px-1">MASP</label>
                 <input type="text" name="masp" value={cardData.masp} onChange={handleInputChange} className="w-full p-2.5 border border-slate-300 rounded-lg text-sm font-bold bg-white" />
               </div>
               <div className="space-y-1">
                 <label className="text-[10px] font-black text-slate-500 uppercase px-1">Status</label>
                 <select name="status" value={cardData.status} onChange={handleInputChange} className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white font-black text-slate-800">
                    <option value="ATIVO">✅ ATIVO</option>
                    <option value="INATIVO">❌ INATIVO</option>
                 </select>
               </div>
             </div>

             <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase px-1">CPF</label>
                  <input type="text" name="cpf" value={cardData.cpf} onChange={handleInputChange} className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase px-1">Identidade</label>
                  <input type="text" name="identity" value={cardData.identity} onChange={handleInputChange} className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white" />
                </div>
             </div>

             <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase px-1">Nascimento</label>
                  <input type="text" name="birthDate" placeholder="DD/MM/AAAA" value={cardData.birthDate} onChange={handleInputChange} className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase px-1">Validade</label>
                  <input type="text" name="expiryDate" placeholder="DD/MM/AAAA" value={cardData.expiryDate} onChange={handleInputChange} className="w-full p-2.5 border border-slate-300 rounded-lg text-sm font-bold text-red-600 bg-white" />
                </div>
             </div>

             <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase px-1">Matrícula</label>
                  <input type="text" name="registration" value={cardData.registration} onChange={handleInputChange} className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase px-1">Sangue</label>
                  <input type="text" name="bloodType" placeholder="Ex: O+" value={cardData.bloodType} onChange={handleInputChange} className="w-full p-2.5 border border-slate-300 rounded-lg text-sm uppercase bg-white font-bold" />
                </div>
             </div>

             <div className="space-y-1">
               <label className="text-[10px] font-black text-slate-600 uppercase px-1 tracking-widest">Tema Visual</label>
               <select name="visualTheme" value={cardData.visualTheme} onChange={handleInputChange} className="w-full p-3 border-2 border-slate-400 rounded-lg text-sm bg-white font-bold text-slate-900 shadow-sm focus:border-slate-800 outline-none cursor-pointer">
                  <option value="clean">⚪ TEMA CLEAN</option>
                  <option value="black">⚫ TEMA BLACK</option>
                  <option value="metal">🔘 TEMA METAL</option>
                  <option value="rubro">🔴 TEMA RUBRO</option>
               </select>
             </div>

             <div className="pt-4 border-t-2 border-slate-200 space-y-4">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-700 uppercase tracking-widest">Foto 3x4</label>
                  <input type="file" accept="image/*" onChange={handleFile} className="w-full text-[10px] text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-slate-800 file:text-white hover:file:bg-slate-900 cursor-pointer" />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-700 uppercase tracking-widest">Brasão/Logo</label>
                  <input type="file" accept="image/*" onChange={handleBrandLogoFile} className="w-full text-[10px] text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-slate-800 file:text-white hover:file:bg-slate-900 cursor-pointer" />
                </div>
             </div>
          </div>

          <button 
            onClick={() => exportToPDF(['card-front', 'card-back'], `ID_PP_${cardData.masp || 'DOC'}`)} 
            className="w-full bg-slate-900 hover:bg-black text-white p-4 rounded-xl font-black shadow-xl transition-all uppercase text-sm tracking-[0.2em]"
          >
            Exportar PDF (1080x1920)
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-200/50 relative overflow-hidden">
        {loading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-50 flex flex-col items-center justify-center font-black text-slate-900 uppercase">
             Processando...
          </div>
        )}
        
        <div className="flex bg-white/80 backdrop-blur p-1.5 rounded-full shadow-lg mb-8 z-10">
          <button onClick={() => setSide('FRONT')} className={`px-12 py-3 rounded-full font-black text-xs transition-all ${side === 'FRONT' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>FRENTE</button>
          <button onClick={() => setSide('BACK')} className={`px-12 py-3 rounded-full font-black text-xs transition-all ${side === 'BACK' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>VERSO</button>
        </div>

        <div className="id-card-viewport transform scale-[0.20] md:scale-[0.30] lg:scale-[0.35] origin-top transition-all duration-700">
          <div className={`${side === 'FRONT' ? 'block' : 'hidden'} shadow-[0_60px_120px_rgba(0,0,0,0.3)] rounded-[50px] overflow-hidden`}>
            <IDCardFront data={cardData} id="card-front" />
          </div>
          <div className={`${side === 'BACK' ? 'block' : 'hidden'} shadow-[0_60px_120px_rgba(0,0,0,0.3)] rounded-[50px] overflow-hidden`}>
            <IDCardBack data={cardData} id="card-back" />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;