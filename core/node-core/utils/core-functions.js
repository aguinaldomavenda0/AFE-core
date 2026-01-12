import {getJwsSignature,  gerarUUID, getSoftwareInfo, getsubmissionTimeStamp, getSchemaVersion, getJWTSignatureSeries, getHeaderRequest } from './utils.js';
import axios from 'axios';
import 'dotenv/config';


export async function getNIFinformation(nif, typeDocument) {
    let url;
    if (process.env.IS_PRODUCTION === 'true') {
        url = process.env.PROD_GET_NIF ||
            'https://sifp.minfin.gov.ao/sigt/contribuinte/consultarNIF/v5/obter';
    }
    else {
        url = process.env.HML_GET_NIF ||
            'https://sifphml.minfin.gov.ao/sigt/contribuinte/v5/obter';
    }
    const header = getHeaderRequest();

    const params = {
        tipoDocumento: typeDocument || 'NIF',
        numeroDocumento: nif || '5412345678'
    };

    try {
        const response = await axios.get(url, { headers: header.headers, auth: header.auth, params });

        return {
            status: 'success',
            message: 'Sucesso ao obter informações do NIF',
            data: response.data
        };

    } catch (error) {
        console.error('Erro ao obter informações do NIF:', error.response?.data || error.message);

        return {
            status: 'error',
            message: 'Erro ao obter informações do NIF',
            data: error.response?.data || error.message
        };
    }
}
  
/**
 * Função para gerar o payload de consulta de séries
 * @param {Int} taxRegistrationNumber Número fiscal de contribuinte do cliente
 * @param {Int} establishmentNumber Número do estabelecimento
 * @param {String} seriesYear Ano da série
 * @param {String} seriesCode Código da série
 * @param {String} documentType Tipo de documento
 * @param {String} statusSeries Status da série (opcional, default "A")
 * @returns {Object} Payload para consulta de série
 */
export function getPayLoadLisSeries(taxRegistrationNumber, establishmentNumber, seriesYear, seriesCode, documentType, statusSeries="A") {
  /**
   * Generates payload for series list
   * 
   * {
    "schemaVersion": "string",
    "taxRegistrationNumber": "5001636863",
    "submissionTimeStamp": "2025-10-28T18:51:10.178Z",
    "seriesCode": "LD6325S1N",
    "seriesYear": "2025",
    "seriesStatus": "A",
    "documentType": "LD",
    "establishmentNumber": 10,
    "jwsSignature": "string",
    "softwareInfo": {
        "softwareInfoDetail": {
                "productId": "Meu ERP CERTO",
                "productVersion": "1.0.1",
                "softwareValidationNumber": "C_134"
            },
            "jwsSoftwareSignature": "eyJ0eXAiOiJKT1NFIiwiYWxnIjoiUlMyNTYifQ.eyJwcm9kdWN0SWQiOiJNZXUgRVJQIENFUlRPIiwicHJvZHVjdFZlcnNpb24iOiIxLjAuMSIsInNvZnR3YXJlVmFsaWRhdGlvbk51bWJlciI6IkNfMTM0In0.VE3zkvOJOpqBfz4wpx4KCgcwOGgzGUP3MSMbaHCDnHhwOaeA6jlccBW9HjgQvg2tYCVVq0imrU_z0grEHNthhG4xD3afSOD1_RzvHs8Tc45dvztHJzB4gF0CAX-yIDwi7XcHiMRY0vkXOETBeHKewg0ktWSnZ7SLf4GxGzE7ry2u_pmhqhCPhxpa0oGQ_rBJUYkEAFg1OwaqjwvzCFgdT11r-XsHmnkcfJX_ktj59RWR_zgbytiCRtwCK9LNUflveS5GzUaCXbPn2deQ3F2hPldLECEa_ahwoapoK1LhkgOAVyPLJf6M1Cm09Le7rkdSaWQSW5BI_sPx5YaUaXkeqg"
    }
  }
   */
  if(!taxRegistrationNumber) { throw new Error("Tax Registration Number is required"); }
  if(!establishmentNumber) { throw new Error("Establishment Number is required"); }
  if(!seriesYear) { throw new Error("Series Year is required"); }
  if(!seriesCode) { throw new Error("Series Code is required"); }
  if(!documentType) { throw new Error("Document Type is required"); }
  if(!statusSeries) { throw new Error("Status Series is required"); }
    return {
        schemaVersion: getSchemaVersion(),
        submissionUUID: gerarUUID(),
        taxRegistrationNumber: taxRegistrationNumber,
        submissionTimeStamp: getsubmissionTimeStamp(),
        seriesCode: seriesCode,
        seriesYear: seriesYear,
        seriesStatus: statusSeries,
        documentType: documentType,
        establishmentNumber: establishmentNumber,
        jwsSignature: getJWTSignatureSeries(taxRegistrationNumber, establishmentNumber, seriesYear, documentType),
        softwareInfo: getSoftwareInfo()
    };
}


