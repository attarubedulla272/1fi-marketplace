const http = require('http');
const assert = require('assert');

const BASE_URL = 'http://localhost:5000';

function get(path) {
  return new Promise((resolve, reject) => {
    http.get(`${BASE_URL}${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let json = null;
        try {
          json = JSON.parse(data);
        } catch (e) {
          // might be image or text
        }
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: json || data
        });
      });
    }).on('error', reject);
  });
}

async function runTests() {
  console.log('🧪 Running 1Fi Marketplace Backend & API Tests...\n');
  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ FAIL: ${name}`);
      console.error(`     ${err.message}`);
      failed++;
    }
  }

  // 1. Health Check
  await test('GET /api/health should return status ok', async () => {
    const res = await get('/api/health');
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.data.status, 'ok');
  });

  // 2. Products List
  let products = [];
  await test('GET /api/products should return list of products', async () => {
    const res = await get('/api/products');
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.data.success, true);
    assert.ok(Array.isArray(res.data.data));
    assert.ok(res.data.data.length >= 3, 'Should have at least 3 products');
    products = res.data.data;
  });

  // 3. Product Summary Schema
  await test('Products should have valid summary fields (startingPrice, startingEMI, image, etc.)', async () => {
    for (const p of products) {
      assert.ok(p.name, 'Product must have name');
      assert.ok(p.slug, 'Product must have slug');
      assert.ok(p.brand, 'Product must have brand');
      assert.ok(typeof p.startingPrice === 'number' && p.startingPrice > 0, 'startingPrice must be positive');
      assert.ok(typeof p.startingEMI === 'number' && p.startingEMI > 0, 'startingEMI must be positive');
      assert.ok(p.image, 'Product must have primary image');
    }
  });

  // 4. Product Detail
  let detail = null;
  await test('GET /api/products/:slug should return complete product with variants & EMI plans', async () => {
    const slug = products[0].slug;
    const res = await get(`/api/products/${slug}`);
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.data.success, true);
    detail = res.data.data;
    assert.strictEqual(detail.slug, slug);
    assert.ok(Array.isArray(detail.variants) && detail.variants.length > 0, 'Must have variants');
    assert.ok(Array.isArray(detail.emiPlans) && detail.emiPlans.length > 0, 'Must have EMI plans');
  });

  // 4b. Product Detail by MongoDB ObjectId
  await test('GET /api/products/:id should return product when queried by MongoDB ObjectId', async () => {
    const id = products[0]._id;
    const res = await get(`/api/products/${id}`);
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.data._id, id);
    assert.strictEqual(res.data.data.name, products[0].name);
  });

  // 5. Variants Verification
  await test('Variants must have color, storage, mrp, price, inStock', async () => {
    for (const v of detail.variants) {
      assert.ok(v.color, 'Variant must have color');
      assert.ok(v.storage, 'Variant must have storage');
      assert.ok(v.price > 0, 'Variant price must be > 0');
      assert.ok(v.mrp >= v.price, 'MRP should be >= price');
      assert.strictEqual(typeof v.inStock, 'boolean');
    }
  });

  // 6. EMI Plans Verification
  await test('EMI Plans must have tenure, monthlyPayment, fundName backed by Mutual Funds', async () => {
    for (const plan of detail.emiPlans) {
      assert.ok(plan.tenure > 0, 'Tenure must be positive months');
      assert.ok(plan.monthlyPayment > 0, 'Monthly payment must be positive');
      assert.ok(plan.totalPayment >= detail.startingPrice, 'Total payment must be >= principal');
      assert.ok(plan.fundName, 'EMI plan must be backed by a mutual fund');
    }
  });

  // 7. Non-existent Product 404
  await test('GET /api/products/unknown-device-999 should return 404', async () => {
    const res = await get('/api/products/unknown-device-999');
    assert.strictEqual(res.statusCode, 404);
    assert.strictEqual(res.data.success, false);
  });

  // 8. Static Image Serving
  await test('GET static product image should return 200 with image/png or image/jpeg', async () => {
    const imagePath = detail.images && detail.images[0] ? detail.images[0] : '/images/iphone-17-pro-1.png';
    const res = await get(imagePath);
    assert.strictEqual(res.statusCode, 200);
    assert.ok(res.headers['content-type'].includes('image/'), 'Content-type must be image');
  });

  console.log(`\n========================================`);
  console.log(`Tests finished: ${passed} passed, ${failed} failed`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Fatal error running tests:', err);
  process.exit(1);
});
