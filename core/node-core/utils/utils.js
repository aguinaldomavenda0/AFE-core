import { log } from 'console';
import crypto from 'crypto';
import 'dotenv/config';
import fs from 'fs';
import path from 'path';

/**
 * Gera assinatura JWS usando RS256
 * @param {object} payload - Dados a assinar
 * @param {string} privateKey - Chave privada em formato PEM
 * @returns {string} Token JWS assinado
 */
function gerarAssinaturaJWS(payload, privateKey) {
  const header = {
    typ: 'JOSE',
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
  const softwareInfoDetailJson = {
    productId: process.env.PRODUCT_ID,
    productVersion: process.env.PRODUCT_VERSION,
    softwareValidationNumber: process.env.SOFTWARE_VALIDATION_NUMBER,
    signatureVersion: process.env.SIGNATURE_VERSION
  };
  return {
    softwareInfoDetail: softwareInfoDetailJson,
    jwsSoftwareSignature: gerarAssinaturaJWS(softwareInfoDetailJson, getPrivateKey())
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
export function getHeaderRequest() {
  const headers = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${Buffer.from(
        `${process.env.HML_USER}:${process.env.HML_PASS}`
      ).toString('base64')}`
    },
    auth: {
      username: process.env.HML_USER,
      password: process.env.HML_PASS
    },

  }
  console.log(process.env);
  
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
 