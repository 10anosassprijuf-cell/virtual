/**
 * SISTEMA DE CARTEIRINHA VIRTUAL - POLÍCIA PENAL
 * 
 * Este arquivo (code.gs) deve ser colado no editor do Google Apps Script.
 * Certifique-se de que sua planilha tenha uma aba chamada 'Dados'.
 */

function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('Carteirinha Virtual - Polícia Penal')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/**
 * Salva ou atualiza os dados do servidor na planilha.
 */
function saveDataToSheet(cardData) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName('Dados');
    
    // Cria a aba e o cabeçalho se não existirem
    if (!sheet) {
      sheet = ss.insertSheet('Dados');
      sheet.appendRow([
        'ID', 'Nome Completo', 'MASP', 'Tipo Sanguineo', 'Matricula', 
        'CPF', 'Identidade', 'Data Nascimento', 'Data Validade', 
        'Codificacao', 'Tema', 'URL Foto', 'URL Logo'
      ]);
    }
    
    const data = sheet.getDataRange().getValues();
    const masp = cardData.masp ? cardData.masp.toString().trim() : "";
    
    if (!masp) throw new Error("MASP é obrigatório para salvar.");

    let rowIndex = -1;
    
    // Procura se o MASP já existe para atualizar em vez de duplicar
    for (let i = 1; i < data.length; i++) {
      if (data[i][2] && data[i][2].toString().trim() === masp) {
        rowIndex = i + 1;
        break;
      }
    }
    
    const rowValues = [
      cardData.id || Utilities.getUuid(),
      cardData.fullName || "",
      masp,
      cardData.bloodType || "",
      cardData.registration || "",
      cardData.cpf || "",
      cardData.identity || "",
      cardData.birthDate || "",
      cardData.expiryDate || "",
      cardData.code || "",
      cardData.visualTheme || "clean",
      cardData.photoUrl || "",
      cardData.brandLogoUrl || ""
    ];
    
    if (rowIndex > -1) {
      sheet.getRange(rowIndex, 1, 1, rowValues.length).setValues([rowValues]);
    } else {
      sheet.appendRow(rowValues);
    }
    
    return { success: true };
  } catch (e) {
    console.error("Erro ao salvar: " + e.toString());
    throw new Error(e.toString());
  }
}

/**
 * Busca dados pelo MASP.
 */
function getDataFromSheet(masp) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Dados');
    if (!sheet) return null;
    
    const data = sheet.getDataRange().getValues();
    const searchMasp = masp.toString().trim();
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][2] && data[i][2].toString().trim() === searchMasp) {
        const row = data[i];
        return {
          id: row[0],
          fullName: row[1],
          masp: row[2],
          bloodType: row[3],
          registration: row[4],
          cpf: row[5],
          identity: row[6],
          birthDate: row[7],
          expiryDate: row[8],
          code: row[9],
          visualTheme: row[11],
          photoUrl: row[12],
          brandLogoUrl: row[13]
        };
      }
    }
    return null;
  } catch (e) {
    console.error("Erro ao buscar: " + e.toString());
    throw new Error(e.toString());
  }
}