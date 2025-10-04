const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../config.env') });

const NITRO_API_URL = 'https://api.nitropagamentos.com/api/public/v1';
const NITRO_API_TOKEN = process.env.NITRO_API_TOKEN;
const PRODUCT_HASH = 'uwivxoxyie'; // Hash do produto existente

// Pacotes de tokens atuais
const tokenPackages = [
  { tokens: 50, price: 20.00, title: '50 Tokens - Borracha de Roupas' },
  { tokens: 375, price: 50.00, title: '375 Tokens - Borracha de Roupas' },
  { tokens: 500, price: 75.00, title: '500 Tokens - Borracha de Roupas' },
  { tokens: 2000, price: 180.00, title: '2000 Tokens - Borracha de Roupas' }
];

async function createOffers() {
  try {
    if (!NITRO_API_TOKEN) {
      console.error('❌ NITRO_API_TOKEN não encontrado no config.env');
      return;
    }

    console.log('🚀 Criando ofertas na Nitro Pay...\n');

    const offers = {};
    
    for (const pkg of tokenPackages) {
      try {
        const offerData = {
          title: pkg.title,
          cover: 'https://borracharoupa.fun/img/logo.png',
          amount: Math.round(pkg.price * 100) // Converter para centavos
        };

        console.log(`📦 Criando oferta: ${pkg.title} (R$ ${pkg.price.toFixed(2)})...`);
        
        const response = await axios.post(
          `${NITRO_API_URL}/products/${PRODUCT_HASH}/offers?api_token=${NITRO_API_TOKEN}`,
          offerData,
          {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.data && response.data.hash) {
          offers[pkg.tokens.toString()] = response.data.hash;
          console.log(`✅ Oferta criada: ${pkg.tokens} tokens → Hash: ${response.data.hash}`);
        } else {
          console.log(`⚠️ Resposta inesperada para ${pkg.title}:`, response.data);
        }

        // Aguardar 1 segundo entre requests para evitar rate limit
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (error) {
        if (error.response?.status === 409 || error.response?.data?.message?.includes('já existe')) {
          console.log(`⚠️ Oferta para ${pkg.title} já existe, pulando...`);
        } else {
          console.error(`❌ Erro ao criar oferta para ${pkg.title}:`, 
            error.response?.data || error.message);
        }
      }
    }

    // Adicionar ofertas antigas para compatibilidade
    const existingConfig = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../nitro-config.json'), 'utf8')
    );
    
    const finalOffers = {
      ...existingConfig.offers, // Manter ofertas antigas
      ...offers // Adicionar novas ofertas
    };

    // Salvar configuração atualizada
    const configData = {
      product_hash: PRODUCT_HASH,
      offers: finalOffers,
      created_at: existingConfig.created_at,
      updated_at: new Date().toISOString()
    };

    fs.writeFileSync(
      path.join(__dirname, '../nitro-config.json'),
      JSON.stringify(configData, null, 2)
    );

    console.log('\n✅ Configuração atualizada em nitro-config.json');
    console.log('\n📋 Ofertas registradas:');
    console.log(JSON.stringify(finalOffers, null, 2));

  } catch (error) {
    console.error('❌ Erro ao criar ofertas:', error.message);
    throw error;
  }
}

// Executar
createOffers()
  .then(() => {
    console.log('\n🎉 Processo concluído!');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Processo falhou:', error);
    process.exit(1);
  });

