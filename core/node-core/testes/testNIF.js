import axios from 'axios';
import 'dotenv/config';

async function consultarNIF() {
  //const endpoint = 'https://sifphml.minfin.gov.ao/sigt/contribuinte/v5/obter';
  const endpoint = 'https://sifp.minfin.gov.ao/sigt/contribuinte/consultarNIF/v5/obter';

  const params = {
    tipoDocumento: 'NIF',          
    numeroDocumento: '5412345678'  
  };

  console.log(process.env.HML_USER, process.env.HML_PASS);
  
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
consultarNIF();