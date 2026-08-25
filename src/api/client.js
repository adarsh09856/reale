const API_BASE_URL = 'http://localhost:5000/api/v1';

class ApiClient {
  constructor() {
    this.token = localStorage.getItem('jigme_access_token') || null;
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('jigme_access_token', token);
    } else {
      localStorage.removeItem('jigme_access_token');
    }
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
      ...(options.headers || {})
    };

    const config = {
      ...options,
      headers
    };

    if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
      config.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP Error ${response.status}`);
      }

      return data;
    } catch (err) {
      console.warn(`[API Client Warning] Request to ${endpoint} failed:`, err.message);
      throw err;
    }
  }

  // --- Auth ---
  login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: { email, password }
    }).then(res => {
      if (res.accessToken) this.setToken(res.accessToken);
      return res;
    });
  }

  getMe() {
    return this.request('/auth/me');
  }

  logout() {
    this.setToken(null);
    return this.request('/auth/logout', { method: 'POST' }).catch(() => ({}));
  }

  // --- KPIs & Analytics ---
  getKpiSummary() {
    return this.request('/kpis/summary');
  }

  getDetailedHealth() {
    return this.request('/health/detailed');
  }

  getActivityLogs(limit = 10) {
    return this.request(`/activity-logs?limit=${limit}`);
  }

  getSeoOverview() {
    return this.request('/seo/overview');
  }

  getSocialConnections() {
    return this.request('/social/connections');
  }

  // --- Listings ---
  getProperties(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/properties${query ? `?${query}` : ''}`);
  }

  getVehicles(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/vehicles${query ? `?${query}` : ''}`);
  }

  // --- Bank Rates & Loan Calc ---
  getBankRates() {
    return this.request('/loan/rates');
  }

  calculateLoan(payload) {
    return this.request('/loan/calculate', {
      method: 'POST',
      body: payload
    });
  }

  // --- CMS ---
  getPages() {
    return this.request('/pages');
  }

  getMenus(name = 'main_menu') {
    return this.request(`/menus?name=${name}`);
  }

  getFaqs() {
    return this.request('/faqs');
  }

  // --- Inquiries ---
  getInquiries() {
    return this.request('/inquiries');
  }

  submitInquiry(payload) {
    return this.request('/inquiries', {
      method: 'POST',
      body: payload
    });
  }

  // --- AI ---
  generateAiPage(prompt) {
    return this.request('/ai/generate-page', {
      method: 'POST',
      body: { prompt }
    });
  }

  generateAiFaq(topic) {
    return this.request('/ai/generate-faq', {
      method: 'POST',
      body: { topic }
    });
  }
}

export const api = new ApiClient();
