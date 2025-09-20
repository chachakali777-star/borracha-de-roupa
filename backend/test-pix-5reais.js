const axios = require('axios');
require('dotenv').config({ path: './config.env' });

// Script para testar PIX com R$ 5,00 (que sabemos que funciona)
const testPix5Reais = async () => {
  try {
    const NITRO_API_URL = 'https://api.nitropagamentos.com/api/public/v1';
    const NITRO_API_TOKEN = process.env.NITRO_API_TOKEN;

    if (!NITRO_API_TOKEN) {
      console.error('❌ NITRO_API_TOKEN não encontrado');
      return;
    }

    console.log('🧪 Testando PIX com R$ 5,00...');

    const testData = {
      amount: 500, // R$ 5,00
      offer_hash: 'qd3cr',
      payment_method: 'pix',
      customer: {
        name: 'Teste 5 Reais',
        email: 'teste5@teste.com',
        phone_number: '(11) 99999-9999',
        document: '000.000.000-00',
        street_name: 'Digital Product',
        number: 'N/A',
        complement: '',
        neighborhood: 'Digital',
        city: 'Digital',
        state: 'SP',
        zip_code: '00000000'
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

    console.log('📤 Enviando dados de teste R$ 5,00...');

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

    console.log('📡 Resposta da Nitro Pay para R$ 5,00:');
    console.log(JSON.stringify(response.data, null, 2));

    if (response.data && response.data.success !== false) {
      const pixQrCode = response.data.pix?.pix_qr_code || response.data.pix_qr_code || response.data.qr_code || null;
      const pixUrl = response.data.pix?.pix_url || response.data.pix_url || response.data.payment_url || null;
      
      console.log('🔍 QR Code extraído:', pixQrCode);
      console.log('🔍 PIX URL extraída:', pixUrl);
      console.log('🔍 Status:', response.data.payment_status);
      
      if (pixQrCode || pixUrl) {
        console.log('✅ PIX funcionando com R$ 5,00!');
      } else {
        console.log('❌ PIX não funcionando nem com R$ 5,00!');
      }
    } else {
      console.log('❌ Erro na resposta da Nitro Pay:', response.data);
    }

  } catch (error) {
    console.error('❌ Erro:', error.response?.data || error.message);
  }
};

// Executar se chamado diretamente
if (require.main === module) {
  testPix5Reais();
}

module.exports = testPix5Reais;
