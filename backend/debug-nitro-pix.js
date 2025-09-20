const axios = require('axios');
require('dotenv').config({ path: './config.env' });

// Debug completo da API Nitro Pay
const debugNitroPay = async () => {
  try {
    console.log('🔍 DEBUG COMPLETO NITRO PAY API');
    console.log('=====================================');
    
    const NITRO_API_URL = 'https://api.nitropagamentos.com/api/public/v1';
    const NITRO_API_TOKEN = process.env.NITRO_API_TOKEN;

    if (!NITRO_API_TOKEN) {
      console.error('❌ NITRO_API_TOKEN não encontrado');
      return;
    }

    console.log('🔑 Token:', NITRO_API_TOKEN.substring(0, 10) + '...');
    console.log('🌐 URL:', NITRO_API_URL);

    // Teste 1: Transação PIX simples (como documentação)
    console.log('\n📋 TESTE 1: PIX Simples');
    console.log('------------------------');
    
    const pixData = {
      amount: 4990, // R$ 49,90
      payment_method: 'pix',
      customer: {
        name: 'Cliente Teste',
        email: 'teste@borracharoupa.fun',
        phone_number: '11999999999',
        document: '12345678901'
      }
    };

    console.log('📤 Enviando:', JSON.stringify(pixData, null, 2));

    try {
      const response1 = await axios.post(
        `${NITRO_API_URL}/transactions?api_token=${NITRO_API_TOKEN}`,
        pixData,
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('📡 RESPOSTA TESTE 1:');
      console.log(JSON.stringify(response1.data, null, 2));
      
      // Verificar todos os campos possíveis de PIX
      const checkFields = [
        'pix_qr_code', 'qr_code', 'pix_code', 'payment_code',
        'pix_url', 'payment_url', 'checkout_url',
        'pix.pix_qr_code', 'pix.qr_code', 'pix.payment_url'
      ];
      
      console.log('\n🔍 Verificando campos PIX:');
      checkFields.forEach(field => {
        const value = field.includes('.') 
          ? response1.data[field.split('.')[0]]?.[field.split('.')[1]]
          : response1.data[field];
        console.log(`  ${field}: ${value || 'null'}`);
      });
      
    } catch (error1) {
      console.log('❌ ERRO TESTE 1:', error1.response?.data || error1.message);
    }

    // Teste 2: Com offer_hash válido
    console.log('\n📋 TESTE 2: Com Offer Hash');
    console.log('---------------------------');
    
    const pixDataWithOffer = {
      amount: 4990,
      payment_method: 'pix',
      offer_hash: 'qd3cr', // Hash que sabemos que existe
      customer: {
        name: 'Cliente Teste',
        email: 'teste@borracharoupa.fun',
        phone_number: '11999999999',
        document: '12345678901'
      },
      cart: [{
        product_hash: 'vip_upgrade',
        title: 'Upgrade VIP - Borracha de Roupas',
        price: 4990,
        quantity: 1,
        operation_type: 1,
        tangible: false
      }],
      installments: 1,
      expire_in_days: 1
    };

    console.log('📤 Enviando:', JSON.stringify(pixDataWithOffer, null, 2));

    try {
      const response2 = await axios.post(
        `${NITRO_API_URL}/transactions?api_token=${NITRO_API_TOKEN}`,
        pixDataWithOffer,
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('📡 RESPOSTA TESTE 2:');
      console.log(JSON.stringify(response2.data, null, 2));
      
      // Verificar se agora tem PIX
      const pixQrCode = response2.data.pix?.pix_qr_code || response2.data.pix_qr_code || response2.data.qr_code;
      const pixUrl = response2.data.pix?.pix_url || response2.data.pix_url || response2.data.payment_url;
      
      console.log('\n🎯 RESULTADO FINAL:');
      console.log('PIX QR Code:', pixQrCode ? 'ENCONTRADO ✅' : 'NÃO ENCONTRADO ❌');
      console.log('PIX URL:', pixUrl ? 'ENCONTRADO ✅' : 'NÃO ENCONTRADO ❌');
      
      if (pixQrCode) {
        console.log('🎉 SUCCESS! QR Code PIX real encontrado!');
        console.log('📋 Código:', pixQrCode.substring(0, 100) + '...');
      } else if (pixUrl) {
        console.log('🎉 SUCCESS! URL PIX encontrada!');
        console.log('📋 URL:', pixUrl);
      } else {
        console.log('❌ FAIL! Nenhum código PIX retornado pela API');
        console.log('💡 Possível causa: PIX desabilitado na conta Nitro Pay');
      }
      
    } catch (error2) {
      console.log('❌ ERRO TESTE 2:', error2.response?.data || error2.message);
    }

    // Teste 3: Forçar método billet para comparar
    console.log('\n📋 TESTE 3: Boleto (para comparar)');
    console.log('----------------------------------');
    
    const billetData = {
      amount: 4990,
      payment_method: 'billet',
      offer_hash: 'qd3cr',
      customer: {
        name: 'Cliente Teste',
        email: 'teste@borracharoupa.fun',
        phone_number: '11999999999',
        document: '12345678901'
      },
      cart: [{
        product_hash: 'vip_upgrade',
        title: 'Upgrade VIP - Borracha de Roupas',
        price: 4990,
        quantity: 1,
        operation_type: 1,
        tangible: false
      }],
      installments: 1,
      expire_in_days: 7
    };

    try {
      const response3 = await axios.post(
        `${NITRO_API_URL}/transactions?api_token=${NITRO_API_TOKEN}`,
        billetData,
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('📡 RESPOSTA TESTE 3 (Boleto):');
      console.log(JSON.stringify(response3.data, null, 2));
      
      const billetUrl = response3.data.billet?.billet_url || response3.data.billet_url;
      const billetBarcode = response3.data.billet?.billet_barcode || response3.data.billet_barcode;
      
      console.log('\n📋 Boleto funcionou?');
      console.log('URL:', billetUrl ? 'SIM ✅' : 'NÃO ❌');
      console.log('Código:', billetBarcode ? 'SIM ✅' : 'NÃO ❌');
      
    } catch (error3) {
      console.log('❌ ERRO TESTE 3:', error3.response?.data || error3.message);
    }

  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
};

// Executar se chamado diretamente
if (require.main === module) {
  debugNitroPay();
}

module.exports = debugNitroPay;
