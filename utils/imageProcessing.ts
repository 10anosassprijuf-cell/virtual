
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * Compresses an image if it exceeds the size limit.
 */
export const compressImage = (file: File, maxSizeMB: number = 4): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Simple heuristic: if larger than 2000px, scale down to maintain quality while reducing size
        const MAX_DIM = 1200;
        if (width > height) {
          if (width > MAX_DIM) {
            height *= MAX_DIM / width;
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width *= MAX_DIM / height;
            height = MAX_DIM;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Quality adjusted to 0.6 for better compression as requested
        const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

/**
 * Generates a PDF from a list of HTML elements representing the card sides.
 */
export const exportToPDF = async (elementIds: string[], filename: string) => {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'px',
    format: [1080, 1920]
  });

  for (let i = 0; i < elementIds.length; i++) {
    const element = document.getElementById(elementIds[i]);
    if (element) {
      const canvas = await html2canvas(element, {
        scale: 2, // High resolution
        useCORS: true,
        allowTaint: true,
        backgroundColor: null
      });
      const imgData = canvas.toDataURL('image/png');
      
      if (i > 0) pdf.addPage([1080, 1920], 'portrait');
      pdf.addImage(imgData, 'PNG', 0, 0, 1080, 1920);
    }
  }

  pdf.save(`${filename}.pdf`);
};
