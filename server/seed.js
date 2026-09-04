const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/onefi-marketplace';

const products = [
  {
    name: 'iPhone 17 Pro',
    slug: 'iphone-17-pro',
    brand: 'Apple',
    category: 'Smart Phones',
    description: 'iPhone 17 Pro features an aerospace-grade titanium design, A19 Pro chip, 48MP camera system with 5x Telephoto, and all-day battery life. Experience the power of Apple Intelligence with advanced computational photography and Pro-level video capabilities.',
    rating: 4.5,
    reviewCount: 2847,
    images: [
      '/images/iphone-17-pro-1.png',
      '/images/iphone-17-pro-2.png'
    ],
    variants: [
      {
        name: 'Silver · 256 GB',
        color: 'Silver',
        colorHex: '#C0C0C0',
        storage: '256 GB',
        mrp: 134900,
        price: 125900,
        inStock: true,
        image: '/images/iphone-17-pro-1.png'
      },
      {
        name: 'Black Titanium · 512 GB',
        color: 'Black Titanium',
        colorHex: '#2C2C2E',
        storage: '512 GB',
        mrp: 154900,
        price: 144900,
        inStock: true,
        image: '/images/iphone-17-pro-1.png'
      },
      {
        name: 'Desert Gold · 1 TB',
        color: 'Desert Gold',
        colorHex: '#D4A853',
        storage: '1 TB',
        mrp: 179900,
        price: 169900,
        inStock: true,
        image: '/images/iphone-17-pro-1.png'
      }
    ],
    emiPlans: [
      {
        tenure: 3,
        interestRate: 0,
        monthlyPayment: 41967,
        totalPayment: 125900,
        cashback: null,
        tag: null,
        fundName: 'SBI Bluechip Fund'
      },
      {
        tenure: 6,
        interestRate: 0,
        monthlyPayment: 20984,
        totalPayment: 125900,
        cashback: '1% Cashback',
        tag: 'Most Popular',
        fundName: 'HDFC Mid-Cap Fund'
      },
      {
        tenure: 9,
        interestRate: 5.5,
        monthlyPayment: 14530,
        totalPayment: 130770,
        cashback: '2% Cashback',
        tag: null,
        fundName: 'ICICI Prudential Fund'
      },
      {
        tenure: 12,
        interestRate: 10.5,
        monthlyPayment: 11097,
        totalPayment: 133164,
        cashback: null,
        tag: 'Lowest EMI',
        fundName: 'Axis Long Term Fund'
      }
    ]
  },
  {
    name: 'Galaxy S24 Ultra',
    slug: 'samsung-s24-ultra',
    brand: 'Samsung',
    category: 'Smart Phones',
    description: 'Samsung Galaxy S24 Ultra with Galaxy AI, built-in S Pen, 200MP camera, Snapdragon 8 Gen 3 processor, and titanium frame. The most powerful Galaxy experience with AI-enhanced features for productivity and creativity.',
    rating: 4.3,
    reviewCount: 3156,
    images: [
      '/images/samsung-s24-ultra-1.png',
      '/images/samsung-s24-ultra-2.png'
    ],
    variants: [
      {
        name: 'Titanium Black · 256 GB',
        color: 'Titanium Black',
        colorHex: '#1A1A2E',
        storage: '256 GB',
        mrp: 129999,
        price: 119999,
        inStock: true,
        image: '/images/samsung-s24-ultra-1.png'
      },
      {
        name: 'Titanium Violet · 512 GB',
        color: 'Titanium Violet',
        colorHex: '#7B68AE',
        storage: '512 GB',
        mrp: 144999,
        price: 134999,
        inStock: true,
        image: '/images/samsung-s24-ultra-1.png'
      },
      {
        name: 'Titanium Gray · 1 TB',
        color: 'Titanium Gray',
        colorHex: '#8E8E93',
        storage: '1 TB',
        mrp: 164999,
        price: 154999,
        inStock: false,
        image: '/images/samsung-s24-ultra-1.png'
      }
    ],
    emiPlans: [
      {
        tenure: 3,
        interestRate: 0,
        monthlyPayment: 40000,
        totalPayment: 119999,
        cashback: null,
        tag: null,
        fundName: 'Kotak Equity Fund'
      },
      {
        tenure: 6,
        interestRate: 0,
        monthlyPayment: 20000,
        totalPayment: 119999,
        cashback: '1.5% Cashback',
        tag: 'Most Popular',
        fundName: 'SBI Bluechip Fund'
      },
      {
        tenure: 9,
        interestRate: 6.0,
        monthlyPayment: 13890,
        totalPayment: 125010,
        cashback: '2% Cashback',
        tag: null,
        fundName: 'HDFC Mid-Cap Fund'
      },
      {
        tenure: 12,
        interestRate: 10.5,
        monthlyPayment: 10580,
        totalPayment: 126960,
        cashback: null,
        tag: 'Lowest EMI',
        fundName: 'ICICI Prudential Fund'
      }
    ]
  },
  {
    name: 'OnePlus 13',
    slug: 'oneplus-13',
    brand: 'OnePlus',
    category: 'Smart Phones',
    description: 'OnePlus 13 powered by Snapdragon 8 Elite, with Hasselblad Camera for Mobile, 6000mAh battery with 100W SUPERVOOC charging, and a stunning 2K 120Hz LTPO AMOLED display. Flagship performance meets iconic design.',
    rating: 4.4,
    reviewCount: 1923,
    images: [
      '/images/oneplus-13-1.png',
      '/images/oneplus-13-2.png'
    ],
    variants: [
      {
        name: 'Midnight Ocean · 256 GB',
        color: 'Midnight Ocean',
        colorHex: '#1B3A5C',
        storage: '256 GB',
        mrp: 69999,
        price: 64999,
        inStock: true,
        image: '/images/oneplus-13-1.png'
      },
      {
        name: 'Arctic Dawn · 512 GB',
        color: 'Arctic Dawn',
        colorHex: '#E8E4DF',
        storage: '512 GB',
        mrp: 79999,
        price: 74999,
        inStock: true,
        image: '/images/oneplus-13-1.png'
      }
    ],
    emiPlans: [
      {
        tenure: 3,
        interestRate: 0,
        monthlyPayment: 21667,
        totalPayment: 64999,
        cashback: null,
        tag: null,
        fundName: 'SBI Bluechip Fund'
      },
      {
        tenure: 6,
        interestRate: 0,
        monthlyPayment: 10834,
        totalPayment: 64999,
        cashback: '1% Cashback',
        tag: 'Most Popular',
        fundName: 'HDFC Mid-Cap Fund'
      },
      {
        tenure: 9,
        interestRate: 5.0,
        monthlyPayment: 7500,
        totalPayment: 67500,
        cashback: '3% Cashback',
        tag: 'Best Value',
        fundName: 'Axis Long Term Fund'
      },
      {
        tenure: 12,
        interestRate: 9.5,
        monthlyPayment: 5699,
        totalPayment: 68388,
        cashback: null,
        tag: 'Lowest EMI',
        fundName: 'Kotak Equity Fund'
      }
    ]
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');

    // Insert seed data
    const inserted = await Product.insertMany(products);
    console.log(`✅ Seeded ${inserted.length} products:`);
    inserted.forEach(p => {
      console.log(`   • ${p.name} (${p.slug}) — ${p.variants.length} variants, ${p.emiPlans.length} EMI plans`);
    });

    await mongoose.connection.close();
    console.log('\n✅ Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
}

seedDatabase();
