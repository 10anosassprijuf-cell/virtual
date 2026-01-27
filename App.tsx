
import React, { useState, useEffect } from 'react';
import IDCardFront from './components/IDCardFront';
import IDCardBack from './components/IDCardBack';
import { IDCardData } from './types';
import { compressImage, exportToPDF, exportToImages } from './utils/imageProcessing';

const DEFAULT_DATA: IDCardData = {
  id: '',
  photoUrl: '',
  brandLogoUrl: '', 
  fullName: '',
  category: 'TITULAR',
  masp: '',
  bloodType: '',
  registration: '0012026',
  cpf: '',
  identity: '',
  birthDate: '',
  expiryDate: '',
  code: 'Cód 0001/2026',
  visualTheme: 'clean'
};

const App: React.FC = () => {
  const [cardData, setCardData] = useState<IDCardData>(DEFAULT_DATA);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCardData(prev => ({ ...prev, [name]: String(value || '') }));
  };

  const setCategory = (cat: string) => setCardData(prev => ({ ...prev, category: cat }));
  const setTheme = (theme: any) => setCardData(prev => ({ ...prev, visualTheme: theme }));

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>, field: 'photoUrl' | 'brandLogoUrl') => {
    const file = e.target.files?.[0];
    if (file) {
      setLoading(true);
      try {
        const compressed = await compressImage(file);
        setCardData(prev => ({ ...prev, [field]: compressed }));
      } catch (err) {
        alert("Erro ao processar imagem.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleExport = async (type: 'PDF_FULL' | 'PDF_CLONE' | 'JPG') => {
    if (!cardData.fullName || !cardData.masp) {
      alert("Por favor, preencha o Nome e o MASP para habilitar a exportação.");
      return;
    }
    setLoading(true);
    try {
      const cleanMasp = cardData.masp.replace(/\D/g, '') || 'DOC';
      const filename = `CARTEIRINHA_${cleanMasp}`;
      
      if (type === 'PDF_FULL') await exportToPDF(cardData, 'FULL', filename);
      else if (type === 'PDF_CLONE') await exportToPDF(cardData, 'CLONE', filename);
      else if (type === 'JPG') await exportToImages(cardData, filename);
    } catch (err) {
      console.error("Erro na exportação:", err);
      alert("Erro ao gerar arquivos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-100 font-sans">
      <aside className="w-full lg:w-[480px] bg-white lg:h-screen lg:sticky lg:top-0 shadow-2xl z-20 flex flex-col overflow-hidden border-r border-slate-300">
        <div className="p-6 border-b-2 border-slate-100 bg-slate-900 text-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-lg">PP</div>
            <div>
              <h1 className="font-black text-xs uppercase tracking-tighter leading-none">SISTEMA DE EMISSÃO</h1>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 block">ASSPRIJUF OFICIAL</span>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1 pb-10 bg-white">
           
           <div className="space-y-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
             <div className="space-y-2">
               <label className="text-[11px] font-black text-slate-900 uppercase tracking-widest block">Categoria do Servidor</label>
               <div className="grid grid-cols-2 gap-2">
                 <button 
                   onClick={() => setCategory('TITULAR')}
                   className={`py-3 px-4 rounded-xl text-xs font-black transition-all border-2 ${cardData.category === 'TITULAR' ? 'bg-red-600 border-red-600 text-white shadow-md' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}
                 >TITULAR</button>
                 <button 
                   onClick={() => setCategory('DEPENDENTE')}
                   className={`py-3 px-4 rounded-xl text-xs font-black transition-all border-2 ${cardData.category === 'DEPENDENTE' ? 'bg-red-600 border-red-600 text-white shadow-md' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}
                 >DEPENDENTE</button>
               </div>
             </div>

             <div className="space-y-2">
               <label className="text-[11px] font-black text-slate-900 uppercase tracking-widest block">Estilo Visual do Cartão</label>
               <div className="flex gap-3">
                 {[
                   { id: 'clean', color: 'bg-slate-300', label: 'Clean' },
                   { id: 'black', color: 'bg-zinc-900', label: 'Black' },
                   { id: 'metal', color: 'bg-zinc-600', label: 'Metal' },
                   { id: 'rubro', color: 'bg-red-900', label: 'Rubro' }
                 ].map(t => (
                   <button 
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={`w-10 h-10 rounded-full ${t.color} border-4 transition-all ${cardData.visualTheme === t.id ? 'border-red-500 scale-110 shadow-lg' : 'border-white shadow-sm hover:scale-105'}`}
                    title={t.label}
                   />
                 ))}
               </div>
             </div>
           </div>

           <div className="space-y-4">
             <h3 className="text-[10px] font-black text-red-600 uppercase tracking-[0.3em] border-b-2 border-slate-100 pb-1">Identificação</h3>
             
             <div className="space-y-1.5">
               <label className="text-[11px] font-black text-slate-900 uppercase tracking-wider block">Nome Completo</label>
               <input type="text" name="fullName" value={cardData.fullName} onChange={handleInputChange} className="w-full p-3.5 border-2 border-slate-400 rounded-xl text-sm font-bold uppercase focus:border-red-600 outline-none bg-white" placeholder="NOME DO SERVIDOR" />
             </div>

             <div className="grid grid-cols-2 gap-3">
               <div className="space-y-1.5">
                 <label className="text-[11px] font-black text-slate-900 uppercase tracking-wider block">MASP</label>
                 <input type="text" name="masp" value={cardData.masp} onChange={handleInputChange} className="w-full p-3.5 border-2 border-slate-400 rounded-xl text-sm font-bold focus:border-red-600 outline-none" placeholder="000.000-0" />
               </div>
               <div className="space-y-1.5">
                 <label className="text-[11px] font-black text-slate-900 uppercase tracking-wider block">CPF</label>
                 <input type="text" name="cpf" value={cardData.cpf} onChange={handleInputChange} className="w-full p-3.5 border-2 border-slate-400 rounded-xl text-sm font-bold focus:border-red-600 outline-none" placeholder="000.000.000-00" />
               </div>
             </div>
           </div>

           <div className="space-y-4">
             <h3 className="text-[10px] font-black text-red-600 uppercase tracking-[0.3em] border-b-2 border-slate-100 pb-1">Dados Funcionais</h3>
             
             <div className="grid grid-cols-2 gap-3">
               <div className="space-y-1.5">
                 <label className="text-[11px] font-black text-slate-900 uppercase tracking-wider block">Identidade (RG)</label>
                 <input type="text" name="identity" value={cardData.identity} onChange={handleInputChange} className="w-full p-3.5 border-2 border-slate-400 rounded-xl text-sm font-bold focus:border-red-600 outline-none" placeholder="MG-00.000.000" />
               </div>
               <div className="space-y-1.5">
                 <label className="text-[11px] font-black text-slate-900 uppercase tracking-wider block">Tipo Sanguíneo</label>
                 <input type="text" name="bloodType" value={cardData.bloodType} onChange={handleInputChange} className="w-full p-3.5 border-2 border-slate-400 rounded-xl text-sm font-bold focus:border-red-600 outline-none" placeholder="Ex: AB+" />
               </div>
             </div>

             <div className="grid grid-cols-2 gap-3">
               <div className="space-y-1.5">
                 <label className="text-[11px] font-black text-slate-900 uppercase tracking-wider block">Data Nascimento</label>
                 <input type="text" name="birthDate" value={cardData.birthDate} onChange={handleInputChange} className="w-full p-3.5 border-2 border-slate-400 rounded-xl text-sm font-bold focus:border-red-600 outline-none" placeholder="DD/MM/AAAA" />
               </div>
               <div className="space-y-1.5">
                 <label className="text-[11px] font-black text-slate-900 uppercase tracking-wider block">Data Validade</label>
                 <input type="text" name="expiryDate" value={cardData.expiryDate} onChange={handleInputChange} className="w-full p-3.5 border-2 border-slate-400 rounded-xl text-sm font-bold focus:border-red-600 outline-none" placeholder="DD/MM/AAAA" />
               </div>
             </div>

             <div className="grid grid-cols-1 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-900 uppercase tracking-wider block">Matrícula</label>
                  <input type="text" name="registration" value={cardData.registration} onChange={handleInputChange} className="w-full p-3.5 border-2 border-slate-400 rounded-xl text-sm font-bold outline-none" placeholder="MATRÍCULA" />
                </div>
             </div>
           </div>

           <div className="pt-4 border-t-2 border-slate-100 space-y-4">
              <div className="flex flex-col gap-1.5">
                 <label className="text-[11px] font-black text-slate-900 uppercase tracking-wider">Brasão / Logo Personalizada</label>
                 <div className="relative group">
                   <input type="file" onChange={(e) => handleFile(e, 'brandLogoUrl')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                   <div className="border-2 border-dashed border-slate-400 rounded-xl p-4 text-center group-hover:border-red-600 group-hover:bg-red-50 transition-all">
                     <span className="text-[10px] font-black text-slate-500 group-hover:text-red-600 uppercase">Anexar Brasão</span>
                   </div>
                 </div>
              </div>

              <div className="flex flex-col gap-1.5">
                 <label className="text-[11px] font-black text-slate-900 uppercase tracking-wider">Foto do Servidor (3x4)</label>
                 <div className="relative group">
                   <input type="file" onChange={(e) => handleFile(e, 'photoUrl')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                   <div className="border-2 border-dashed border-slate-400 rounded-xl p-4 text-center group-hover:border-red-600 group-hover:bg-red-50 transition-all">
                     <span className="text-[10px] font-black text-slate-500 group-hover:text-red-600 uppercase">Anexar Foto Profissional</span>
                   </div>
                 </div>
              </div>
           </div>

           <div className="pt-6 mt-4 border-t-4 border-slate-100 space-y-3">
              <button 
                onClick={() => handleExport('PDF_FULL')} 
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-black shadow-lg uppercase text-[12px] tracking-widest flex items-center justify-center gap-3 disabled:opacity-50 transition-all active:scale-95"
              >
                {loading ? 'PROCESSANDO...' : 'EXPORTAR PDF (FOLHA A4)'}
              </button>
              
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => handleExport('PDF_CLONE')} 
                  disabled={loading}
                  className="bg-slate-900 hover:bg-black text-white py-4 rounded-xl font-black shadow-md uppercase text-[10px] tracking-widest disabled:opacity-50"
                >
                  FRENTE + VERSO
                </button>
                <button 
                  onClick={() => handleExport('JPG')} 
                  disabled={loading}
                  className="bg-white border-2 border-slate-400 text-slate-900 hover:bg-slate-50 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest disabled:opacity-50 shadow-sm"
                >
                  SALVAR JPG
                </button>
              </div>
           </div>
        </div>
      </aside>

      <main className="flex-1 bg-slate-200/50 p-4 lg:p-12 overflow-y-auto">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-8 pb-20">
          <div className="text-center">
            <h2 className="font-black text-slate-900 uppercase tracking-widest text-lg">Pré-Visualização</h2>
            <p className="text-slate-500 text-sm font-bold mt-1 uppercase tracking-tighter">ASSPRIJUF - Identidade Virtual</p>
          </div>
          
          <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} items-center justify-center gap-10 w-full`}>
             <div className="flex flex-col items-center gap-4 w-full max-w-[400px]">
               <div className="bg-slate-900 text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">FRENTE</div>
               <div className="w-full aspect-[1080/1528] bg-white shadow-2xl rounded-2xl overflow-hidden relative border-4 border-white">
                  <div className="absolute inset-0 origin-top-left" style={{ transform: `scale(${isMobile ? (window.innerWidth - 64) / 1080 : 0.37})` }}>
                     <IDCardFront data={cardData} />
                  </div>
               </div>
             </div>

             <div className="flex flex-col items-center gap-4 w-full max-w-[400px]">
               <div className="bg-slate-900 text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">VERSO</div>
               <div className="w-full aspect-[1080/1528] bg-white shadow-2xl rounded-2xl overflow-hidden relative border-4 border-white">
                  <div className="absolute inset-0 origin-top-left" style={{ transform: `scale(${isMobile ? (window.innerWidth - 64) / 1080 : 0.37})` }}>
                     <IDCardBack data={cardData} />
                  </div>
               </div>
             </div>
          </div>
        </div>

        {loading && (
          <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-md flex flex-col items-center justify-center">
             <div className="w-16 h-16 border-4 border-white/20 border-t-red-600 rounded-full animate-spin mb-4"></div>
             <span className="font-black text-white uppercase tracking-widest animate-pulse">Gerando Documento...</span>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
