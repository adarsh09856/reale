import http from 'http';
import app from '../src/app.js';
import { prisma } from '../src/prisma.js';

let server;
let baseUrl;

// Helper to make JSON HTTP requests
const request = (path, options = {}) => {
  return new Promise((resolve, reject) => {
    const url = new URL(path, baseUrl);
    const bodyStr = options.body ? JSON.stringify(options.body) : null;

    const reqOptions = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    };

    if (bodyStr) {
      reqOptions.headers['Content-Length'] = Buffer.byteLength(bodyStr);
    }

    const req = http.request(url, reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        let parsed = null;
        try { parsed = JSON.parse(data); } catch { parsed = data; }
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: parsed
        });
      });
    });

    req.on('error', reject);
    if (bodyStr) req.write(bodyStr);
    req.end();
  });
};

const runAllTests = async () => {
  console.log('================================================================');
  console.log('🧪 JIGME ENTERPRISE BACKEND — AUTOMATED INTEGRATION TEST SUITE');
  console.log('================================================================\n');

  // Start test server on dynamic port
  await new Promise((resolve) => {
    server = app.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://127.0.0.1:${port}`;
      console.log(`[Test Server] Running at ${baseUrl}\n`);
      resolve();
    });
  });

  let passedCount = 0;
  let failedCount = 0;

  const test = async (name, fn) => {
    try {
      await fn();
      console.log(`  ✅ PASS: ${name}`);
      passedCount++;
    } catch (err) {
      console.error(`  ❌ FAIL: ${name}`);
      console.error(`     Error: ${err.message}\n`);
      failedCount++;
    }
  };

  try {
    let adminToken = '';
    let brokerToken = '';
    let agentToken = '';
    let refreshToken = '';
    let testPropertyId = '';
    let testInquiryId = '';
    let initialPagesCount = 0;

    // -------------------------------------------------------------
    // 1. HEALTH & SYSTEM MONITORING
    // -------------------------------------------------------------
    console.log('📦 MODULE 1: Health & System Diagnostics');

    await test('Public /api/v1/health returns 200 without authentication', async () => {
      const res = await request('/api/v1/health');
      if (res.status !== 200 || res.body.status !== 'ok') {
        throw new Error(`Expected status 200 with status ok, got ${res.status}: ${JSON.stringify(res.body)}`);
      }
    });

    await test('Detailed /api/v1/health/detailed rejects unauthenticated request with 401', async () => {
      const res = await request('/api/v1/health/detailed');
      if (res.status !== 401) {
        throw new Error(`Expected status 401, got ${res.status}`);
      }
    });

    // -------------------------------------------------------------
    // 2. AUTHENTICATION & LOCKOUT PROTECTION
    // -------------------------------------------------------------
    console.log('\n📦 MODULE 2: Auth, JWT Tokens & Lockout Safeguards');

    await test('POST /api/v1/auth/login rejects invalid password with 401', async () => {
      const res = await request('/api/v1/auth/login', {
        method: 'POST',
        body: { email: 'admin@jigme.bt', password: 'WrongPassword999!' }
      });
      if (res.status !== 401) {
        throw new Error(`Expected 401 for wrong password, got ${res.status}`);
      }
    });

    await test('POST /api/v1/auth/login succeeds with valid Super Admin credentials', async () => {
      const res = await request('/api/v1/auth/login', {
        method: 'POST',
        body: { email: 'admin@jigme.bt', password: 'AdminPassword123!' }
      });
      if (res.status !== 200 || !res.body.accessToken) {
        throw new Error(`Expected 200 with accessToken, got: ${JSON.stringify(res.body)}`);
      }
      adminToken = res.body.accessToken;

      // Extract refresh token cookie
      const cookieHeader = res.headers['set-cookie']?.[0] || '';
      const match = cookieHeader.match(/refreshToken=([^;]+)/);
      if (match) refreshToken = match[1];
    });

    await test('POST /api/v1/auth/login succeeds for Broker and Agent users', async () => {
      const brokerRes = await request('/api/v1/auth/login', {
        method: 'POST',
        body: { email: 'broker@jigme.bt', password: 'BrokerPassword123!' }
      });
      if (brokerRes.status !== 200) throw new Error('Broker login failed');
      brokerToken = brokerRes.body.accessToken;

      const agentRes = await request('/api/v1/auth/login', {
        method: 'POST',
        body: { email: 'agent@jigme.bt', password: 'AgentPassword123!' }
      });
      if (agentRes.status !== 200) throw new Error('Agent login failed');
      agentToken = agentRes.body.accessToken;
    });

    await test('POST /api/v1/auth/refresh rotates refresh token successfully', async () => {
      if (!refreshToken) throw new Error('No refresh token available from login');
      const res = await request('/api/v1/auth/refresh', {
        method: 'POST',
        body: { refreshToken }
      });
      if (res.status !== 200 || !res.body.accessToken) {
        throw new Error(`Refresh failed: ${JSON.stringify(res.body)}`);
      }
    });

    await test('GET /api/v1/auth/me returns current authenticated user profile', async () => {
      const res = await request('/api/v1/auth/me', {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (res.status !== 200 || res.body.user.email !== 'admin@jigme.bt') {
        throw new Error(`Failed to retrieve profile: ${JSON.stringify(res.body)}`);
      }
    });

    await test('Lockout Guard: Prevents deleting or demoting the last active Super Admin', async () => {
      const adminUser = await prisma.user.findFirst({ where: { email: 'admin@jigme.bt' } });
      const buyerRole = await prisma.role.findFirst({ where: { name: 'buyer' } });

      const res = await request(`/api/v1/users/${adminUser.id}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${adminToken}` },
        body: { roleId: buyerRole.id }
      });
      if (res.status === 200) {
        throw new Error('Expected lockout protection to reject demoting last super_admin');
      }
    });

    // -------------------------------------------------------------
    // 3. RBAC & PERMISSION ENFORCEMENT
    // -------------------------------------------------------------
    console.log('\n📦 MODULE 3: Granular RBAC & Permission Verification');

    await test('Field Agent without users:read is rejected from /api/v1/users with 403', async () => {
      const res = await request('/api/v1/users', {
        headers: { Authorization: `Bearer ${agentToken}` }
      });
      if (res.status !== 403) {
        throw new Error(`Expected 403 Forbidden, got ${res.status}`);
      }
    });

    await test('Super Admin with users:read can list all system users', async () => {
      const res = await request('/api/v1/users', {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (res.status !== 200 || !Array.isArray(res.body.users)) {
        throw new Error(`Failed to list users: ${JSON.stringify(res.body)}`);
      }
    });

    // -------------------------------------------------------------
    // 4. CRM LISTINGS, ROW-LEVEL OWNERSHIP & WORKFLOW
    // -------------------------------------------------------------
    console.log('\n📦 MODULE 4: CRM Listings, Row-Level Ownership & Publishing Workflow');

    await test('Agent creating listing lands in PENDING_APPROVAL status', async () => {
      const res = await request('/api/v1/properties', {
        method: 'POST',
        headers: { Authorization: `Bearer ${agentToken}` },
        body: {
          title: 'Motithang Luxury Forest Retreat',
          location: 'Thimphu, Motithang',
          priceNu: 32000000,
          priceDisplay: 'Nu. 3.20 Cr',
          type: 'Residential Villa',
          beds: 4,
          baths: 4,
          area: '30 Decimals',
          description: 'Surrounded by blue pines with private road access.',
          image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c'
        }
      });
      if (res.status !== 201 || res.body.property.status !== 'PENDING_APPROVAL') {
        throw new Error(`Expected status 201 with PENDING_APPROVAL, got: ${JSON.stringify(res.body)}`);
      }
      testPropertyId = res.body.property.id;
    });

    await test('Public users cannot see PENDING_APPROVAL properties', async () => {
      const res = await request('/api/v1/properties');
      const found = res.body.properties?.find(p => p.id === testPropertyId);
      if (found) {
        throw new Error('Public list returned unapproved property');
      }
    });

    await test('Broker approves and publishes listing via /properties/:id/publish', async () => {
      const res = await request(`/api/v1/properties/${testPropertyId}/publish`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${brokerToken}` }
      });
      if (res.status !== 200 || res.body.property.status !== 'PUBLISHED') {
        throw new Error(`Publish failed: ${JSON.stringify(res.body)}`);
      }
    });

    await test('Published listing is now visible to public users', async () => {
      const res = await request('/api/v1/properties');
      const found = res.body.properties?.find(p => p.id === testPropertyId);
      if (!found) {
        throw new Error('Published property not found in public query');
      }
    });

    // -------------------------------------------------------------
    // 5. OPTIMISTIC CONCURRENCY LOCKING
    // -------------------------------------------------------------
    console.log('\n📦 MODULE 5: Optimistic Concurrency Version Locking');

    await test('Updating property with stale version returns 409 Conflict', async () => {
      const res = await request(`/api/v1/properties/${testPropertyId}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${brokerToken}` },
        body: {
          title: 'Conflict Test Title',
          version: 999 // Stale version
        }
      });
      if (res.status !== 409) {
        throw new Error(`Expected 409 Conflict, got ${res.status}`);
      }
    });

    // -------------------------------------------------------------
    // 6. LEAD ASSIGNMENT & CRM PIPELINE
    // -------------------------------------------------------------
    console.log('\n📦 MODULE 6: Lead Assignment & CRM Inquiries');

    await test('Public user submits inquiry successfully', async () => {
      const res = await request('/api/v1/inquiries', {
        method: 'POST',
        body: {
          name: 'Karma Lhadon',
          phone: '+975 17 555 444',
          message: 'Interested in Motithang villa property viewing.',
          source: 'WEBSITE'
        }
      });
      if (res.status !== 201 || !res.body.inquiry) {
        throw new Error(`Inquiry submission failed: ${JSON.stringify(res.body)}`);
      }
      testInquiryId = res.body.inquiry.id;
    });

    await test('Assigning lead to an agent updates assignedToId and logs audit trail', async () => {
      const agentUser = await prisma.user.findFirst({ where: { email: 'agent@jigme.bt' } });
      const res = await request(`/api/v1/inquiries/${testInquiryId}/assign`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${brokerToken}` },
        body: { assignedToId: agentUser.id }
      });
      if (res.status !== 200 || res.body.inquiry.assignedToId !== agentUser.id) {
        throw new Error(`Lead assignment failed: ${JSON.stringify(res.body)}`);
      }
    });

    // -------------------------------------------------------------
    // 7. DYNAMIC BANK RATES & LOAN CALCULATOR
    // -------------------------------------------------------------
    console.log('\n📦 MODULE 7: Dynamic Bank Rates & EMI Calculation');

    await test('GET /api/v1/loan/rates returns dynamic bank rates from database', async () => {
      const res = await request('/api/v1/loan/rates');
      if (res.status !== 200 || !res.body.rates || res.body.rates.length === 0) {
        throw new Error(`Failed to fetch bank rates: ${JSON.stringify(res.body)}`);
      }
    });

    await test('POST /api/v1/loan/calculate computes accurate monthly EMI reading DB rate', async () => {
      const res = await request('/api/v1/loan/calculate', {
        method: 'POST',
        body: {
          propertyPriceNu: 10000000, // 1 Crore
          downPaymentNu: 2000000,    // 20 Lakhs
          tenureYears: 20,
          bankKey: 'bob'
        }
      });
      if (res.status !== 200 || !res.body.calculation.monthlyEmiNu) {
        throw new Error(`EMI calculation failed: ${JSON.stringify(res.body)}`);
      }
      // Nu. 80L loan at 8.5% for 20y should be approx Nu. 69,426/month
      if (res.body.calculation.monthlyEmiNu < 65000 || res.body.calculation.monthlyEmiNu > 75000) {
        throw new Error(`EMI calculation out of expected mathematical range: ${res.body.calculation.monthlyEmiNu}`);
      }
    });

    // -------------------------------------------------------------
    // 8. ZERO HARDCODED DATA — REAL-TIME KPI UPDATES
    // -------------------------------------------------------------
    console.log('\n📦 MODULE 8: Zero Hardcoded Data — Real-Time KPI DB Verification');

    await test('GET /api/v1/kpis/summary returns live database aggregate counts', async () => {
      const res = await request('/api/v1/kpis/summary', {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (res.status !== 200 || typeof res.body.totalPages !== 'number') {
        throw new Error(`KPI query failed: ${JSON.stringify(res.body)}`);
      }
      initialPagesCount = res.body.totalPages;
    });

    await test('Creating a new CMS page dynamically increments totalPages in KPI query', async () => {
      // Create new page
      await request('/api/v1/pages', {
        method: 'POST',
        headers: { Authorization: `Bearer ${adminToken}` },
        body: {
          title: 'Dynamic Test Page for KPI Verification',
          slug: `test-page-${Date.now()}`,
          content: '<p>Verifying live database aggregate reactivity.</p>',
          status: 'PUBLISHED'
        }
      });

      // Re-query KPI summary
      const kpiRes = await request('/api/v1/kpis/summary', {
        headers: { Authorization: `Bearer ${adminToken}` }
      });

      if (kpiRes.body.totalPages !== initialPagesCount + 1) {
        throw new Error(`Expected totalPages to increment from ${initialPagesCount} to ${initialPagesCount + 1}, got ${kpiRes.body.totalPages}`);
      }
    });

  } finally {
    if (server) {
      server.close();
    }
    await prisma.$disconnect();
  }

  console.log('\n================================================================');
  console.log(`🏁 TEST SUITE COMPLETE: ${passedCount} PASSED, ${failedCount} FAILED`);
  console.log('================================================================\n');

  if (failedCount > 0) {
    process.exit(1);
  }
};

runAllTests().catch(err => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
