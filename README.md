# AFE-Core — AGT Electronic Invoicing Open Middleware

**AFE-Core** é um middleware open-source para **Faturação Eletrónica da AGT (Angola)**.  
O seu objetivo é eliminar a complexidade técnica da integração com a AGT, fornecendo um **ponto único de entrada em JSON**, independente de linguagem, ERP ou fornecedor.

> One integration. Any language. Any software.

---

## 📌 Contexto

Com a implementação da **Faturação Eletrónica pela AGT**, todos os produtores de software são obrigados a integrar os seus sistemas com o portal da AGT.

Atualmente, cada produtor está a:
- Interpretar documentação complexa individualmente  
- Implementar regras fiscais duplicadas  
- Gerir XML, assinaturas digitais, certificados e estados  
- Criar integrações fechadas e difíceis de manter  

O **AFE-Core** surge para **padronizar, simplificar e abrir** esse processo.

---

## 🎯 Objetivo do Projeto

Criar um **middleware neutro e aberto** que:

- Recebe **exclusivamente JSON**
- Expõe uma **API REST simples**
- Comunica diretamente com a AGT
- Isola regras fiscais, assinatura e submissão
- Permite múltiplas implementações (cores) em diferentes linguagens

👉 O ERP / POS **não integra com a AGT**  
👉 O ERP / POS **integra apenas com o AFE-Core**

---

## 🧠 Conceito Central

```
[ ERP / POS / Software ]
          |
          | REST / JSON
          v
[ AFE-Core Middleware ]
          |
          | Regras + Assinatura + Submissão
          v
[ Portal AGT ]
```

---

## 🧩 Arquitetura Aberta (Multi-Core)

Este projeto **não impõe uma linguagem específica**.

Cada empresa ou equipa pode criar o seu próprio **Core**, desde que respeite o **contrato JSON oficial** definido em `docs/api-contract.md`.

---

## 📦 Estrutura do Repositório

```
AFE-core/
├─ docs/
├─ cores/
├─ sdks/
├─ examples/
└─ README.md
```

---

## 📄 Exemplo de JSON

```json
{
  "company": {
    "nif": "5001234567",
    "name": "Empresa Exemplo, Lda"
  },
  "document": {
    "type": "FT",
    "number": "FT 2025/001",
    "date": "2025-01-05",
    "currency": "AOA"
  }
}
```

## 📁 Estrutura do Repositório

A estrutura do **AFE-Core** foi pensada para permitir múltiplas implementações (cores) em diferentes linguagens, mantendo um único padrão de integração.
AFE-core/
├─ docs/
├─ cores/
├─ sdks/
├─ examples/
└─ README.md


### 📂 `docs/` — Documentação oficial (normativa)

Contém toda a documentação que **define o comportamento obrigatório** do AFE-Core.

Tudo o que está nesta pasta é considerado **contrato oficial** do projeto e deve ser seguido por todos os cores, independentemente da linguagem.

Inclui, entre outros:
- Contrato JSON da API
- Ciclo de vida dos documentos
- Mapeamento técnico para a AGT
- Regras fiscais e validações

👉 Nenhum core deve divergir do que está definido aqui.

---

### 📂 `cores/` — Implementações do middleware

Contém as **implementações completas do AFE-Core**, em diferentes linguagens.

Cada subpasta representa um core funcional e independente, capaz de:
- Receber documentos em JSON
- Validar regras fiscais
- Assinar documentos
- Submeter à AGT
- Gerir estados e respostas

Exemplo:
cores/
├─ core-node/
├─ core-php/
├─ core-java/
└─ core-dotnet/


👉 O comportamento funcional deve ser o mesmo em todos os cores.

---

### 📂 `sdks/` — SDKs para produtores de software

Contém SDKs leves para facilitar a integração de ERPs, POS e outros sistemas com o AFE-Core.

Os SDKs:
- Comunicam apenas com o Core
- Não contêm regras fiscais
- Não comunicam com a AGT

Exemplo:
sdks/
├─ php/
├─ javascript/
└─ dotnet/


👉 O ERP nunca precisa lidar diretamente com a AGT.

---

### 📂 `examples/` — Exemplos práticos de integração

Inclui exemplos simples e didáticos de integração com o AFE-Core.

Objetivo:
- Ajudar novos produtores a começar rapidamente
- Demonstrar fluxos reais (emissão, consulta, erros)
- Servir como referência técnica

Exemplo:
examples/
└─ erp-integration/
├─ send-invoice.php
└─ check-status.js


👉 Código demonstrativo, não recomendado para produção.

---

### 📄 `README.md` — Apresentação do projeto

Documento principal do repositório.

Apresenta:
- Visão e objetivos do projeto
- Conceito do middleware
- Estrutura geral
- Como contribuir

👉 Ponto de entrada para novos colaboradores.

---

## 📜 Licença

MIT License
