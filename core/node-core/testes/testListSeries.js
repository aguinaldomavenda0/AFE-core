import axios from 'axios';
import 'dotenv/config';

async function listarSeries() {
  //const endpoint = 'https://sifphml.minfin.gov.ao/sigt/contribuinte/v5/obter';
  const endpoint = 'https://sifphml.minfin.gov.ao/sigt/fe/v1/listarSeries';

  const params = {
    schemaVersion: "1.2",
    taxRegistrationNumber: "5001636863",
    submissionTimeStamp: "2026-01-08T08:51:10.178Z",
    seriesCode: "LD6325S1N",
    seriesYear: "2026",
    seriesStatus: "A",
    documentType: "LD",
    establishmentNumber: 10,
    jwsSignature: "string",
    softwareInfo: {
        softwareInfoDetail: {
            productId: "Meu ERP CERTO",
            productVersion: "1.0.1",
            softwareValidationNumber: "C_134"
        },
        jwsSoftwareSignature    : "eyJ0eXAiOiJKT1NFIiwiYWxnIjoiUlMyNTYifQ.eyJwcm9kdWN0SWQiOiJNZXUgRVJQIENFUlRPIiwicHJvZHVjdFZlcnNpb24iOiIxLjAuMSIsInNvZnR3YXJlVmFsaWRhdGlvbk51bWJlciI6IkNfMTM0In0.VE3zkvOJOpqBfz4wpx4KCgcwOGgzGUP3MSMbaHCDnHhwOaeA6jlccBW9HjgQvg2tYCVVq0imrU_z0grEHNthhG4xD3afSOD1_RzvHs8Tc45dvztHJzB4gF0CAX-yIDwi7XcHiMRY0vkXOETBeHKewg0ktWSnZ7SLf4GxGzE7ry2u_pmhqhCPhxpa0oGQ_rBJUYkEAFg1OwaqjwvzCFgdT11r-XsHmnkcfJX_ktj59RWR_zgbytiCRtwCK9LNUflveS5GzUaCXbPn2deQ3F2hPldLECEa_ahwoapoK1LhkgOAVyPLJf6M1Cm09Le7rkdSaWQSW5BI_sPx5YaUaXkeqg"
    }
  }; 

  const headers = {
    Username: process.env.HML_USER,
    Password: process.env.HML_PASS,
    Accept: 'application/json'
  };

  try {
    const response = await axios.post(endpoint, {
      params,
      headers,
      timeout: 150000
    });

    console.log('Resposta da AGT:');
    console.log(JSON.stringify(response.data, null, 2));

    return response.data;

  } catch (error) {
    if (error.response) {
      // Erro retornado pela AGT
      console.error('Erro da AGT:', error.response.status);
      console.error(error.response.data);
    } else {
      // Erro de rede ou timeout
      console.error('Erro:', error.message);
    }
  }
}

// Executar
listarSeries();