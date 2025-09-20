const express = require('express');
const router = express.Router();

// Página de boleto para pagamento VIP
router.get('/:hash', (req, res) => {
  const { hash } = req.params;
  
  console.log('📄 Boleto acessado para hash:', hash);
  
  // HTML da página de boleto
  const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Boleto VIP - Borracha de Roupas</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: Arial, sans-serif; 
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .container {
      background: white;
      border-radius: 20px;
      padding: 40px;
      max-width: 500px;
      width: 100%;
      text-align: center;
      box-shadow: 0 20px 40px rgba(0,0,0,0.1);
    }
    .crown {
      font-size: 4rem;
      margin-bottom: 20px;
      animation: bounce 2s infinite;
    }
    @keyframes bounce {
      0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
      40% { transform: translateY(-10px); }
      60% { transform: translateY(-5px); }
    }
    .title {
      color: #333;
      font-size: 2rem;
      font-weight: bold;
      margin-bottom: 10px;
    }
    .price {
      color: #e91e63;
      font-size: 3rem;
      font-weight: bold;
      margin: 20px 0;
    }
    .info {
      background: #f8f9fa;
      border-radius: 10px;
      padding: 20px;
      margin: 20px 0;
      text-align: left;
    }
    .info h3 {
      color: #333;
      margin-bottom: 15px;
    }
    .info p {
      margin-bottom: 10px;
      color: #666;
    }
    .highlight {
      background: #fff3cd;
      border: 1px solid #ffeaa7;
      border-radius: 8px;
      padding: 15px;
      margin: 20px 0;
    }
    .btn {
      background: linear-gradient(45deg, #e91e63, #9c27b0);
      color: white;
      border: none;
      padding: 15px 30px;
      border-radius: 50px;
      font-size: 1.1rem;
      font-weight: bold;
      cursor: pointer;
      margin: 10px;
      transition: transform 0.2s;
    }
    .btn:hover {
      transform: scale(1.05);
    }
    .btn-secondary {
      background: #6c757d;
    }
    .hash {
      font-family: monospace;
      background: #f1f3f4;
      padding: 10px;
      border-radius: 5px;
      font-size: 0.9rem;
      word-break: break-all;
      margin: 10px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="crown">👑</div>
    <div class="title">Upgrade VIP</div>
    <div class="price">R$ 49,90</div>
    
    <div class="info">
      <h3>📋 Informações do Pagamento</h3>
      <p><strong>Produto:</strong> Upgrade VIP - Borracha de Roupas</p>
      <p><strong>Valor:</strong> R$ 49,90</p>
      <p><strong>Hash da Transação:</strong></p>
      <div class="hash">${hash}</div>
    </div>
    
    <div class="highlight">
      <p><strong>⚠️ Importante:</strong> Este é um ambiente de desenvolvimento. Em produção, aqui seria exibido um boleto bancário real ou integração com gateway de pagamento.</p>
    </div>
    
    <div class="info">
      <h3>💳 Como Pagar</h3>
      <p>1. Entre em contato com o suporte</p>
      <p>2. Informe o hash da transação</p>
      <p>3. Escolha o método de pagamento</p>
      <p>4. Seu VIP será ativado automaticamente</p>
    </div>
    
    <button class="btn" onclick="window.close()">
      ✅ Entendi
    </button>
    
    <button class="btn btn-secondary" onclick="window.history.back()">
      ← Voltar
    </button>
  </div>

  <script>
    console.log('📄 Página de boleto carregada para hash:', '${hash}');
    
    // Simular que o pagamento foi processado após 30 segundos (apenas para demonstração)
    setTimeout(() => {
      console.log('💰 Simulando processamento de pagamento...');
    }, 30000);
  </script>
</body>
</html>
  `;
  
  res.send(html);
});

module.exports = router;
