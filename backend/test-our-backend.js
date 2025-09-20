const axios = require('axios');

// Script para testar nosso próprio backend (como a página /tokens faz)
const testOurBackend = async () => {
  try {
    console.log('🧪 Testando nosso backend (como página /tokens)...');

    // Dados IDÊNTICOS ao que a página /tokens envia
    const testData = {
      amount: 500, // R$ 5,00
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

    console.log('📤 Enviando para nosso backend:', JSON.stringify(testData, null, 2));

    const response = await axios.post(
      'http://localhost:5000/api/payment/create',
      testData,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer fake-token-for-test'
        }
      }
    );

    console.log('📡 Resposta do nosso backend:');
    console.log(JSON.stringify(response.data, null, 2));

    if (response.data.success) {
      const qrCode = response.data.qr_code;
      const paymentUrl = response.data.payment_url;
      
      console.log('🔍 QR Code do backend:', qrCode ? qrCode.substring(0, 100) + '...' : 'null');
      console.log('🔍 Payment URL do backend:', paymentUrl);
      
      if (qrCode) {
        console.log('✅ SUCCESS! Nosso backend retorna QR code!');
      } else if (paymentUrl) {
        console.log('✅ SUCCESS! Nosso backend retorna payment URL!');
      } else {
        console.log('❌ FAIL! Nosso backend não retorna nada!');
      }
    } else {
      console.log('❌ FAIL! Nosso backend retorna erro:', response.data.message);
    }

  } catch (error) {
    console.error('❌ Erro:', error.response?.data || error.message);
  }
};

// Executar se chamado diretamente
if (require.main === module) {
  testOurBackend();
}

module.exports = testOurBackend;
