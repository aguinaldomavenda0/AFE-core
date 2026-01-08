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

---

## 📜 Licença

MIT License
