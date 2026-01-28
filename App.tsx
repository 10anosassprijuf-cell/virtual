
import React, { useState } from 'react';
import IDCardFront from './components/IDCardFront';
import IDCardBack from './components/IDCardBack';
import { IDCardData } from './types';
import { compressImage, exportToPDF, exportToImages } from './utils/imageProcessing';
import { 
  Shield, 
  User, 
  Download, 
  FileText, 
  Camera, 
  Image as ImageIcon, 
  CheckCircle,
  ArrowLeft,
  Settings,
  Share2,
  Lock
} from 'lucide-react';

const LOGO_ASSPRIJUF = 'https://i.postimg.cc/7L5nMWr2/assprijuf-transparente.png';
const LOGO_BRASAO = 'https://i.postimg.cc/prCjtfMw/assprijuf-brasao.png';

const INITIAL_DATA: IDCardData = {
  id: '',
  fullName: '',
  category: 'TITULAR',
  masp: '',
  bloodType: 'O+',
  registration: '',
  cpf: '',
  identity: '',
  birthDate: '',
  expiryDate: '',
  code: 'PP-MG-' + Math.floor(Math.random() * 10000),
  visualTheme: 'clean',
  photoUrl: '',
  brandLogoUrl: LOGO_ASSPRIJUF,
  secondaryLogoUrl: LOGO_BRASAO
};

