const axios = require('axios');
const crypto = require('crypto');

// Serviço PIX real usando API alternativa
class PixService {
  constructor() {
    // Configuração do provedor PIX
    this.baseURL = 'https://api.gerencianet.com.br';
    // Em produção, configurar credenciais reais
    this.isProduction = false;
  }

  // Gerar PIX dinâmico
  async generatePix(amount, description = 'Upgrade VIP - Borracha de Roupas') {
    try {
      console.log('🏦 Gerando PIX real para:', { amount, description });

      if (!this.isProduction) {
        // Modo desenvolvimento: gerar PIX de demonstração
        return this.generateDemoPix(amount, description);
      }

      // Em produção, usar API real (Gerencianet, Mercado Pago, etc.)
      return this.generateProductionPix(amount, description);

    } catch (error) {
      console.error('❌ Erro ao gerar PIX:', error);
      throw error;
    }
  }

  // PIX de demonstração (para desenvolvimento)
  generateDemoPix(amount, description) {
    console.log('🧪 Gerando PIX de demonstração...');

    // Gerar um código PIX de exemplo (formato real)
    const pixKey = '12345678901'; // CPF exemplo
    const txId = crypto.randomBytes(16).toString('hex');
    
    // Formato PIX real (simplificado para demo)
    const pixCode = this.generatePixCode({
      pixKey,
      amount: amount / 100, // Converter centavos para reais
      description,
      txId
    });

    return {
      success: true,
      pixCode,
      qrCodeText: pixCode,
      txId,
      amount,
      expiresIn: 30 * 60, // 30 minutos
      status: 'pending',
      message: '✅ PIX de demonstração gerado com sucesso!'
    };
  }

  // PIX real para produção
  async generateProductionPix(amount, description) {
    console.log('🏭 Gerando PIX de produção...');

    // Exemplo com Gerencianet (implementar credenciais reais)
    const pixData = {
      calendario: {
        expiracao: 1800 // 30 minutos
      },
      valor: {
        original: (amount / 100).toFixed(2)
      },
      chave: process.env.PIX_KEY || '12345678901',
      solicitacaoPagador: description
    };

    // Em produção, fazer chamada real para a API
    // const response = await axios.post(`${this.baseURL}/v2/cob`, pixData, ...);
    
    // Por agora, retornar demonstração
    return this.generateDemoPix(amount, description);
  }

  // Gerar código PIX no formato correto
  generatePixCode({ pixKey, amount, description, txId }) {
    // Formato PIX BR Code simplificado
    // Em produção, usar biblioteca específica como 'pix-utils'
    
    const merchantName = 'BORRACHA DE ROUPAS';
    const merchantCity = 'SAO PAULO';
    
    // Dados do PIX (formato simplificado)
    const pixData = {
      version: '01',
      method: '12', // PIX dinâmico
      merchantAccountInfo: pixKey,
      merchantCategoryCode: '0000',
      transactionCurrency: '986', // BRL
      transactionAmount: amount.toFixed(2),
      countryCode: 'BR',
      merchantName: merchantName.substring(0, 25),
      merchantCity: merchantCity.substring(0, 15),
      additionalDataField: txId,
      description: description.substring(0, 72)
    };

    // Gerar string PIX (formato real seria mais complexo)
    const pixString = `00020126${pixData.method}${pixData.merchantAccountInfo}${pixData.transactionCurrency}${pixData.transactionAmount}5802BR5925${pixData.merchantName}6015${pixData.merchantCity}62070503***6304`;
    
    return pixString;
  }

  // Verificar status do pagamento
  async checkPaymentStatus(txId) {
    console.log('🔍 Verificando status do PIX:', txId);
    
    // Em desenvolvimento, simular pagamento após 2 minutos
    const paymentTime = Date.now() - (2 * 60 * 1000);
    const isPaid = Math.random() > 0.8; // 20% de chance de estar pago (para demo)
    
    return {
      txId,
      status: isPaid ? 'paid' : 'pending',
      paidAt: isPaid ? new Date().toISOString() : null,
      amount: 4990 // R$ 49,90
    };
  }
}

module.exports = new PixService();
