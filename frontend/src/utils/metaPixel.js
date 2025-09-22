// Meta Pixel ID - ID real do Borracha de Roupa
const META_PIXEL_ID = '718182514389160';

// Função para inicializar o Meta Pixel
export function initMetaPixel() {
  if (!META_PIXEL_ID || META_PIXEL_ID === 'SEU_PIXEL_ID_AQUI') {
    console.warn('⚠️ Meta Pixel ID não configurado');
    return;
  }

  // Verificar se o pixel já foi carregado
  if (window.fbq) {
    console.log('✅ Meta Pixel já carregado');
    return;
  }

  // Carregar o script do Meta Pixel
  const script = document.createElement('script');
  script.innerHTML = `
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '${META_PIXEL_ID}');
    fbq('track', 'PageView');
  `;
  
  document.head.appendChild(script);
  
  // Adicionar noscript para casos sem JavaScript
  const noscript = document.createElement('noscript');
  noscript.innerHTML = `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1" />`;
  document.head.appendChild(noscript);
  
  console.log('✅ Meta Pixel inicializado com ID:', META_PIXEL_ID);
}

// Função para rastrear eventos personalizados
export function trackEvent(eventName, parameters = {}) {
  if (window.fbq) {
    window.fbq('track', eventName, parameters);
    console.log(`🎯 Meta Pixel Event: ${eventName}`, parameters);
  } else {
    console.warn('⚠️ Meta Pixel não carregado');
  }
}

// Função para rastrear conversões
export function trackPurchase(value, currency = 'BRL', contentIds = []) {
  if (window.fbq) {
    window.fbq('track', 'Purchase', {
      value: value,
      currency: currency,
      content_ids: contentIds
    });
    console.log('💰 Meta Pixel Purchase tracked:', { value, currency, contentIds });
  } else {
    console.warn('⚠️ Meta Pixel não carregado');
  }
}

// Função para rastrear visualização de conteúdo
export function trackViewContent(contentId, contentType = 'product') {
  if (window.fbq) {
    window.fbq('track', 'ViewContent', {
      content_ids: [contentId],
      content_type: contentType
    });
    console.log('👁️ Meta Pixel ViewContent tracked:', { contentId, contentType });
  } else {
    console.warn('⚠️ Meta Pixel não carregado');
  }
}

// Função para rastrear adição ao carrinho (para VIP)
export function trackAddToCart(value, currency = 'BRL', contentId = 'vip_upgrade') {
  if (window.fbq) {
    window.fbq('track', 'AddToCart', {
      value: value,
      currency: currency,
      content_ids: [contentId]
    });
    console.log('🛒 Meta Pixel AddToCart tracked:', { value, currency, contentId });
  } else {
    console.warn('⚠️ Meta Pixel não carregado');
  }
}

// Função para rastrear início de checkout
export function trackInitiateCheckout(value, currency = 'BRL', contentIds = []) {
  if (window.fbq) {
    window.fbq('track', 'InitiateCheckout', {
      value: value,
      currency: currency,
      content_ids: contentIds
    });
    console.log('💳 Meta Pixel InitiateCheckout tracked:', { value, currency, contentIds });
  } else {
    console.warn('⚠️ Meta Pixel não carregado');
  }
}

// Função para rastrear registro
export function trackCompleteRegistration() {
  if (window.fbq) {
    window.fbq('track', 'CompleteRegistration');
    console.log('📝 Meta Pixel CompleteRegistration tracked');
  } else {
    console.warn('⚠️ Meta Pixel não carregado');
  }
}

// Função para rastrear login
export function trackLogin() {
  if (window.fbq) {
    window.fbq('track', 'Login');
    console.log('🔑 Meta Pixel Login tracked');
  } else {
    console.warn('⚠️ Meta Pixel não carregado');
  }
}

// Função para rastrear upload de imagem
export function trackUploadImage() {
  if (window.fbq) {
    window.fbq('track', 'ViewContent', {
      content_ids: ['image_upload'],
      content_type: 'product'
    });
    console.log('📸 Meta Pixel Upload Image tracked');
  } else {
    console.warn('⚠️ Meta Pixel não carregado');
  }
}