export default function App() {
  const [cardData, setCardData] = useState<IDCardData>(INITIAL_DATA);
  const [isEditing, setIsEditing] = useState(true);
  const [loading, setLoading] = useState(false);

  const activeData = { 
    ...cardData, 
    brandLogoUrl: LOGO_ASSPRIJUF,
    secondaryLogoUrl: LOGO_BRASAO 
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCardData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await compressImage(file);
        setCardData(prev => ({ ...prev, photoUrl: base64 }));
      } catch (error) {
        console.error("Erro ao processar imagem:", error);
      }
    }
  };

  const finishAndPreview = () => {
    if (!cardData.masp || !cardData.fullName) {
      alert("Por favor, preencha o Nome e o MASP para liberar os botões de exportação.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsEditing(false);
      // Scroll suave para a área de exportação
      const exportArea = document.getElementById('export-actions');
      if (exportArea) {
        exportArea.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 custom-scrollbar text-slate-900 selection:bg-red-100 selection:text-red-900">
      <header className="max-w-6xl mx-auto mb-10 flex flex-col md:flex-row justify-between items-center border-b border-slate-200 pb-8 gap-6">
        <div className="flex items-center gap-5">
          <div className="bg-slate-900 p-3 rounded-2xl shadow-xl">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none">ID POLÍCIA PENAL</h1>
            <p className="text-slate-400 text-xs font-black uppercase tracking-[0.3em] mt-2">Plataforma ASSPRIJUF Digital</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
          <img src={LOGO_ASSPRIJUF} alt="Logo" className="h-12 w-auto object-contain" />
          <div className="w-px h-8 bg-slate-200"></div>
          <img src={LOGO_BRASAO} alt="Brasão" className="h-12 w-auto object-contain" />
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-12 gap-12 items-start">
        {/* Coluna do Formulário */}
        <section className={`xl:col-span-5 bg-white p-8 rounded-[2.5rem] shadow-2xl border border-white relative transition-all duration-500 ${!isEditing ? 'opacity-40 pointer-events-none scale-95 blur-[2px]' : 'scale-100'}`}>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <User className="text-red-600 w-6 h-6" />
              <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Dados do Servidor</h2>
            </div>
            <Settings className="text-slate-200" />
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Nome Completo</label>
              <input name="fullName" value={cardData.fullName} onChange={handleInputChange} type="text" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-900 font-bold focus:border-red-500 focus:bg-white outline-none transition-all uppercase" placeholder="NOME DO POLICIAL" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">MASP</label>
                <input name="masp" value={cardData.masp} onChange={handleInputChange} type="text" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-900 font-bold focus:border-red-500 outline-none" placeholder="000.000-0" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Matrícula</label>
                <input name="registration" value={cardData.registration} onChange={handleInputChange} type="text" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-900 font-bold focus:border-red-500 outline-none" placeholder="00000" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Nascimento</label>
                <input name="birthDate" value={cardData.birthDate} onChange={handleInputChange} type="date" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-900 font-bold focus:border-red-500 outline-none" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Validade</label>
                <input name="expiryDate" value={cardData.expiryDate} onChange={handleInputChange} type="date" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-900 font-bold focus:border-red-500 outline-none" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Sanguíneo</label>
                <select name="bloodType" value={cardData.bloodType} onChange={handleInputChange} className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-900 font-bold outline-none cursor-pointer">
                  <option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>AB+</option><option>AB-</option><option>O+</option><option>O-</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Categoria</label>
                <select name="category" value={cardData.category} onChange={handleInputChange} className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-900 font-bold outline-none cursor-pointer">
                  <option value="TITULAR">Titular</option>
                  <option value="DEPENDENTE">Dependente</option>
                  <option value="APOSENTADO">Aposentado</option>
                </select>
              </div>
            </div>

            <div className="pt-4">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Escolha a Cor de Acabamento</label>
              <div className="grid grid-cols-4 gap-3">
                {['clean', 'black', 'metal', 'rubro'].map((theme) => (
                  <button
                    key={theme}
                    onClick={() => setCardData(p => ({ ...p, visualTheme: theme as any }))}
                    className={`h-14 rounded-2xl border-2 transition-all flex items-center justify-center ${
                      cardData.visualTheme === theme ? 'border-red-600 bg-red-50 scale-105 shadow-lg shadow-red-100' : 'border-slate-100 bg-slate-50'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full shadow-inner ${
                      theme === 'clean' ? 'bg-[#D1D3D6]' : 
                      theme === 'black' ? 'bg-zinc-900' : 
                      theme === 'metal' ? 'bg-zinc-600' : 'bg-red-800'
                    }`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-6">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Foto para Documento</label>
              <div className="bg-slate-50 p-6 rounded-[2rem] border-2 border-dashed border-slate-200 flex items-center gap-6 group hover:border-red-200 transition-colors">
                <label className="cursor-pointer bg-white w-28 h-28 rounded-2xl shadow-xl flex items-center justify-center border-4 border-white hover:border-red-500 transition-all overflow-hidden relative">
                  {cardData.photoUrl ? (
                    <img src={cardData.photoUrl} className="w-full h-full object-cover" alt="Preview" />
                  ) : (
                    <Camera className="text-slate-200 w-10 h-10 group-hover:text-red-200 transition-colors" />
                  )}
                  <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                </label>
                <div className="flex-1 text-[11px] text-slate-400 font-bold leading-relaxed uppercase">
                  {cardData.photoUrl ? (
                    <span className="text-green-600 flex items-center gap-2">
                      <CheckCircle size={14}/> Foto anexada
                    </span>
                  ) : "Toque no quadro para subir sua foto 3x4."}
                </div>
              </div>
            </div>
          </div>
          
          <button 
            disabled={loading}
            onClick={finishAndPreview}
            className="w-full mt-10 bg-red-600 text-white font-black py-6 rounded-2xl hover:bg-red-700 transition-all shadow-2xl active:scale-95 text-sm tracking-[0.2em] disabled:opacity-50 flex items-center justify-center gap-3 animate-pulse-slow"
          >
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Shield size={20} />}
            {loading ? 'GERANDO DOCUMENTO...' : 'GERAR IDENTIDADE VIRTUAL'}
          </button>
          <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-4">Os botões de exportação serão liberados após clicar acima.</p>
        </section>

        {/* Coluna da Visualização e Exportação */}
        <section className="xl:col-span-7 flex flex-col items-center">
          <div className="w-full max-w-[620px] flex flex-col gap-8">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex flex-col">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em]">Visualização do Cartão</h3>
                {!isEditing && <span className="text-[10px] font-black text-green-600 uppercase tracking-widest mt-1">Documento disponível para salvar</span>}
              </div>
              {!isEditing && (
                <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 text-red-600 font-black text-[10px] uppercase tracking-widest bg-red-50 px-5 py-2.5 rounded-xl transition-all hover:bg-red-100">
                  <ArrowLeft size={14}/> Voltar ao Formulário
                </button>
              )}
            </div>

            {/* PAINEL DE EXPORTAÇÃO */}
            <div id="export-actions">
              {!isEditing ? (
                <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl flex flex-col gap-6 animate-in slide-in-from-top-4 duration-500 ring-4 ring-red-600/20">
                  <div className="flex items-center gap-3">
                    <div className="bg-red-600 p-2 rounded-lg">
                      <Download className="text-white w-5 h-5" />
                    </div>
                    <h4 className="text-white font-black text-xs uppercase tracking-[0.3em]">Salvar Documento</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button 
                      onClick={() => exportToPDF(activeData, 'FULL', `PP_ID_${activeData.masp}`)} 
                      className="flex items-center justify-center gap-3 bg-red-600 text-white px-6 py-5 rounded-2xl hover:bg-red-500 transition-all font-black uppercase text-[11px] tracking-widest shadow-xl shadow-red-900/20 active:scale-95"
                    >
                      <FileText size={18}/> Baixar PDF
                    </button>
                    <button 
                      onClick={() => exportToPDF(activeData, 'CLONE', `PP_A4_${activeData.masp}`)} 
                      className="flex items-center justify-center gap-3 bg-white/10 text-white border border-white/20 px-6 py-5 rounded-2xl hover:bg-white/20 transition-all font-black uppercase text-[11px] tracking-widest active:scale-95"
                    >
                      <Settings size={18}/> Imprimir (A4)
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => exportToImages(activeData, `PP_IMG_${activeData.masp}`)} 
                    className="w-full flex items-center justify-center gap-3 bg-slate-800 text-slate-300 px-6 py-4 rounded-2xl hover:bg-slate-700 transition-all font-black uppercase text-[11px] tracking-widest"
                  >
                    <ImageIcon size={18}/> Salvar Frente e Verso (JPG)
                  </button>
                </div>
              ) : (
                <div className="bg-slate-100 p-10 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center gap-4 opacity-60">
                  <div className="bg-white p-4 rounded-full shadow-sm">
                    <Lock className="text-slate-300 w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-slate-400 font-black text-xs uppercase tracking-[0.3em]">Exportação Bloqueada</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">Os botões de PDF e JPG aparecerão aqui <br/> após você gerar a identidade.</p>
                  </div>
                </div>
              )}
            </div>

            {/* CARTÕES */}
            <div className="flex flex-col gap-12">
              <div className="w-full aspect-[1080/1528] rounded-[2.5rem] overflow-hidden shadow-[0_60px_150px_rgba(0,0,0,0.25)] bg-white border border-slate-100 ring-8 ring-white">
                <div className="scale-[0.42] md:scale-[0.52] lg:scale-[0.58] xl:scale-[0.45] 2xl:scale-[0.56] origin-top-left">
                  <IDCardFront data={activeData} />
                </div>
              </div>

              <div className="w-full aspect-[1080/1528] rounded-[2.5rem] overflow-hidden shadow-[0_60px_150px_rgba(0,0,0,0.25)] bg-white border border-slate-100 ring-8 ring-white">
                <div className="scale-[0.42] md:scale-[0.52] lg:scale-[0.58] xl:scale-[0.45] 2xl:scale-[0.56] origin-top-left">
                  <IDCardBack data={activeData} />
                </div>
              </div>
            </div>

            {!isEditing && (
              <div className="mt-10 mb-20 p-8 border-2 border-dashed border-slate-200 rounded-[2.5rem] text-center">
                 <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] mb-4">Fim da Pré-visualização</p>
                 <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-slate-800 font-black text-[10px] uppercase tracking-widest hover:underline">Subir para Opções de Download</button>
              </div>
            )}
          </div>
        </section>
      </main>
      
      <footer className="max-w-6xl mx-auto mt-20 pb-16 border-t border-slate-200 pt-12 text-center">
        <div className="flex justify-center items-center gap-6 mb-8 opacity-60">
           <img src={LOGO_ASSPRIJUF} alt="Logo" className="h-10 w-auto grayscale" />
           <div className="w-px h-6 bg-slate-300"></div>
           <img src={LOGO_BRASAO} alt="Brasão" className="h-10 w-auto grayscale" />
        </div>
        <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.6em] leading-relaxed">
          PLATAFORMA ASSPRIJUF • JUIZ DE FORA - MG<br/>
          IDENTIDADE DIGITAL DO SERVIDOR © 2025
        </p>
      </footer>
    </div>
  );
}
