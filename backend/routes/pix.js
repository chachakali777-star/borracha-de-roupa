const express = require('express');
const router = express.Router();
const pixService = require('../services/pixService');
const authenticateToken = require('../middleware/auth').authenticateToken;
const fs = require('fs');
const path = require('path');

// Gerar PIX real para VIP
router.post('/vip', async (req, res) => {
  try {
    console.log('💳 Solicitação PIX VIP recebida (sem auth para teste)');

    const amount = 4990; // R$ 49,90
    const description = 'Upgrade VIP - Borracha de Roupas';

    // Gerar PIX real
    const pixResult = await pixService.generatePix(amount, description);

    if (!pixResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Erro ao gerar PIX'
      });
    }

    // Salvar transação PIX no banco
    const transaction = {
      id: pixResult.txId,
      user_email: 'teste@vip.com', // Temporário para teste
      amount: amount,
      product: 'VIP_UPGRADE',
      pix_code: pixResult.pixCode,
      status: 'pending',
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + (30 * 60 * 1000)).toISOString() // 30 min
    };

    // Ler banco de dados atual
    const dbPath = path.join(__dirname, '../data/database.json');
    let database = { users: [], transactions: [], pix_transactions: [] };
    
    if (fs.existsSync(dbPath)) {
      const dbContent = fs.readFileSync(dbPath, 'utf8');
      database = JSON.parse(dbContent);
    }

    // Adicionar transação PIX
    if (!database.pix_transactions) {
      database.pix_transactions = [];
    }
    database.pix_transactions.push(transaction);

    // Salvar no banco
    fs.writeFileSync(dbPath, JSON.stringify(database, null, 2));

    console.log('✅ PIX gerado com sucesso:', {
      txId: pixResult.txId,
      amount: amount,
      user: 'teste@vip.com'
    });

    res.json({
      success: true,
      message: pixResult.message,
      data: {
        pix_code: pixResult.pixCode,
        qr_code: pixResult.qrCodeText,
        transaction_id: pixResult.txId,
        amount: amount,
        expires_in: pixResult.expiresIn,
        status: 'pending'
      }
    });

  } catch (error) {
    console.error('❌ Erro ao gerar PIX VIP:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Verificar status do pagamento PIX
router.get('/status/:txId', authenticateToken, async (req, res) => {
  try {
    const { txId } = req.params;
    console.log('🔍 Verificando status PIX:', txId);

    // Verificar no serviço PIX
    const status = await pixService.checkPaymentStatus(txId);

    // Se pago, atualizar no banco
    if (status.status === 'paid') {
      const dbPath = path.join(__dirname, '../data/database.json');
      let database = { users: [], transactions: [], pix_transactions: [] };
      
      if (fs.existsSync(dbPath)) {
        const dbContent = fs.readFileSync(dbPath, 'utf8');
        database = JSON.parse(dbContent);
      }

      // Encontrar transação
      const pixTransaction = database.pix_transactions?.find(t => t.id === txId);
      if (pixTransaction && pixTransaction.status === 'pending') {
        // Marcar como paga
        pixTransaction.status = 'paid';
        pixTransaction.paid_at = status.paidAt;

        // Ativar VIP do usuário
        const user = database.users.find(u => u.email === pixTransaction.user_email);
        if (user) {
          user.vip = true;
          user.vip_expires_at = new Date(Date.now() + (365 * 24 * 60 * 60 * 1000)).toISOString(); // 1 ano
          console.log('👑 VIP ativado para usuário:', user.email);
        }

        // Salvar no banco
        fs.writeFileSync(dbPath, JSON.stringify(database, null, 2));
      }
    }

    res.json({
      success: true,
      status: status.status,
      paid_at: status.paidAt,
      transaction_id: txId
    });

  } catch (error) {
    console.error('❌ Erro ao verificar status PIX:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao verificar pagamento'
    });
  }
});

// Webhook para receber notificações do provedor PIX (em produção)
router.post('/webhook', async (req, res) => {
  try {
    console.log('🔔 Webhook PIX recebido:', req.body);

    // Em produção, validar assinatura do webhook
    const { txId, status, amount } = req.body;

    if (status === 'paid') {
      // Processar pagamento aprovado
      console.log('💰 Pagamento PIX aprovado:', { txId, amount });
      
      // Lógica similar ao endpoint de status
      // Atualizar banco e ativar VIP
    }

    res.json({ success: true });

  } catch (error) {
    console.error('❌ Erro no webhook PIX:', error);
    res.status(500).json({ success: false });
  }
});

module.exports = router;
