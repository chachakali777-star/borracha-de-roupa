export function parseUTMFromURL() {
  const params = new URLSearchParams(window.location.search);
  const utm = {
    utm_source: params.get('utm_source') || '',
    utm_medium: params.get('utm_medium') || '',
    utm_campaign: params.get('utm_campaign') || '',
    utm_term: params.get('utm_term') || '',
    utm_content: params.get('utm_content') || '',
    referrer: document.referrer || '',
    landing_page: window.location.href
  };
  
  // Debug log
  console.log('🔍 UTM parseUTMFromURL:', utm);
  console.log('🌐 URL atual:', window.location.href);
  console.log('🔍 Search params:', window.location.search);
  
  return utm;
}

export function loadUTM() {
  try {
    const utm = JSON.parse(localStorage.getItem('utm_data') || '{}');
    console.log('🔍 UTM loadUTM:', utm);
    return utm;
  } catch (e) {
    console.error('❌ Erro ao carregar UTM:', e);
    return {};
  }
}

export function saveUTM(utm) {
  try {
    localStorage.setItem('utm_data', JSON.stringify(utm));
    console.log('✅ UTM salvo:', utm);
  } catch (e) {
    console.error('❌ Erro ao salvar UTM:', e);
  }
}

export function initUTMTracking() {
  console.log('🚀 Iniciando UTM tracking...');
  const fromURL = parseUTMFromURL();
  const existing = loadUTM();
  const merged = { ...existing };
  
  Object.entries(fromURL).forEach(([key, value]) => {
    if (value) {
      merged[key] = value;
      console.log(`✅ UTM ${key}: ${value}`);
    }
  });
  
  saveUTM(merged);
  console.log('🎯 UTM final:', merged);
}

// Nova função para debug
export function debugUTM() {
  console.log('=== UTM DEBUG ===');
  console.log('URL atual:', window.location.href);
  console.log('Referrer:', document.referrer);
  console.log('UTM no localStorage:', loadUTM());
  console.log('UTM da URL:', parseUTMFromURL());
}

// Função para rastrear conversão UTMify
export function trackConversion(transactionData) {
  console.log('🎯 Tentando rastrear conversão UTMify...');
  console.log('Transaction data:', transactionData);
  
  if (window.utmify && window.utmify.track) {
    const conversionData = {
      value: transactionData.amount / 100, // Converter de centavos para reais
      currency: 'BRL',
      order_id: transactionData.hash || transactionData.id || `order_${Date.now()}`
    };
    
    window.utmify.track('conversion', conversionData);
    console.log('✅ UTMify conversion tracked:', conversionData);
  } else {
    console.warn('⚠️ UTMify não carregado ou função track não encontrada');
    console.log('window.utmify:', window.utmify);
  }
}
