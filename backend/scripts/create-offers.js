const axios = require('axios');
require('dotenv').config({ path: './config.env' });

const NITRO_API_URL = 'https://api.nitropagamentos.com/api/public/v1';
const NITRO_API_TOKEN = process.env.NITRO_API_TOKEN;

// Primeiro, vamos criar um produto para os tokens
async function createProduct() {
  try {
    const productData = {
      title: 'Tokens - Borracha de Roupas',
      cover: 'https://via.placeholder.com/300x300/FF69B4/FFFFFF?text=Tokens',
      sale_page: 'https://borracha-de-roupas.com',
      payment_type: 1, // Pagamento Único
      product_type: 'digital',
      delivery_type: 1, // Área da membros da plataforma
      id_category: 1, // Categoria padrão
      amount: 1000 // Valor em centavos (será sobrescrito pelas ofertas)
    };

    console.log('Criando produto...');
    const response = await axios.post(
      `${NITRO_API_URL}/products?api_token=${NITRO_API_TOKEN}`,
      productData,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Produto criado:', response.data);
    return response.data.hash;
  } catch (error) {
    console.error('Erro ao criar produto:', error.response?.data || error.message);
    throw error;
  }
}

// Criar ofertas para cada pacote de tokens
async function createOffers(productHash) {
  const packages = [
    { tokens: 30, price: 10.00, title: '30 Tokens' },
    { tokens: 230, price: 30.00, title: '230 Tokens' },
    { tokens: 470, price: 60.00, title: '470 Tokens' },
    { tokens: 1000, price: 100.00, title: '1000 Tokens' }
  ];

  const offers = {};

  for (const pkg of packages) {
    try {
      const offerData = {
        title: `${pkg.title} - Borracha de Roupas`,
        cover: 'https://via.placeholder.com/300x300/FF69B4/FFFFFF?text=Tokens',
        amount: Math.round(pkg.price * 100) // Converter para centavos
      };

      console.log(`Criando oferta para ${pkg.title}...`);
      const response = await axios.post(
        `${NITRO_API_URL}/products/${productHash}/offers?api_token=${NITRO_API_TOKEN}`,
        offerData,
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );

      offers[pkg.tokens] = response.data.hash;
      console.log(`Oferta criada para ${pkg.title}:`, response.data.hash);
    } catch (error) {
      console.error(`Erro ao criar oferta para ${pkg.title}:`, error.response?.data || error.message);
    }
  }

  return offers;
}

// Função principal
async function main() {
  try {
    console.log('Iniciando criação de produto e ofertas...');
    
    // Criar produto
    const productHash = await createProduct();
    console.log('Hash do produto:', productHash);
    
    // Criar ofertas
    const offers = await createOffers(productHash);
    console.log('Ofertas criadas:', offers);
    
    // Salvar hashes em um arquivo para uso posterior
    const fs = require('fs');
    const config = {
      product_hash: productHash,
      offers: offers,
      created_at: new Date().toISOString()
    };
    
    fs.writeFileSync('./nitro-config.json', JSON.stringify(config, null, 2));
    console.log('Configuração salva em nitro-config.json');
    
  } catch (error) {
    console.error('Erro geral:', error);
  }
}

main();
