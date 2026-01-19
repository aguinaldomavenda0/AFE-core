import { log } from 'console';
import crypto from 'crypto';
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import axios from 'axios';

/**
 * Gera assinatura JWS usando RS256
 * @param {object} payload - Dados a assinar
 * @param {string} privateKey - Chave privada em formato PEM
 * @returns {string} Token JWS assinado
 */
function gerarAssinaturaJWS(payload, privateKey) {
  const header = {
    typ: 'JWT',
    alg: 'RS256'
  };

  const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');

  const signatureInput = `${encodedHeader}.${encodedPayload}`;

  const sign = crypto.createSign('RSA-SHA256');
  sign.update(signatureInput);
  sign.end();

  const signature = sign.sign(privateKey, 'base64url');

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}


/**
 * Devolve a chave privada do software a partir do ficheiro definido na variável de ambiente
 * @returns {string} Chave privada no formato PEM
 */
function getPrivateKey() {
  const projectRoot = process.cwd(); // raiz do projeto
  const filePath = path.join(projectRoot, process.env.PRIVATE_KEY_PATH);
  console.log(projectRoot);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Ficheiro não encontrado: ${filePath}`);
  }

  return fs.readFileSync(filePath, 'utf8');
}

/**
 * Devolve a chave pública do software a partir do ficheiro definido na variável de ambiente
 * @returns {string} Chave pública no formato PEM
 */
function getPublicKey() {
  const projectRoot = process.cwd(); // raiz do projeto
  const filePath = path.join(projectRoot, process.env.PUBLIC_KEY_PATH);
  console.log(projectRoot);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Ficheiro não encontrado: ${filePath}`);
  }

  return fs.readFileSync(filePath, 'utf8');
}

/**
 * Gera UUID versão 4 (aleatório)
 * @returns {string} UUID no formato padrão
 */
export function gerarUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export function getJWTSignatureSeries(taxRegistrationNumber, establishmentNumber, seriesYear, documentType) {
  const payload = {
    taxRegistrationNumber,
    establishmentNumber,
    seriesYear,
    documentType
  };
  const privateKey = getPrivateKey();
  return gerarAssinaturaJWS(payload, privateKey);
}

/**
 * Gera o objeto de informações do software, baseando-se nas variáveis de ambiente
 * Retorna também a assinatura JWS dessas informações
 * @returns 
 */
export function getSoftwareInfo() {
  let softwareInfoDetailJson = {
    productId: process.env.PRODUCT_ID,
    productVersion: process.env.PRODUCT_VERSION,
    softwareValidationNumber: process.env.SOFTWARE_VALIDATION_NUMBER,
    signatureVersion: process.env.SIGNATURE_VERSION
  };
  softwareInfoDetailJson = {
    productId: "Meu ERP CERTO",
    productVersion: "1.0.1",
    softwareValidationNumber: "C_134"
  }
  return {
    softwareInfoDetail: softwareInfoDetailJson,
    //jwsSoftwareSignature: gerarAssinaturaJWS(softwareInfoDetailJson, getPrivateKey())
    jwsSoftwareSignature: "eyJ0eXAiOiJKT1NFIiwiYWxnIjoiUlMyNTYifQ.eyJwcm9kdWN0SWQiOiJNZXUgRVJQIENFUlRPIiwicHJvZHVjdFZlcnNpb24iOiIxLjAuMSIsInNvZnR3YXJlVmFsaWRhdGlvbk51bWJlciI6IkNfMTM0In0.VE3zkvOJOpqBfz4wpx4KCgcwOGgzGUP3MSMbaHCDnHhwOaeA6jlccBW9HjgQvg2tYCVVq0imrU_z0grEHNthhG4xD3afSOD1_RzvHs8Tc45dvztHJzB4gF0CAX-yIDwi7XcHiMRY0vkXOETBeHKewg0ktWSnZ7SLf4GxGzE7ry2u_pmhqhCPhxpa0oGQ_rBJUYkEAFg1OwaqjwvzCFgdT11r-XsHmnkcfJX_ktj59RWR_zgbytiCRtwCK9LNUflveS5GzUaCXbPn2deQ3F2hPldLECEa_ahwoapoK1LhkgOAVyPLJf6M1Cm09Le7rkdSaWQSW5BI_sPx5YaUaXkeqg"
  };

}

/** 
 * Retorna a versão do schema a ser utilizada definida na variável de ambiente
 * @returns {string} Versão do schema
 */
