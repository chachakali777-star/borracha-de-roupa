const axios = require('axios');
const User = require('../models/User');

// URL do webhook.site para monitorar
const WEBHOOK_URL = 'https://webhook.site/35926974-aea8-4a50-ab57-b62ccd47a2d9';

// Função para processar webhook da Nitro Pay
async function processWebhook(webhookData) {
  try {
    console.log('🔔 Webhook recebido:', JSON.stringify(webhookData, null, 2));
    
    const { hash, payment_status, amount, customer } = webhookData;
    
    if (payment_status === 'approved') {
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
        
        return {
          success: true,
          message: `Tokens adicionados com sucesso! ${tokensToAdd} tokens creditados.`,
          tokensAdded: tokensToAdd,
          totalTokens: updatedUser.tokens
        };
      } else {
        console.log('❌ Usuário não encontrado:', customer.email);
        return {
          success: false,
          message: 'Usuário não encontrado'
        };
      }
    } else {
      console.log('⏳ Status do pagamento:', payment_status);
      return {
        success: false,
        message: `Pagamento com status: ${payment_status}`
      };
    }
  } catch (error) {
    console.error('❌ Erro ao processar webhook:', error);
    return {
      success: false,
      message: 'Erro ao processar webhook'
    };
  }
}

// Função para monitorar webhook.site (simulação)
async function monitorWebhook() {
  console.log('🔍 Monitorando webhook.site...');
  console.log('📡 URL:', WEBHOOK_URL);
  console.log('⏰ Verifique o webhook.site manualmente após fazer um pagamento');
  console.log('📋 Copie os dados do webhook e cole aqui para processar');
}

// Exportar funções
module.exports = {
  processWebhook,
  monitorWebhook
};

// Se executado diretamente
if (require.main === module) {
  monitorWebhook();
}