/**
 * Função para gerar o payload de criação de séries
 * @param {Int} taxRegistrationNumber Número fiscal de contribuinte do cliente
 * @param {Int} establishmentNumber Número do estabelecimento
 * @param {String} seriesYear Ano da série
 * @param {String} documentType Tipo de documento
 * @returns {Object} Payload para criação de série
 */
export function getPayLoadCreateSeries(taxRegistrationNumber, establishmentNumber, seriesYear, documentType) {
  /**
   * Generates payload for series creation
   * {
    "schemaVersion": "1.2",
    "submissionUUID": "a1b2c3d4-e5f6-7890-g1h2-i238j234k5122",
    "taxRegistrationNumber": "5001636863",
    "submissionTimeStamp": "2025-09-02T14:30:00Z",
    "softwareInfo": {
        "softwareInfoDetail": {
            "productId": "Meu ERP CERTO",
            "productVersion": "1.0.1",
            "softwareValidationNumber": "C_134"
        },
        "jwsSoftwareSignature": "eyJ0eXAiOiJKT1NFIiwiYWxnIjoiUlMyNTYifQ.eyJwcm9kdWN0SWQiOiJNZXUgRVJQIENFUlRPIiwicHJvZHVjdFZlcnNpb24iOiIxLjAuMSIsInNvZnR3YXJlVmFsaWRhdGlvbk51bWJlciI6IkNfMTM0In0.VE3zkvOJOpqBfz4wpx4KCgcwOGgzGUP3MSMbaHCDnHhwOaeA6jlccBW9HjgQvg2tYCVVq0imrU_z0grEHNthhG4xD3afSOD1_RzvHs8Tc45dvztHJzB4gF0CAX-yIDwi7XcHiMRY0vkXOETBeHKewg0ktWSnZ7SLf4GxGzE7ry2u_pmhqhCPhxpa0oGQ_rBJUYkEAFg1OwaqjwvzCFgdT11r-XsHmnkcfJX_ktj59RWR_zgbytiCRtwCK9LNUflveS5GzUaCXbPn2deQ3F2hPldLECEa_ahwoapoK1LhkgOAVyPLJf6M1Cm09Le7rkdSaWQSW5BI_sPx5YaUaXkeqg"
    },
    "seriesYear": "2025",
    "documentType": "LD",
    "establishmentNumber": "10",
    "jwsSignature": "string",
    "seriesContingencyIndicator": "N"
  }
   */
  if(!taxRegistrationNumber) { throw new Error("Tax Registration Number is required"); }
  if(!establishmentNumber) { throw new Error("Establishment Number is required"); }
  if(!seriesYear) { throw new Error("Series Year is required"); } 
  if(!documentType) { throw new Error("Document Type is required"); } 
    return {
        schemaVersion: getSchemaVersion(),
        submissionUUID: gerarUUID(),
        taxRegistrationNumber: taxRegistrationNumber,
        submissionTimeStamp: getsubmissionTimeStamp(),
        softwareInfo: getSoftwareInfo(),
        seriesYear: seriesYear,
        documentType: documentType,
        establishmentNumber: establishmentNumber,
        jwsSignature: getJWTSignatureSeries(taxRegistrationNumber, establishmentNumber, seriesYear, documentType),
    };
}
 

/**
 * Função para gerar o payload de status de fatura
 * @param {Int} taxRegistrationNumber Número fiscal de contribuinte do cliente
 * @param {String} requestID ID da requisição
 * @returns {Object} Payload para status de fatura
 */
