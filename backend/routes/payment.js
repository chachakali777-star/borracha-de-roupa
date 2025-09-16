const express = require('express');
const axios = require('axios');
const { authenticateToken } = require('../middleware/auth');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Configurações da Nitro Pay
const NITRO_API_URL = 'https://api.nitropagamentos.com/api/public/v1';
const NITRO_API_TOKEN = process.env.NITRO_API_TOKEN || '';

  // Carregar configuração das ofertas
  let nitroConfig = null;
try {
  const configPath = path.join(__dirname, '..', 'nitro-config.json');
  nitroConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
} catch (error) {
  console.error('Erro ao carregar configuração da Nitro Pay:', error);
}

// Criar transação de pagamento
router.post('/create', authenticateToken, async (req, res) => {
  try {
    const {
      amount,
      payment_method,
      customer,
      cart,
      installments,
      expire_in_days,
      postback_url,
      card
    } = req.body;

    // Validar dados obrigatórios
    if (!amount || !payment_method || !customer || !cart) {
      return res.status(400).json({
        success: false,
        message: 'Dados obrigatórios não fornecidos'
      });
    }

    // Determinar offer_hash baseado no valor
    let offerHash = 'qd3cr'; // Hash padrão
    if (nitroConfig && nitroConfig.offers) {
      // Mapear valor para tokens e encontrar offer_hash correspondente
      const valueInCents = parseInt(amount);
      if (valueInCents === 1000) offerHash = nitroConfig.offers['30'];
      else if (valueInCents === 3000) offerHash = nitroConfig.offers['230'];
      else if (valueInCents === 6000) offerHash = nitroConfig.offers['470'];
      else if (valueInCents === 10000) offerHash = nitroConfig.offers['1000'];
    }

    // Preparar dados para a Nitro Pay
    const nitroData = {
      amount: parseInt(amount),
      offer_hash: offerHash,
      payment_method,
      customer: {
        name: customer.name,
        email: customer.email,
        phone_number: customer.phone_number,
        document: customer.document,
        street_name: 'Digital Product',
        number: 'N/A',
        complement: '',
        neighborhood: 'Digital',
        city: 'Digital',
        state: 'SP',
        zip_code: '00000000'
      },
      cart: cart.map(item => ({
        product_hash: item.product_hash,
        title: item.title,
        cover: item.cover,
        price: parseInt(item.price),
        quantity: item.quantity,
        operation_type: item.operation_type,
        tangible: item.tangible
      })),
      installments: installments || 1,
      expire_in_days: expire_in_days || 1,
      postback_url: postback_url || `https://webhook.site/35926974-aea8-4a50-ab57-b62ccd47a2d9`
    };

    // Adicionar dados do cartão se for cartão de crédito
    if (payment_method === 'credit_card' && card) {
      nitroData.card = {
        number: card.number.replace(/\s/g, ''),
        holder_name: card.holder_name,
        exp_month: parseInt(card.exp_month),
        exp_year: parseInt(card.exp_year),
        cvv: card.cvv
      };
    }

    // Fazer requisição para a Nitro Pay
    const response = await axios.post(
      `${NITRO_API_URL}/transactions?api_token=${NITRO_API_TOKEN}`,
      nitroData,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    );

    // Verificar se a transação foi criada com sucesso
    if (response.data && response.data.success !== false) {
      console.log('Resposta da Nitro Pay:', response.data);
      
      // Extrair dados do PIX corretamente
      const pixQrCode = response.data.pix?.pix_qr_code || response.data.pix_qr_code || null;
      const pixUrl = response.data.pix?.pix_url || response.data.pix_url || null;
      
      console.log('QR Code extraído:', pixQrCode);
      console.log('PIX URL extraída:', pixUrl);
      
      const transactionData = {
        hash: response.data.hash,
        status: response.data.payment_status,
        amount: response.data.amount,
        payment_method: response.data.payment_method,
        qr_code: pixQrCode,
        payment_url: pixUrl,
        created_at: response.data.created_at
      };

      res.json({
        success: true,
        message: 'Transação criada com sucesso',
        transaction: transactionData,
        payment_url: pixUrl,
        qr_code: pixQrCode
      });
    } else {
      console.log('Erro na resposta da Nitro Pay:', response.data);
      res.json({
        success: false,
        message: response.data.message || 'Erro ao criar transação'
      });
    }

  } catch (error) {
    console.error('Erro ao criar transação:', error.response?.data || error.message);
    
    res.status(500).json({
      success: false,
      message: error.response?.data?.message || 'Erro interno do servidor'
    });
  }
});

