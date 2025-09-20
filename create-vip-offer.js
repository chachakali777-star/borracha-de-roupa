const axios = require('axios');

// Script para criar oferta VIP na Nitro Pay
const createVipOffer = async () => {
  try {
    const NITRO_API_URL = 'https://api.nitropagamentos.com/api/public/v1';
    const NITRO_API_TOKEN = process.env.NITRO_API_TOKEN;

    if (!NITRO_API_TOKEN) {
      console.error('❌ NITRO_API_TOKEN não encontrado');
      return;
    }

    console.log('🚀 Criando oferta VIP na Nitro Pay...');

    const offerData = {
      title: 'Upgrade VIP - Borracha de Roupas',
      description: 'Acesso completo a todos os recursos premium',
      price: 4990, // R$ 49,90 em centavos
      currency: 'BRL',
      tangible: false,
      operation_type: 1
    };

    const response = await axios.post(
      `${NITRO_API_URL}/offers?api_token=${NITRO_API_TOKEN}`,
      offerData,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data && response.data.success !== false) {
      console.log('✅ Oferta VIP criada com sucesso!');
      console.log('📋 Dados da oferta:', response.data);
      console.log('🔑 Hash da oferta:', response.data.hash);
      
      // Atualizar nitro-config.json
      const fs = require('fs');
      const path = require('path');
      
      const configPath = path.join(__dirname, 'nitro-config.json');
      let config = {};
      
      try {
        config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      } catch (error) {
        console.log('📝 Criando novo arquivo de configuração...');
        config = {
          product_hash: "uwivxoxyie",
          offers: {},
          created_at: new Date().toISOString()
        };
      }
      
      // Adicionar nova oferta
      config.offers['4990'] = response.data.hash;
      config.updated_at = new Date().toISOString();
      
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
      console.log('💾 Configuração atualizada em nitro-config.json');
      
    } else {
      console.error('❌ Erro ao criar oferta:', response.data);
    }

  } catch (error) {
    console.error('❌ Erro:', error.response?.data || error.message);
  }
};

// Executar se chamado diretamente
if (require.main === module) {
  createVipOffer();
}

module.exports = createVipOffer;
