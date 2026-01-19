require('dotenv').config()
const express = require('express')
const axios = require('axios')

const app = express()
app.use(express.json({ limit: '10mb' }))


/**
 * Endpoints AGT
 */
const AGT_ENDPOINTS = {
  hml: 'https://sifphml.minfin.gov.ao/sigt/fe/ws/v1/registarFactura',
  prod: 'https://sifp.minfin.gov.ao/sigt/fe/v1/solicitarSerie'
}

/**
 * Health check
 */
app.get('/health', (_, res) => {
  res.status(200).json({ status: 'ok', service: 'AFE-Core Middleware' })
})

/**
 * Solicitar criação de série
 */
app.post('/agt/series', async (req, res) => {
  try {
    const { environment, payload } = req.body

    // validações mínimas
    if (!environment || !['hml', 'prod'].includes(environment)) {
      return res.status(400).json({
        error: 'environment inválido. Use "hml" ou "prod".'
      })
    }

    if (!payload || typeof payload !== 'object') {
      return res.status(400).json({
        error: 'payload é obrigatório e deve ser um objecto JSON'
      })
    }

    const agtUrl = AGT_ENDPOINTS[environment]

    const response = await axios.post(agtUrl, payload, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000
    })

    return res.status(response.status).json(response.data)

  } catch (error) {
    // Erros da AGT (400, 500, etc)
    if (error.response) {
      return res.status(error.response.status).json({
        agtStatus: error.response.status,
        agtResponse: error.response.data
      })
    }

    // Erros internos
    return res.status(500).json({
      error: 'Erro ao comunicar com a AGT',
      details: error.message
    })
  }
})

const PORT = process.env.PORT || 3005
app.listen(PORT, () => {
  console.log(`🚀 AFE-Core Middleware activo na porta ${PORT}`)
})
