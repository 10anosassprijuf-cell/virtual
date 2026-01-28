
import { jsPDF } from 'jspdf';
import { IDCardData } from '../types';

const loadImage = (src: string, timeout = 7000): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    const timer = setTimeout(() => {
      img.src = ""; 
      reject(new Error("Timeout carregando imagem"));
    }, timeout);

    img.onload = () => {
      clearTimeout(timer);
      resolve(img);
    };
    img.onerror = () => {
      clearTimeout(timer);
      reject(new Error("Erro ao carregar imagem"));
    };
    img.src = src;
  });
};

const renderCardToCanvas = async (data: IDCardData, side: 'FRONT' | 'BACK'): Promise<HTMLCanvasElement> => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { alpha: false });
  const width = 1080;
  const height = 1528;
  canvas.width = width;
  canvas.height = height;

  if (!ctx) throw new Error("Canvas context error");

  const themes = {
    clean: { bg: '#E9EAEC', accent: '#A3A5A0', text: '#1e293b', footer: '#A4A7A1', nameBg: '#f0f1f3', categoryText: '#64748b' },
    black: { bg: '#0a0a0a', accent: '#333333', text: '#ffffff', footer: '#000000', nameBg: '#1a1a1a', categoryText: '#a1a1aa' },
    metal: { bg: '#52525b', accent: '#27272a', text: '#ffffff', footer: '#18181b', nameBg: '#27272a', categoryText: '#d4d4d8' },
    rubro: { bg: '#450a0a', accent: '#991b1b', text: '#ffffff', footer: '#1a0000', nameBg: '#310505', categoryText: '#fecaca' }
  };
  const theme = themes[data.visualTheme || 'clean'];

  // 1. Fundo Base
  ctx.fillStyle = theme.bg;
  ctx.fillRect(0, 0, width, height);

  if (side === 'FRONT') {
    // 2. Elementos de Estrutura (Desenhados primeiro para ficarem atrás do texto)
    // Barra de Topo
    ctx.fillStyle = theme.accent;
    ctx.fillRect(0, 0, width, 90);

    // Rodapé (Pintado antes dos textos para não cobri-los)
    ctx.fillStyle = theme.footer;
    ctx.fillRect(0, height - 220, width, 220);

    // 3. Logos
    const logoSize = 300;
    const gap = 80;
    const startX = (width - (logoSize * 2 + gap)) / 2;

    if (data.brandLogoUrl) {
      try {
        const logo1 = await loadImage(data.brandLogoUrl);
        ctx.drawImage(logo1, startX, 130, logoSize, logoSize);
      } catch (e) { console.warn("Logo1 skip"); }
    }
    
    if (data.secondaryLogoUrl) {
      try {
        const logo2 = await loadImage(data.secondaryLogoUrl);
        ctx.drawImage(logo2, startX + logoSize + gap, 130, logoSize, logoSize);
      } catch (e) { console.warn("Logo2 skip"); }
    }

    // 4. Título Principal
    ctx.fillStyle = theme.text;
    ctx.textAlign = 'center';
    ctx.font = '900 100px sans-serif';
    ctx.fillText("POLÍCIA PENAL", width / 2, 530);

    // Linhas decorativas
    ctx.fillStyle = '#e11d48';
    ctx.fillRect(width / 2 - 250, 560, 180, 10);
    ctx.fillRect(width / 2 + 70, 560, 180, 10);

    // 5. Foto do Policial
    const photoW = 460;
    const photoH = 580;
    const photoX = (width - photoW) / 2;
    const photoY = 620;
    
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(photoX - 15, photoY - 15, photoW + 30, photoH + 30);

    if (data.photoUrl) {
      try {
        const photo = await loadImage(data.photoUrl);
        ctx.drawImage(photo, photoX, photoY, photoW, photoH);
      } catch (e) { 
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(photoX, photoY, photoW, photoH);
      }
    }

    // 6. Categoria e Nome (Conteúdo Vital)
    // Categoria
    ctx.fillStyle = theme.categoryText;
    ctx.font = '900 42px sans-serif';
    ctx.fillText(data.category || "TITULAR", width / 2, 1260);

    // Box do Nome
    ctx.fillStyle = theme.nameBg;
    const nameBoxY = 1290;
    roundRect(ctx, (width - 940) / 2, nameBoxY, 940, 160, 40, true);
    
    ctx.fillStyle = theme.text;
    const name = data.fullName || "SERVIDOR ASSPRIJUF";
    const fontSize = name.length > 25 ? 50 : 70;
    ctx.font = `900 ${fontSize}px sans-serif`;
    ctx.fillText(name.toUpperCase(), width / 2, nameBoxY + 100);

    // Texto do Rodapé (Sobre o retângulo do rodapé)
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 130px sans-serif';
    ctx.fillText("ASSPRIJUF", width / 2, height - 60);

  } else {
    // VERSO
    ctx.fillStyle = theme.accent;
    ctx.fillRect(0, 0, 40, height);
    
    if (data.brandLogoUrl && data.secondaryLogoUrl) {
      try {
        const logo1 = await loadImage(data.brandLogoUrl);
        const logo2 = await loadImage(data.secondaryLogoUrl);
        ctx.drawImage(logo1, 90, 60, 110, 110);
        ctx.drawImage(logo2, 210, 60, 110, 110);
      } catch (e) {}
    }

    ctx.fillStyle = theme.text;
    ctx.textAlign = 'left';
    ctx.font = '900 55px sans-serif';
    ctx.fillText("DADOS FUNCIONAIS", 340, 140);
    ctx.fillStyle = '#e11d48';
    ctx.fillRect(325, 90, 10, 70);

    const drawData = (label: string, value: string, y: number, x = 130, w = 820) => {
      ctx.fillStyle = '#64748b';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText(label.toUpperCase(), x, y);
      ctx.fillStyle = theme.text;
      ctx.font = '900 38px sans-serif';
      ctx.fillText(value || '---', x, y + 45);
      ctx.strokeStyle = '#f1f5f9';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x, y + 70);
      ctx.lineTo(x + w, y + 70);
      ctx.stroke();
    };

    drawData("MASP", data.masp, 260);
    drawData("Matrícula", data.registration, 390, 130, 390);
    drawData("CPF", data.cpf, 390, 560, 390);
    drawData("Identidade (RG)", data.identity, 520, 130, 390);
    drawData("Sanguíneo", data.bloodType, 520, 560, 390);
    drawData("Nascimento", data.birthDate, 650, 130, 390);
    drawData("Validade", data.expiryDate, 650, 560, 390);

    // QR Code Box Placeholder (Apenas visual, o QR é gerado no PDF em alta se necessário, 
    // ou mantemos o espaço para consistência)
    ctx.fillStyle = '#f8fafc';
    roundRect(ctx, (width - 400) / 2, 850, 400, 400, 50, true);

    ctx.fillStyle = theme.text;
    ctx.textAlign = 'center';
    ctx.font = '900 45px sans-serif';
    ctx.fillText("VALIDAÇÃO DIGITAL", width / 2, 1350);
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText("ASSPRIJUF - JUIZ DE FORA", width / 2, 1430);
  }
  return canvas;
};

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number, fill: boolean) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  if (fill) ctx.fill();
  else ctx.stroke();
}