// Webhook para receber atualizações de status
router.post('/webhook', async (req, res) => {
  try {
    console.log('=== WEBHOOK RECEBIDO ===');
    console.log('Timestamp:', new Date().toISOString());
    console.log('Headers:', req.headers);
    console.log('Body completo:', JSON.stringify(req.body, null, 2));
    
    const { hash, payment_status, amount, customer } = req.body;
    
    console.log('Dados extraídos:', { hash, payment_status, amount, customer });
    
    // Processar pagamento aprovado
    if (payment_status === 'approved' || payment_status === 'paid') {
      console.log('✅ Pagamento aprovado, adicionando tokens...');
      
      try {
        // Buscar usuário pelo email
        const user = User.findByEmail(customer.email);
        if (user) {
          console.log('👤 Usuário encontrado:', user.email);
          
          // Calcular tokens baseado no valor pago
          let tokensToAdd = 0;
          const amountInReais = amount / 100;
          
          console.log('💰 Valor pago:', amountInReais, 'reais');
          
          if (amountInReais === 5) tokensToAdd = 25;      // Pacote de teste
          else if (amountInReais === 10) tokensToAdd = 100;
          else if (amountInReais === 30) tokensToAdd = 500;
          else if (amountInReais === 60) tokensToAdd = 1000;
          else if (amountInReais === 100) tokensToAdd = 2000;
          else {
            // Fallback: 1 token = R$ 0,33
            tokensToAdd = Math.floor(amountInReais / 0.33);
          }
          
          console.log('🎯 Tokens a adicionar:', tokensToAdd);
          console.log('📊 Tokens atuais do usuário:', user.tokens);
          
          // Atualizar tokens do usuário
          const updatedUser = User.updateTokens(user.id, user.tokens + tokensToAdd);
          
          console.log(`✅ SUCESSO! Usuário ${user.email} recebeu ${tokensToAdd} tokens. Total: ${updatedUser.tokens}`);
        } else {
          console.log('❌ Usuário não encontrado:', customer.email);
        }
      } catch (error) {
        console.error('❌ Erro ao adicionar tokens:', error);
      }
    } else {
      console.log('⏳ Status do pagamento:', payment_status);
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Erro no webhook:', error);
    res.status(500).json({ success: false });
  }
});

// Rota de teste do webhook
router.post('/test-webhook', async (req, res) => {
  console.log('🧪 TESTE DO WEBHOOK - Dados recebidos:', req.body);
  res.json({ success: true, message: 'Webhook funcionando!' });
});

// Rota para processar webhook manualmente (quando recebido via webhook.site)
router.post('/process-webhook', async (req, res) => {
  try {
    const webhookData = req.body;
    console.log('🔔 Processando webhook manual:', JSON.stringify(webhookData, null, 2));
    
    const { hash, payment_status, amount, customer } = webhookData;
    
    console.log('🔍 Debug - payment_status:', payment_status);
    console.log('🔍 Debug - amount:', amount);
    console.log('🔍 Debug - customer:', customer);
    
    console.log('🔍 Comparando payment_status:', payment_status, 'com "paid":', payment_status === 'paid');
    console.log('🔍 Comparando payment_status:', payment_status, 'com "approved":', payment_status === 'approved');
    
    if (payment_status === 'approved' || payment_status === 'paid') {
      console.log('✅ Pagamento aprovado, processando tokens...');
      
      // Buscar usuário pelo email
      const user = User.findByEmail(customer.email);
      if (user) {
        console.log('👤 Usuário encontrado:', user.email);
        
        // Calcular tokens baseado no valor pago
        let tokensToAdd = 0;
        const amountInReais = amount / 100;
        
        console.log('💰 Valor pago:', amountInReais, 'reais');
        
        if (amountInReais === 5) tokensToAdd = 25;      // Pacote de teste
        else if (amountInReais === 10) tokensToAdd = 100;
        else if (amountInReais === 30) tokensToAdd = 500;
        else if (amountInReais === 60) tokensToAdd = 1000;
        else if (amountInReais === 100) tokensToAdd = 2000;
        else {
          // Fallback: 1 token = R$ 0,33
          tokensToAdd = Math.floor(amountInReais / 0.33);
        }
        
        console.log('🎯 Tokens a adicionar:', tokensToAdd);
        console.log('📊 Tokens atuais do usuário:', user.tokens);
        
        // Atualizar tokens do usuário
        const updatedUser = User.updateTokens(user.id, user.tokens + tokensToAdd);
        
        console.log(`✅ SUCESSO! Usuário ${user.email} recebeu ${tokensToAdd} tokens. Total: ${updatedUser.tokens}`);
        
        res.json({
          success: true,
          message: `Tokens adicionados com sucesso! ${tokensToAdd} tokens creditados.`,
          tokensAdded: tokensToAdd,
          totalTokens: updatedUser.tokens
        });
      } else {
        console.log('❌ Usuário não encontrado:', customer.email);
        res.json({
          success: false,
          message: 'Usuário não encontrado'
        });
      }
    } else {
      console.log('⏳ Status do pagamento:', payment_status);
      res.json({
        success: false,
        message: `Pagamento com status: ${payment_status}`
      });
    }
  } catch (error) {
    console.error('❌ Erro ao processar webhook:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao processar webhook'
    });
  }
});

// Consultar status de uma transação
router.get('/status/:hash', authenticateToken, async (req, res) => {
  try {
    const { hash } = req.params;
    
    const response = await axios.get(
      `${NITRO_API_URL}/transactions/${hash}?api_token=${NITRO_API_TOKEN}`,
      {
        headers: {
          'Accept': 'application/json'
        }
      }
    );
    
    res.json({
      success: true,
      transaction: response.data
    });
    
  } catch (error) {
    console.error('Erro ao consultar transação:', error.response?.data || error.message);
    
    res.status(500).json({
      success: false,
      message: 'Erro ao consultar transação'
    });
  }
});

// Listar transações do usuário
router.get('/transactions', authenticateToken, async (req, res) => {
  try {
    const response = await axios.get(
      `${NITRO_API_URL}/transactions?api_token=${NITRO_API_TOKEN}`,
      {
        headers: {
          'Accept': 'application/json'
        }
      }
    );
    
    res.json({
      success: true,
      transactions: response.data
    });
    
  } catch (error) {
    console.error('Erro ao listar transações:', error.response?.data || error.message);
    
    res.status(500).json({
      success: false,
      message: 'Erro ao listar transações'
    });
  }
});

module.exports = router;
