import  { gerarUUID, getSoftwareInfo, 
        getsubmissionTimeStamp, getSchemaVersion, 
        getJWTSignatureSeries}  from '../utils/utils.js';

import { getPayLoadLisSeries, getPayLoadCreateSeries, 
    getPayloadStatusInvoice, getPayloadConsultInvoice,
    getPayloadValidateInvoice } from '../utils/core-functions.js';
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

let payload = getPayloadValidateInvoice("5001636863", "10", "72.5", "200.00", "C");
console.log("#### Payload para consulta de fatura: ", JSON.stringify(payload, null, 2));