export const exportToPDF = async (data: IDCardData, mode: 'FULL' | 'CLONE', filename: string) => {
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  try {
    const canvasFront = await renderCardToCanvas(data, 'FRONT');
    const canvasBack = await renderCardToCanvas(data, 'BACK');
    const imgFront = canvasFront.toDataURL('image/jpeg', 0.95);
    const imgBack = canvasBack.toDataURL('image/jpeg', 0.95);
    
    if (mode === 'FULL') {
      pdf.addImage(imgFront, 'JPEG', 0, 0, 210, 297);
      pdf.addPage();
      pdf.addImage(imgBack, 'JPEG', 0, 0, 210, 297);
    } else {
      const w = 92;
      const h = (w * 1528) / 1080;
      const marginY = (297 - h) / 2;
      pdf.addImage(imgFront, 'JPEG', 10, marginY, w, h);
      pdf.addImage(imgBack, 'JPEG', 108, marginY, w, h);
    }
    pdf.save(`${filename}.pdf`);
  } catch (err) {
    console.error(err);
    alert("Erro na exportação para PDF.");
  }
};

export const exportToImages = async (data: IDCardData, filename: string) => {
  try {
    const canvasFront = await renderCardToCanvas(data, 'FRONT');
    const canvasBack = await renderCardToCanvas(data, 'BACK');
    
    const download = (canvas: HTMLCanvasElement, suffix: string) => {
      const link = document.createElement('a');
      link.download = `${filename}_${suffix}.jpg`;
      link.href = canvas.toDataURL('image/jpeg', 0.95);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
    
    download(canvasFront, 'FRENTE');
    setTimeout(() => download(canvasBack, 'VERSO'), 400);
  } catch (err) {
    console.error(err);
    alert("Erro na geração de imagens.");
  }
};

export const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const max = 1200;
        let w = img.width, h = img.height;
        if (w > h && w > max) { h *= max/w; w = max; }
        else if (h > max) { w *= max/h; h = max; }
        canvas.width = w; canvas.height = h;
        ctx?.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
};
