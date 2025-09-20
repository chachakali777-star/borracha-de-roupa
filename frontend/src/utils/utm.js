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
  return utm;
}

export function loadUTM() {
  try {
    return JSON.parse(localStorage.getItem('utm_data') || '{}');
  } catch (e) {
    return {};
  }
}

export function saveUTM(utm) {
  localStorage.setItem('utm_data', JSON.stringify(utm));
}

export function initUTMTracking() {
  const fromURL = parseUTMFromURL();
  const existing = loadUTM();
  const merged = { ...existing };
  Object.entries(fromURL).forEach(([key, value]) => {
    if (value) merged[key] = value;
  });
  saveUTM(merged);
}
