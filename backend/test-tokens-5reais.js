const axios = require('axios');
require('dotenv').config({ path: './config.env' });

// Script para testar exatamente como a página /tokens faz
const testTokensLike = async () => {
  try {
    const NITRO_API_URL = 'https://api.nitropagamentos.com/api/public/v1';
    const NITRO_API_TOKEN = process.env.NITRO_API_TOKEN;

    if (!NITRO_API_TOKEN) {
      console.error('❌ NITRO_API_TOKEN não encontrado');
      return;
    }

    console.log('🧪 Testando EXATAMENTE como página /tokens...');

    // Dados IDÊNTICOS ao PaymentModal
    const testData = {
      amount: 500, // R$ 5,00 (igual ao pacote que funciona)
      payment_method: 'pix',
      customer: {
        name: 'Cliente PIX',
        email: 'teste@teste.com',
        phone_number: '(11) 99999-9999',
        document: '000.000.000-00'
      },
      cart: [{
        product_hash: 'tokens_0',
        title: '25 Tokens - Borracha de Roupas',
        cover: null,
        price: 500,
        quantity: 1,
        operation_type: 1,
        tangible: false
      }],
      installments: 1,
      expire_in_days: 1,
      postback_url: 'https://webhook.site/35926974-aea8-4a50-ab57-b62ccd47a2d9'
    };

    console.log('📤 Enviando dados IDÊNTICOS ao /tokens:', JSON.stringify(testData, null, 2));

    const response = await axios.post(
      `${NITRO_API_URL}/transactions?api_token=${NITRO_API_TOKEN}`,
      testData,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('📡 Resposta da Nitro Pay (como /tokens):');
    console.log(JSON.stringify(response.data, null, 2));

    // Verificar se consegue extrair QR code como no PaymentModal
    const pixQrCode = response.data.pix?.pix_qr_code || response.data.pix_qr_code || response.data.qr_code || null;
    const pixUrl = response.data.pix?.pix_url || response.data.pix_url || response.data.payment_url || null;
    
    console.log('🔍 QR Code extraído (como PaymentModal):', pixQrCode);
    console.log('🔍 PIX URL extraída (como PaymentModal):', pixUrl);
    console.log('🔍 Status:', response.data.payment_status);
    
    if (pixQrCode) {
      console.log('✅ SUCCESS! QR Code PIX encontrado como em /tokens!');
      console.log('📋 Código PIX:', pixQrCode.substring(0, 100) + '...');
    } else if (pixUrl) {
      console.log('✅ SUCCESS! PIX URL encontrada como em /tokens!');
      console.log('📋 URL PIX:', pixUrl);
    } else {
      console.log('❌ FAIL! Nenhum PIX encontrado (igual ao VIP)');
    }

  } catch (error) {
    console.error('❌ Erro:', error.response?.data || error.message);
  }
};

// Executar se chamado diretamente
if (require.main === module) {
  testTokensLike();
}

module.exports = testTokensLike;