export function getSchemaVersion() {
  return process.env.SCHEMA_VERSION;
}

/** 
 * Gera o timestamp para a submissão da data actual no formato ISO 8601
 * @returns {string} Timestamp da submissão
 */
export function getsubmissionTimeStamp() {
  return new Date().toISOString();
}
/** 
 * Gera o timestamp para a submissão da data actual no formato ISO 8601
 * @returns {string} Timestamp da submissão
 */
export function getHeaderRequest(headerTypeCompany = 'HML') {
  const headers = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${Buffer.from(`${headerTypeCompany === 'GME' ? process.env.HML_USER_GME : process.env.HML_USER}:${headerTypeCompany === 'GME' ? process.env.HML_PASS_GME : process.env.HML_PASS}`
      ).toString('base64')}`
    },
    auth: {
      username: headerTypeCompany === 'GME' ? process.env.HML_USER_GME : process.env.HML_USER,
      password: headerTypeCompany === 'GME' ? process.env.HML_PASS_GME : process.env.HML_PASS
    },

  }

  console.log(headers);

  return headers;
}


export function getJwsSignature(taxRegistrationNumber, invoiceNo) {

  const payload = {
    taxRegistrationNumber,
    invoiceNo
  };
  const privateKey = getPrivateKey();
  return gerarAssinaturaJWS(payload, privateKey);

}

export function getJwsDocumentSignature(taxRegistrationNumber, invoiceNo, documentType, documentDate, customerTaxID, customerCountry, companyName, documentTotals) {

  const payload = {
    taxRegistrationNumber,
    invoiceNo,
    documentType,
    documentDate,
    customerTaxID,
    customerCountry,
    companyName,
    documentTotals
  };
  const privateKey = getPrivateKey();
  return gerarAssinaturaJWS(payload, privateKey);

}

export async function requestServerAGT(endpoint, payload) {
  const headers = getHeaderRequest();
  const resp = await axios.post(endpoint, payload, headers);
  return resp.data;
}

export function getDetailsLines(linesDocument = []) {
  if (linesDocument.length == 0) {
    return [];
  }
  const lines = [];
  let totalDocument = 0;
  let totalDocumentTaxes = 0;
  let cc = 0;
  for (const line of linesDocument) {

    totalDocument += line.creditAmount;
    
    lines.push({
      lineNumber: cc + 1,
      productCode: line.productCode,
      productDescription: line.productDescription,
      quantity: line.quantity,
      unitOfMeasure: line.unitOfMeasure,
      unitPrice: line.unitPrice,
      unitPriceBase: line.unitPriceBase,
      debitAmount: line.debitAmount,
      creditAmount: line.creditAmount,
      taxes: line.taxes,
      settlementAmount: line.settlementAmount
    });
    if (line.taxes.taxContribution) {
      totalDocumentTaxes += line.taxes.taxContribution;
    }
  }

  return {
    lines: lines,
    documentTotals: {
      netTotal: totalDocument,
      taxPayable: totalDocumentTaxes,
      grossTotal: totalDocument + totalDocumentTaxes
    }
  };
}

export function getPayloadDocument(
  taxRegistrationNumber,
  documentNo,
  documentType = "FT", 
  customerTaxID,
  customerCountry = "AO",
  companyName,
  lines, 
  documentTotals, 
  documentDate,
  documentStatus = "N", withholdingTaxList = [], paymentReceipt = [],
  eacCode=12345
) {

  if (withholdingTaxList.length == 0) {
    withholdingTaxList = [];
  }
  if(!documentDate){
    documentDate = new Date().toISOString().split('T')[0];
  }
  if(lines || lines.length !==0){
    lines = getDetailsLines(lines);
  }
  const systemEntryDate = new Date().toISOString();
  const payload = {
    documentNo,
    documentStatus,
    jwsDocumentSignature: getJwsDocumentSignature(taxRegistrationNumber, documentNo, documentType, documentDate, customerTaxID, customerCountry, companyName, documentTotals),
    documentDate,
    documentType,
    eacCode,
    systemEntryDate,
    customerTaxID,
    customerCountry,
    companyName,
    ...lines,
    withholdingTaxList,
  }
  /**
   * const documentsJSon = `{"documents": [
        {
            "documentNo": "FT FT6325S2C/10006",
            "documentStatus": "N",
            "jwsDocumentSignature": "eyJ0eXAiOiJKT1NFIiwiYWxnIjoiUlMyNTYifQ.eyJkb2N1bWVudE5vIjoiRlQgRlQ2MzI1UzJDLzEwMDA2IiwidGF4UmVnaXN0cmF0aW9uTnVtYmVyIjoiNTAwMTYzNjg2MyIsImRvY3VtZW50VHlwZSI6IkZUIiwiZG9jdW1lbnREYXRlIjoiMjAyNS0xMS0wNCIsImN1c3RvbWVyVGF4SUQiOiJQVDk4NzY1NDMyMSIsImN1c3RvbWVyQ291bnRyeSI6IlBUIiwiY29tcGFueU5hbWUiOiJDbGllbnRlIEV4ZW1wbG8gTGRhIn0.Sg0jnyksnnXtXUkf5PaoZrRtf3kiNkw3urFaE2D1fHLLLw_hQWc896-cGbRVnJGRHPrcnOnEQqQ-ws5R51erzadVstr9Q1yUd0CIvUhszGO15t6m0H--O9VtNMWEOp2asP4P80LD4m55y5rX2stCCGAmTI2N1cAWAhw1JbRr2Zb378y8ZI8dicfJm1QDzs5YKmXrRqXH9yvaF62SHXXfpv5gzLRAAbRwjvY7roso_PRuue9Ke1w0hojnpBmr_zUg0D3eBa-eUjtVPMQsbl5DXBFhr4Qydr4Q04tvUqLBAeGpQmxTRZGs2OCjQzdz2tYIZSbEiFR9Zo6EwL1s1tsRnA",
            "documentDate": "2025-11-04",
            "documentType": "FT",
            "eacCode": "12345",
            "systemEntryDate": "2025-11-04T11:15:30Z",
            "customerTaxID": "PT987654321",
            "customerCountry": "PT",
            "companyName": "Cliente Exemplo Lda",
            "lines": [
                {
                    "lineNumber": 1,
                    "productCode": "PROD001",
                    "productDescription": "Produto Exemplo 1",
                    "quantity": 2,
                    "unitOfMeasure": "UN",
                    "unitPrice": 250,
                    "unitPriceBase": 250,
                    "debitAmount": 0,
                    "creditAmount": 500,
                    "taxes": [
                        {
                            "taxType": "IVA",
                            "taxCountryRegion": "AO",
                            "taxCode": "NOR",
                            "taxPercentage": 14,
                            "taxContribution": 70
                        }
                    ],
                    "settlementAmount": 0
                }
            ],
            "documentTotals": {
                "taxPayable": 70,
                "netTotal": 500,
                "grossTotal": 570
            },
            "withholdingTaxList": [
                {
                    "withholdingTaxType": "IRT",
                    "withholdingTaxDescription": "Retenção na fonte",
                    "withholdingTaxAmount": 16.5
                }
            ]
        }
    ]}`;
   */


  return payload;
}



export function getTaxList(listTax = []) {
  if (listTax.length > 0) {
    return [];
  }

  const taxes = {

    IRT: {
      withholdingTaxType: "IRT",
      withholdingTaxDescription: "Retenção na fonte"
    },
    II: {
      withholdingTaxType: "II",
      withholdingTaxDescription: "Imposto Industrial"
    },
    IS: {
      taxType: "IS",
      taxCountryRegion: "Imposto de Selo",
    },
    IVA: {
      taxType: "IVA",
      taxCountryRegion: "Imposto s/ o Valor Acrescentado",
    }
    ,
    IVA: {
      taxType: "IVA",
      taxCountryRegion: "Imposto s/ o Valor Acrescentado",
    },
    IP: {
      taxType: "IP",
      taxCountryRegion: "Imposto Predial",
    },
    IAC: {
      taxType: "IAC",
      taxCountryRegion: "Imposto sobre Aplicação de Capitais",
    },
    OU: {
      taxType: "OU",
      taxCountryRegion: "Outros",
    },
    IRPC: {
      taxType: "IRPC",
      taxCountryRegion: "Imposto s/ rendimento de pessoas colectivas",
    },
    IRPS: {
      taxType: "IRPS",
      taxCountryRegion: "Imposto s/ rendimento de pessoas singulares",
    }
  };

  for (const tax of listTax) {
    taxes.push({

      ...taxes[tax.taxType],
      withholdingTaxAmount: tax.ammount,

    });
  }

  return taxes;
}