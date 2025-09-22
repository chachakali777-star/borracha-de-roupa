const express = require('express');
const axios = require('axios');
const { authenticateToken } = require('../middleware/auth');
const fs = require('fs');
const path = require('path');
const User = require('../models/User');

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

function withQuery(baseUrl, params) {
  try {
    const url = new URL(baseUrl);
    Object.entries(params || {}).forEach(([k, v]) => { if (v) url.searchParams.set(k, v); });
    return url.toString();
  } catch (e) {
    return baseUrl;
  }
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
      card,
      utm: utmFromBody
    } = req.body;

    // Coletar UTM dos headers também
    const utmFromHeaders = {
      utm_source: req.headers['x-utm-source'],
      utm_medium: req.headers['x-utm-medium'],
      utm_campaign: req.headers['x-utm-campaign'],
      utm_term: req.headers['x-utm-term'],
      utm_content: req.headers['x-utm-content'],
      referrer: req.headers['x-referrer'],
      landing_page: req.headers['x-landing-page']
    };
    const utm = Object.fromEntries(Object.entries({ ...(utmFromHeaders || {}), ...(utmFromBody || {}) }).filter(([, v]) => v));

    // Validar dados obrigatórios
    if (!amount || !payment_method || !customer || !cart) {
      return res.status(400).json({
        success: false,
        message: 'Dados obrigatórios não fornecidos'
      });
    }

    // Determinar offer_hash baseado no valor
    let offerHash = 'qd3cr'; // Hash padrão
    const valueInCents = parseInt(amount);
    console.log('💰 Valor recebido:', valueInCents, 'centavos');

    // Para VIP (R$ 49,90), usar o mesmo hash que funciona para R$ 100,00
    // A Nitro Pay vai processar o valor correto independente do offer_hash
    if (valueInCents === 4990) {
      offerHash = 'qd3cr'; // Usar hash padrão que sabemos que funciona
      console.log('👑 Pagamento VIP detectado, usando hash padrão');
    } else if (nitroConfig && nitroConfig.offers) {
      // Mapear valor para tokens e encontrar offer_hash correspondente
      // Pacotes atuais
      if (valueInCents === 2000) offerHash = nitroConfig.offers['50'];      // R$ 20,00 = 50 tokens
      else if (valueInCents === 5000) offerHash = nitroConfig.offers['375']; // R$ 50,00 = 375 tokens
      else if (valueInCents === 7500) offerHash = nitroConfig.offers['500']; // R$ 75,00 = 500 tokens
      else if (valueInCents === 18000) offerHash = nitroConfig.offers['2000']; // R$ 180,00 = 2000 tokens
      // Pacotes antigos (manter para compatibilidade)
      else if (valueInCents === 500) offerHash = nitroConfig.offers['30'];      // R$ 5,00 = 25 tokens
      else if (valueInCents === 1000) offerHash = nitroConfig.offers['30']; // R$ 10,00 = 100 tokens
      else if (valueInCents === 3000) offerHash = nitroConfig.offers['230']; // R$ 30,00 = 500 tokens
      else if (valueInCents === 6000) offerHash = nitroConfig.offers['470']; // R$ 60,00 = 1000 tokens
      else if (valueInCents === 10000) offerHash = nitroConfig.offers['1000']; // R$ 100,00 = 2000 tokens
    }

    console.log('🎯 Offer Hash selecionado:', offerHash);

    const defaultWebhook = `https://borracharoupa.fun/api/payment/webhook`;
    const webhookWithUtm = withQuery(postback_url || defaultWebhook, utm);

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
      postback_url: webhookWithUtm
    };

    console.log('📤 Dados enviados para Nitro Pay:', JSON.stringify(nitroData, null, 2));

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
    console.log('📡 Resposta completa da Nitro Pay:', JSON.stringify(response.data, null, 2));

    if (response.data && response.data.success !== false) {
      // Extrair dados do boleto (fallback para PIX)
      const billetUrl = response.data.billet?.billet_url || response.data.billet_url || null;
      const billetBarcode = response.data.billet?.billet_barcode || response.data.billet_barcode || null;

      // Extrair dados do PIX (se funcionar)
      const pixQrCode = response.data.pix?.pix_qr_code || response.data.pix_qr_code || response.data.qr_code || null;
      const pixUrl = response.data.pix?.pix_url || response.data.pix_url || response.data.payment_url || null;

      console.log('🔍 Boleto URL extraída:', billetUrl);
      console.log('🔍 Boleto código de barras:', billetBarcode);
      console.log('🔍 QR Code PIX extraído:', pixQrCode);
      console.log('🔍 PIX URL extraída:', pixUrl);
      console.log('🔍 Status do pagamento:', response.data.payment_status);

      const transactionData = {
        hash: response.data.hash,
        status: response.data.payment_status,
        amount: response.data.amount,
        payment_method: response.data.payment_method,
        qr_code: pixQrCode,
        payment_url: pixUrl,
        billet_url: billetUrl,
        billet_barcode: billetBarcode,
        created_at: response.data.created_at,
        utm
      };

      // Verificar se temos boleto ou PIX
      if (billetUrl || pixQrCode || pixUrl) {
        res.json({
          success: true,
          message: 'Transação criada com sucesso',
          transaction: transactionData,
          payment_url: pixUrl || billetUrl,
          qr_code: pixQrCode,
          billet_url: billetUrl,
          billet_barcode: billetBarcode
        });
      } else {
        console.log('⚠️ Nenhum método de pagamento encontrado na resposta');
        res.json({
          success: false,
          message: 'Nenhum método de pagamento foi gerado pela Nitro Pay',
          transaction: transactionData
        });
      }
    } else {
      console.log('❌ Erro na resposta da Nitro Pay:', response.data);
      res.json({
        success: false,
        message: response.data.message || 'Erro ao criar transação',
        details: response.data
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

    const utm = {
      utm_source: req.query.utm_source,
      utm_medium: req.query.utm_medium,
      utm_campaign: req.query.utm_campaign,
      utm_term: req.query.utm_term,
      utm_content: req.query.utm_content,
      referrer: req.query.referrer,
      landing_page: req.query.landing_page
    };
    console.log('🔍 UTM no webhook:', utm);
    console.log('🔍 Query params recebidos:', req.query);
    console.log('🔍 Headers recebidos:', req.headers);

    // Extrair dados no formato correto da Nitro Pay
    console.log('🔍 DEBUG - req.body.hash:', req.body.hash);
    console.log('🔍 DEBUG - req.body.payment_status:', req.body.payment_status);
    console.log('🔍 DEBUG - req.body.amount:', req.body.amount);
    console.log('🔍 DEBUG - req.body.customer:', req.body.customer);

    const hash = req.body.hash;
    const payment_status = req.body.payment_status;
    const amount = req.body.amount;
    const customer = req.body.customer;

    console.log('Dados extraídos:', { hash, payment_status, amount, customer });

    // Processar pagamento aprovado
    if (payment_status === 'paid') {
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

          if (amountInReais === 20) tokensToAdd = 50;
          else if (amountInReais === 50) tokensToAdd = 375;
          else if (amountInReais === 75) tokensToAdd = 500;
          else if (amountInReais === 180) tokensToAdd = 2000;
          else {
            // Fallback: 1 token = R$ 0,33
            tokensToAdd = Math.floor(amountInReais / 0.33);
          }

          console.log('🎯 Tokens a adicionar:', tokensToAdd);
          console.log('📊 Tokens atuais do usuário:', user.tokens);

          // Atualizar tokens do usuário
          const updatedUser = User.updateTokens(user.id, user.tokens + tokensToAdd);

          console.log(`✅ SUCESSO! Usuário ${user.email} recebeu ${tokensToAdd} tokens. Total: ${updatedUser.tokens}`);

          // Registrar UTM no histórico
          try {
            User.addToHistory(user.id, 'utm_conversion', `Conversão com UTM: ${JSON.stringify(utm)}`);
          } catch (e) {
            console.error('Erro ao salvar UTM no histórico', e);
          }
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

    const hash = webhookData.hash || webhookData.token;
    const payment_status = webhookData.payment_status || webhookData.status;
    const amount = webhookData.amount || webhookData.transaction?.amount;
    const customer = webhookData.customer;

    console.log('🔍 Debug - payment_status:', payment_status);
    console.log('🔍 Debug - amount:', amount);
    console.log('🔍 Debug - customer:', customer);

    console.log('🔍 Comparando payment_status:', payment_status, 'com "paid":', payment_status === 'paid');

    if (payment_status === 'paid') {
      console.log('✅ Pagamento aprovado, processando tokens...');

      // Buscar usuário pelo email
      const user = User.findByEmail(customer.email);
      if (user) {
        console.log('👤 Usuário encontrado:', user.email);

        // Calcular tokens baseado no valor pago
        let tokensToAdd = 0;
        const amountInReais = amount / 100;

        console.log('💰 Valor pago:', amountInReais, 'reais');

        if (amountInReais === 20) tokensToAdd = 50;      // Novo pacote
        else if (amountInReais === 50) tokensToAdd = 375;
        else if (amountInReais === 75) tokensToAdd = 500;
        else if (amountInReais === 180) tokensToAdd = 2000;
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