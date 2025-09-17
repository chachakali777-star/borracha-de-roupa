import React, { useState, useEffect, useCallback } from 'react';
import QRCode from 'qrcode';
import api from '../services/api';

const PaymentModal = ({ isOpen, onClose, packageData, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [pixData, setPixData] = useState(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('pending');

  // Dados do cliente
  const [customerData, setCustomerData] = useState({
    name: 'Cliente PIX', // Nome padrão para PIX
    email: '',
    phone_number: '(11) 99999-9999', // Telefone padrão para PIX
    document: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const paymentData = {
        amount: Math.round(packageData.price * 100), // Converter para centavos
        payment_method: 'pix',
        customer: customerData,
        cart: [{
          product_hash: `tokens_${packageData.id}`,
          title: `${packageData.tokens} Tokens - Borracha de Roupas`,
          cover: null,
          price: Math.round(packageData.price * 100),
          quantity: 1,
          operation_type: 1,
          tangible: false
        }],
        installments: 1,
        expire_in_days: 1,
        postback_url: `https://webhook.site/35926974-aea8-4a50-ab57-b62ccd47a2d9`
      };

      // PIX não precisa de dados de cartão

      const response = await api.post('/payment/create', paymentData);
      
      if (response.data.success) {
        // Salvar dados do PIX e gerar QR Code
        console.log('Dados do PIX recebidos:', response.data);
        setPixData(response.data.transaction);
        setPaymentStatus('pending');
        
        if (response.data.qr_code) {
          console.log('QR Code encontrado:', response.data.qr_code);
          await generateQRCode(response.data.qr_code);
          setMessage('✅ PIX gerado! Escaneie o QR Code ou copie o código para pagar.');
        } else if (response.data.payment_url) {
          console.log('Payment URL encontrada:', response.data.payment_url);
          setMessage('✅ PIX gerado! Acesse o link para pagar.');
        } else {
          console.log('Nenhum QR Code ou URL encontrado');
          setMessage('✅ PIX gerado! Verifique os dados da transação.');
        }
      } else {
        setMessage(`❌ ${response.data.message}`);
      }

    } catch (error) {
      setMessage(`❌ ${error.response?.data?.message || 'Erro ao processar pagamento'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setCustomerData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Gerar QR Code do PIX
  const generateQRCode = async (pixCode) => {
    try {
      const qrCodeDataUrl = await QRCode.toDataURL(pixCode, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      setQrCodeDataUrl(qrCodeDataUrl);
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error);
    }
  };

  // Verificar status do pagamento PIX
  const checkPaymentStatus = useCallback(async (transactionHash) => {
    try {
      const response = await api.get(`/payment/status/${transactionHash}`);
      if (response.data.success) {
        const status = response.data.transaction.status;
        setPaymentStatus(status);
        
        if (status === 'approved') {
          onSuccess(response.data.transaction);
          setMessage('✅ Pagamento aprovado! Tokens creditados na sua conta.');
          setTimeout(() => {
            onClose();
            setMessage('');
          }, 3000);
        } else if (status === 'cancelled' || status === 'failed') {
          setMessage('❌ Pagamento cancelado ou falhou. Tente novamente.');
        }
      }
    } catch (error) {
      console.error('Erro ao verificar status:', error);
    }
  }, [onSuccess, onClose]);


  // Polling para verificar status do PIX
  useEffect(() => {
    let interval;
    if (pixData && pixData.hash && paymentStatus === 'pending') {
      interval = setInterval(() => {
        checkPaymentStatus(pixData.hash);
      }, 3000); // Verificar a cada 3 segundos
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [pixData, paymentStatus, checkPaymentStatus]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Finalizar Compra
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Resumo do pedido */}
          <div className="bg-pink-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-2">Resumo do Pedido</h3>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">
                {packageData.tokens} tokens
              </span>
              <span className="text-xl font-bold text-pink-600">
                R$ {packageData.price.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Mensagem de feedback */}
          {message && (
            <div className={`mb-4 p-3 rounded-lg text-center font-medium ${
              message.includes('✅') 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {message}
            </div>
          )}

          {/* QR Code do PIX */}
          {pixData && qrCodeDataUrl && (
            <div className="mb-6 p-6 bg-pink-50 rounded-lg text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Escaneie o QR Code com seu app de pagamento
              </h3>
              <div className="flex justify-center mb-4">
                <img 
                  src={qrCodeDataUrl} 
                  alt="QR Code PIX" 
                  className="border-2 border-pink-200 rounded-lg"
                />
              </div>
              <div className="text-sm text-gray-600 mb-4">
                Ou copie o código PIX:
              </div>
              <div className="bg-white p-3 rounded-lg border border-pink-200 mb-4">
                <code className="text-xs break-all text-gray-800">
                  {pixData.qr_code || pixData.payment_url}
                </code>
              </div>
              <div className="flex items-center justify-center text-sm text-gray-600 mb-4">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-pink-500 mr-2"></div>
                Aguardando pagamento...
              </div>
              
            </div>
          )}

          {/* Método de pagamento - apenas PIX */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Método de Pagamento
            </h3>
            <div className="flex justify-center">
              <div className="p-4 border-2 border-pink-500 bg-pink-50 text-pink-700 rounded-lg text-center max-w-xs">
                <div className="text-2xl mb-2">📱</div>
                <div className="font-medium">PIX</div>
                <div className="text-sm text-gray-600">Aprovação instantânea</div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Dados do cliente */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Dados Pessoais
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={customerData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="seu@email.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CPF *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerData.document}
                    onChange={(e) => handleInputChange('document', e.target.value)}
                    placeholder="000.000.000-00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>



            {/* Botões */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-pink-500 hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                {loading ? 'Processando...' : `Pagar R$ ${packageData.price.toFixed(2)}`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