export function getPayloadStatusInvoice(taxRegistrationNumber, requestID) {
  /**
   * {
    "schemaVersion": "1.2",
    "submissionUUID": "a1b2c3d4-e5f6-7890-g1h2-i238j234k5122",
    "taxRegistrationNumber": "5001636863",
    "submissionTimeStamp": "2025-09-02T14:30:00Z",
    "softwareInfo": {
        "softwareInfoDetail": {
            "productId": "Meu ERP CERTO",
            "productVersion": "1.0.1",
            "softwareValidationNumber": "C_134"
        },
        "jwsSoftwareSignature": "eyJ0eXAiOiJKT1NFIiwiYWxnIjoiUlMyNTYifQ.eyJwcm9kdWN0SWQiOiJNZXUgRVJQIENFUlRPIiwicHJvZHVjdFZlcnNpb24iOiIxLjAuMSIsInNvZnR3YXJlVmFsaWRhdGlvbk51bWJlciI6IkNfMTM0In0.VE3zkvOJOpqBfz4wpx4KCgcwOGgzGUP3MSMbaHCDnHhwOaeA6jlccBW9HjgQvg2tYCVVq0imrU_z0grEHNthhG4xD3afSOD1_RzvHs8Tc45dvztHJzB4gF0CAX-yIDwi7XcHiMRY0vkXOETBeHKewg0ktWSnZ7SLf4GxGzE7ry2u_pmhqhCPhxpa0oGQ_rBJUYkEAFg1OwaqjwvzCFgdT11r-XsHmnkcfJX_ktj59RWR_zgbytiCRtwCK9LNUflveS5GzUaCXbPn2deQ3F2hPldLECEa_ahwoapoK1LhkgOAVyPLJf6M1Cm09Le7rkdSaWQSW5BI_sPx5YaUaXkeqg"
    },
    "requestID": "202500000000118"
    }
   */
  return {
      schemaVersion: getSchemaVersion(),
      submissionUUID: gerarUUID(),
      taxRegistrationNumber: taxRegistrationNumber,
      submissionTimeStamp: getsubmissionTimeStamp(),
      softwareInfo: getSoftwareInfo(),
      requestID: requestID, 
  };
}

 
/**
 * Função para gerar o payload de status de fatura
 * @param {Int} taxRegistrationNumber Número fiscal de contribuinte do cliente
 * @param {String} requestID ID da requisição
 * @returns {Object} Payload para status de fatura
 */
export function getPayloadConsultInvoice(taxRegistrationNumber, invoiceNo) {
  /**
   * {
    "schemaVersion": "1.2",
    "submissionUUID": "a1b2c3d4-e5f6-7890-g1h2-i238j234k5122",
    "taxRegistrationNumber": "5001636863",
    "submissionTimeStamp": "2025-09-02T14:30:00Z",
    "softwareInfo": {
        "softwareInfoDetail": {
            "productId": "Meu ERP CERTO",
            "productVersion": "1.0.1",
            "softwareValidationNumber": "C_134"
        },
        "jwsSoftwareSignature": "eyJ0eXAiOiJKT1NFIiwiYWxnIjoiUlMyNTYifQ.eyJwcm9kdWN0SWQiOiJNZXUgRVJQIENFUlRPIiwicHJvZHVjdFZlcnNpb24iOiIxLjAuMSIsInNvZnR3YXJlVmFsaWRhdGlvbk51bWJlciI6IkNfMTM0In0.VE3zkvOJOpqBfz4wpx4KCgcwOGgzGUP3MSMbaHCDnHhwOaeA6jlccBW9HjgQvg2tYCVVq0imrU_z0grEHNthhG4xD3afSOD1_RzvHs8Tc45dvztHJzB4gF0CAX-yIDwi7XcHiMRY0vkXOETBeHKewg0ktWSnZ7SLf4GxGzE7ry2u_pmhqhCPhxpa0oGQ_rBJUYkEAFg1OwaqjwvzCFgdT11r-XsHmnkcfJX_ktj59RWR_zgbytiCRtwCK9LNUflveS5GzUaCXbPn2deQ3F2hPldLECEa_ahwoapoK1LhkgOAVyPLJf6M1Cm09Le7rkdSaWQSW5BI_sPx5YaUaXkeqg"
    },
    "jwsSignature": "string",
    "invoiceNo": "FT FT6325S2C/1000020"
    }
   */
  return {
      schemaVersion: getSchemaVersion(),
      submissionUUID: gerarUUID(),
      taxRegistrationNumber: taxRegistrationNumber,
      submissionTimeStamp: getsubmissionTimeStamp(),
      softwareInfo: getSoftwareInfo(),
      jwsSignature: getJwsSignature(taxRegistrationNumber, invoiceNo),
      invoiceNo: invoiceNo
  };
}

 
/**
 * Função para gerar o payload de status de fatura
 * @param {Int} taxRegistrationNumber Número fiscal de contribuinte do cliente
 * @param {String} requestID ID da requisição
 * @param {String} deductibleVATPercentage Percentagem de IVA dedutível
 * @param {String} nonDeductibleAmount Valor não dedutível
 * @param {String} action Ação a ser executada (C - Confirmar, R - Rejeitar)
 * @returns {Object} Payload para status de fatura
 */
