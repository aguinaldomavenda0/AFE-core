import  { gerarUUID, getSoftwareInfo, 
        getsubmissionTimeStamp, getSchemaVersion, 
        requestServerAGT, getPayloadDocument}  from '../utils/utils.js';

import { getPayLoadLisSeries, getPayLoadCreateSeries, 
    getPayloadStatusInvoice, getPayloadConsultInvoice,
    getPayloadValidateInvoice, getPayLoadLisInvoices, getPayLoadCreateInvoices } from '../utils/core-functions.js';
import axios from 'axios';
import 'dotenv/config';
 
/*

{
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

/**

let payload = getPayLoadLisSeries("5001636863", "10", "2025", "LD6325S1N", "LD", "A");
console.log("#### Payload para consulta de série: ", JSON.stringify(payload, null, 2));
*/


console.log(process.env.HML_LIST_SERIES);

const documentsJSon = `
{"documents": [
        {
            "documentNo": "FT FT6325S2C/10007",
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

const documentsJSonNC = `{"documents": [
        {
            "documentNo": "NC FR6325S2C/10011",
            "documentStatus": "N",
            "jwsDocumentSignature": "eyJ0eXAiOiJKT1NFIiwiYWxnIjoiUlMyNTYifQ.eyJkb2N1bWVudE5vIjoiRlQgRlQ2MzI1UzJDLzEwMDA2IiwidGF4UmVnaXN0cmF0aW9uTnVtYmVyIjoiNTAwMTYzNjg2MyIsImRvY3VtZW50VHlwZSI6IkZUIiwiZG9jdW1lbnREYXRlIjoiMjAyNS0xMS0wNCIsImN1c3RvbWVyVGF4SUQiOiJQVDk4NzY1NDMyMSIsImN1c3RvbWVyQ291bnRyeSI6IlBUIiwiY29tcGFueU5hbWUiOiJDbGllbnRlIEV4ZW1wbG8gTGRhIn0.Sg0jnyksnnXtXUkf5PaoZrRtf3kiNkw3urFaE2D1fHLLLw_hQWc896-cGbRVnJGRHPrcnOnEQqQ-ws5R51erzadVstr9Q1yUd0CIvUhszGO15t6m0H--O9VtNMWEOp2asP4P80LD4m55y5rX2stCCGAmTI2N1cAWAhw1JbRr2Zb378y8ZI8dicfJm1QDzs5YKmXrRqXH9yvaF62SHXXfpv5gzLRAAbRwjvY7roso_PRuue9Ke1w0hojnpBmr_zUg0D3eBa-eUjtVPMQsbl5DXBFhr4Qydr4Q04tvUqLBAeGpQmxTRZGs2OCjQzdz2tYIZSbEiFR9Zo6EwL1s1tsRnA",
            "documentDate": "2025-11-04",
            "documentType": "NC",
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
                    "debitAmount": 500,
                    "creditAmount": 0,
                     "referenceInfo": {
                        "reference": "FR FT6325S2C/10006",
                        "reason": "Devolução de mercadoria",
                        "referenceItemLineNo": "1"
                    },
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

const documentsJSonRG = `{"documents": [
        {
            "documentNo": "RC FR6325S2C/10011",
            "documentStatus": "N",
            "jwsDocumentSignature": "eyJ0eXAiOiJKT1NFIiwiYWxnIjoiUlMyNTYifQ.eyJkb2N1bWVudE5vIjoiRlQgRlQ2MzI1UzJDLzEwMDA2IiwidGF4UmVnaXN0cmF0aW9uTnVtYmVyIjoiNTAwMTYzNjg2MyIsImRvY3VtZW50VHlwZSI6IkZUIiwiZG9jdW1lbnREYXRlIjoiMjAyNS0xMS0wNCIsImN1c3RvbWVyVGF4SUQiOiJQVDk4NzY1NDMyMSIsImN1c3RvbWVyQ291bnRyeSI6IlBUIiwiY29tcGFueU5hbWUiOiJDbGllbnRlIEV4ZW1wbG8gTGRhIn0.Sg0jnyksnnXtXUkf5PaoZrRtf3kiNkw3urFaE2D1fHLLLw_hQWc896-cGbRVnJGRHPrcnOnEQqQ-ws5R51erzadVstr9Q1yUd0CIvUhszGO15t6m0H--O9VtNMWEOp2asP4P80LD4m55y5rX2stCCGAmTI2N1cAWAhw1JbRr2Zb378y8ZI8dicfJm1QDzs5YKmXrRqXH9yvaF62SHXXfpv5gzLRAAbRwjvY7roso_PRuue9Ke1w0hojnpBmr_zUg0D3eBa-eUjtVPMQsbl5DXBFhr4Qydr4Q04tvUqLBAeGpQmxTRZGs2OCjQzdz2tYIZSbEiFR9Zo6EwL1s1tsRnA",
            "documentDate": "2025-11-04",
            "documentType": "RC",
            "eacCode": "12345",
            "systemEntryDate": "2025-11-04T11:15:30Z",
            "customerTaxID": "PT987654321",
            "customerCountry": "PT",
            "companyName": "Cliente Exemplo Lda", 
            "documentTotals": {
                "taxPayable": 70,
                "netTotal": 500,
                "grossTotal": 570
            },
            "paymentReceipt": {
                "sourceDocuments": [{
                    "lineNo": 1,
                    "debitAmount": 0,
                    "sourceDocumentID": {
                        "originatingON": "FT6325S2C/10006",
                        "documentDate": "2025-11-04"
                    },
                    "creditAmount": 570
                }]
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
//const documentsObj = JSON.parse(documentsJSon);
const documentsObj = JSON.parse(documentsJSonRG);
 

//let payload = getPayLoadLisInvoices("5001636863", "SEDE", "2025-12-22T18:07:37Z", "2025-12-30T10:00:00Z");
//let payload = getPayloadConsultInvoice("5001636863", "FT FT6325S2C/10006");
//let payload = getPayloadValidateInvoice("5001636863","FT FT6325S2C/10006",72.5,200,"C");
//let payload = getPayloadStatusInvoice("5001636863", "202600000104359");
let payload = getPayLoadCreateInvoices("5001636863",documentsObj.documents); 
//let payload = getPayLoadCreateInvoices("5001636863",documentsObj.documents); 
//202600000104359
//FT FT6325S2C/10006
console.log("#### Resposta da AGT para consulta de série: ", JSON.stringify(payload, null, 2));

//const response = await requestServerAGT(process.env.HML_LIST_SERIES, payload);

/**
 * 
*/