export function getPayloadValidateInvoice(taxRegistrationNumber, invoiceNo, deductibleVATPercentage, nonDeductibleAmount, action) {
  /**
   * {
    "schemaVersion": "1.2",
    "submissionTimeStamp": "2025-10-28T18:51:10.178Z",
    "taxRegistrationNumber": "5001636863",
    "softwareInfo": {
    "softwareInfoDetail": {
            "productId": "Meu ERP CERTO",
            "productVersion": "1.0.1",
            "softwareValidationNumber": "C_134"
        },
        "jwsSoftwareSignature": "eyJ0eXAiOiJKT1NFIiwiYWxnIjoiUlMyNTYifQ.eyJwcm9kdWN0SWQiOiJNZXUgRVJQIENFUlRPIiwicHJvZHVjdFZlcnNpb24iOiIxLjAuMSIsInNvZnR3YXJlVmFsaWRhdGlvbk51bWJlciI6IkNfMTM0In0.VE3zkvOJOpqBfz4wpx4KCgcwOGgzGUP3MSMbaHCDnHhwOaeA6jlccBW9HjgQvg2tYCVVq0imrU_z0grEHNthhG4xD3afSOD1_RzvHs8Tc45dvztHJzB4gF0CAX-yIDwi7XcHiMRY0vkXOETBeHKewg0ktWSnZ7SLf4GxGzE7ry2u_pmhqhCPhxpa0oGQ_rBJUYkEAFg1OwaqjwvzCFgdT11r-XsHmnkcfJX_ktj59RWR_zgbytiCRtwCK9LNUflveS5GzUaCXbPn2deQ3F2hPldLECEa_ahwoapoK1LhkgOAVyPLJf6M1Cm09Le7rkdSaWQSW5BI_sPx5YaUaXkeqg"
  },
  "jwsSignature": "string",
  "documentNo": "FT FT6325S2C/7",
  "action": "C",
  "deductibleVATPercentage": "72.5",
  "nonDeductibleAmount": "200.00"
 }
   */
  return {
      schemaVersion: getSchemaVersion(),
      submissionTimeStamp: getsubmissionTimeStamp(),
      taxRegistrationNumber: taxRegistrationNumber,
      softwareInfo: getSoftwareInfo(), 
      jwsSignature: getJwsSignature(taxRegistrationNumber, invoiceNo),
      invoiceNo: invoiceNo,
      action: action,
      deductibleVATPercentage: deductibleVATPercentage,
      nonDeductibleAmount: nonDeductibleAmount
  };
}
 

/**
 * 
 * @param {Int} taxRegistrationNumber Número fiscal de contribuinte do cliente
 * @param {*} documentsList  Lista dos documentos a serem emitidos em lote.
 * @returns Payload para Salvar a fatura
 */ 
 export function getPAyLoadCreateInvoices(taxRegistrationNumber, documentsList ) {
  /**
   * {
    "schemaVersion": "1.2",
    "submissionUUID": "a1b2c3d4-e5f6-7890-g1h2-i23822j2232-3784",
    "taxRegistrationNumber": "5001636863",
    "submissionTimeStamp": "2025-11-04T14:30:00Z",
    "softwareInfo": {
        "softwareInfoDetail": {
            "productId": "Meu ERP CERTO",
            "productVersion": "1.0.1",
            "softwareValidationNumber": "C_134"
        },
        "jwsSoftwareSignature": "eyJ0eXAiOiJKT1NFIiwiYWxnIjoiUlMyNTYifQ.eyJwcm9kdWN0SWQiOiJNZXUgRVJQIENFUlRPIiwicHJvZHVjdFZlcnNpb24iOiIxLjAuMSIsInNvZnR3YXJlVmFsaWRhdGlvbk51bWJlciI6IkNfMTM0In0.VE3zkvOJOpqBfz4wpx4KCgcwOGgzGUP3MSMbaHCDnHhwOaeA6jlccBW9HjgQvg2tYCVVq0imrU_z0grEHNthhG4xD3afSOD1_RzvHs8Tc45dvztHJzB4gF0CAX-yIDwi7XcHiMRY0vkXOETBeHKewg0ktWSnZ7SLf4GxGzE7ry2u_pmhqhCPhxpa0oGQ_rBJUYkEAFg1OwaqjwvzCFgdT11r-XsHmnkcfJX_ktj59RWR_zgbytiCRtwCK9LNUflveS5GzUaCXbPn2deQ3F2hPldLECEa_ahwoapoK1LhkgOAVyPLJf6M1Cm09Le7rkdSaWQSW5BI_sPx5YaUaXkeqg"
    },
    "numberOfEntries": 1,
    "documents": [
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
    ]
    }
   */

    return {
      schemaVersion: getSchemaVersion(),
      submissionUUID: gerarUUID(),
      taxRegistrationNumber: taxRegistrationNumber,
      submissionTimeStamp: getsubmissionTimeStamp(),
      softwareInfo: getSoftwareInfo(),
      numberOfEntries: documentsList.length,
      documents: documentsList
  };
 }

/*
const data = await getNIFinformation("5412345678", "NIF");
console.log("#### ", JSON.stringify(data, null, 2));
*/