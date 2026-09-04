# 1Fi Marketplace — Full-Stack Web Application

A dynamic product EMI marketplace built for the 1Fi app's "Shop" page. Browse smartphones with multiple EMI plans backed by mutual funds.

![1Fi Marketplace](https://img.shields.io/badge/1Fi-Marketplace-5E27EC?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTEyIDJMMiA3TDEyIDEyTDIyIDdMMTIgMloiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIvPjwvc3ZnPg==)

## 🛒 Features

- **Dynamic Product Pages** — Unique URLs for each product (`/products/iphone-17-pro`)
- **Multiple Variants** — Color, storage options with real-time price updates
- **EMI Plans** — Selectable plans with tenure, interest rates, cashback, and mutual fund backing
- **Responsive Design** — Works on desktop, tablet, and mobile
- **Shop Page** — Three tabs: Top Brands, Nearby Stores, 1Fi Marketplace
- **No Hardcoded Data** — All content loaded from MongoDB via REST APIs

## 🧰 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19 (Vite), CSS Modules |
| **Backend** | Node.js, Express 4 |
| **Database** | MongoDB (Mongoose ODM) |
| **Font** | Inter (Google Fonts) |

## 📁 Project Structure

```
├── client/                     # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header/         # 1Fi branded header
│   │   │   ├── ShopTabs/       # Tab navigation
│   │   │   └── ProductCard/    # Product listing card
│   │   ├── pages/
│   │   │   ├── Shop.jsx        # Shop page with 3 tabs
│   │   │   └── ProductPage.jsx # Product detail with EMI plans
│   │   ├── App.jsx             # Router setup
│   │   ├── main.jsx            # Entry point
│   │   └── index.css           # Global design tokens
│   └── vite.config.js
├── server/                     # Express Backend
│   ├── models/
│   │   └── Product.js          # Mongoose schema
│   ├── routes/
│   │   └── products.js         # API routes
│   ├── public/images/          # Product images
│   ├── seed.js                 # Database seed script
│   └── server.js               # Express server
└── README.md
```

## 🚀 Setup & Run Instructions

### Prerequisites
- **Node.js** 18+ 
- **MongoDB** 6+ (running locally on port 27017)

### 1. Clone the Repository
```bash
git clone <repo-url>
cd 1fi-marketplace
```

### 2. Start MongoDB
```bash
brew services start mongodb-community
# or
mongod --dbpath ~/data/db
```

### 3. Setup & Seed Backend
```bash
cd server
npm install
node seed.js       # Seeds 3 products with variants & EMI plans
node server.js     # Starts API server on http://localhost:5000
```

### 4. Setup & Run Frontend
```bash
cd client
npm install
npm run dev        # Starts dev server on http://localhost:5173
```

### 5. Run Automated Tests
```bash
# Backend API & schema tests
cd server
npm test

# Frontend production build verification
cd client
npm run build
```

### 6. Open in Browser
Navigate to: **http://localhost:5173/shop**

---

## 🌐 Deployment Guide

### Deploy Backend (e.g., Render / Railway)
1. Push this repository to GitHub.
2. Create a free MongoDB Atlas cluster and get your connection string.
3. On Render, create a new **Web Service** pointing to the `server/` directory:
   - **Build Command**: `npm install`
   - **Start Command**: `node seed.js && node server.js`
   - **Environment Variables**:
     - `PORT`: `5000`
     - `MONGODB_URI`: `<your-mongodb-atlas-uri>`
     - `CLIENT_URL`: `<your-vercel-frontend-url>`
4. Copy the backend URL (e.g., `https://onefi-api.onrender.com`).

### Deploy Frontend (e.g., Vercel)
1. On Vercel, import your GitHub repository and set the **Root Directory** to `client`:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Environment Variables**:
     - `VITE_API_URL`: `<your-backend-url-from-step-3>` (e.g. `https://onefi-api.onrender.com`)
2. Deploy! Vercel handles SPA routing automatically via the included [`vercel.json`](client/vercel.json).

---

## 📡 API Endpoints

### `GET /api/products`
Returns all products in summary format.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": "iPhone 17 Pro",
      "slug": "iphone-17-pro",
      "brand": "Apple",
      "category": "Smart Phones",
      "rating": 4.5,
      "reviewCount": 2847,
      "image": "/images/iphone-17-pro-1.png",
      "startingPrice": 125900,
      "startingMRP": 134900,
      "startingEMI": 11097,
      "variantCount": 3
    }
  ]
}
```

### `GET /api/products/:idOrSlug`
Returns full product details with all variants and EMI plans. Supports both MongoDB `_id` and unique `slug`.

**Example:** `GET /api/products/iphone-17-pro` or `GET /api/products/6a9a6ba1d437180b31dcc15e`

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "iPhone 17 Pro",
    "slug": "iphone-17-pro",
    "brand": "Apple",
    "category": "Smart Phones",
    "description": "iPhone 17 Pro features...",
    "rating": 4.5,
    "reviewCount": 2847,
    "images": ["/images/iphone-17-pro-1.png", "/images/iphone-17-pro-2.png"],
    "variants": [
      {
        "name": "Silver · 256 GB",
        "color": "Silver",
        "colorHex": "#C0C0C0",
        "storage": "256 GB",
        "mrp": 134900,
        "price": 125900,
        "inStock": true
      },
      {
        "name": "Black Titanium · 512 GB",
        "color": "Black Titanium",
        "colorHex": "#2C2C2E",
        "storage": "512 GB",
        "mrp": 154900,
        "price": 144900,
        "inStock": true
      }
    ],
    "emiPlans": [
      {
        "tenure": 3,
        "interestRate": 0,
        "monthlyPayment": 41967,
        "totalPayment": 125900,
        "cashback": null,
        "tag": null,
        "fundName": "SBI Bluechip Fund"
      },
      {
        "tenure": 6,
        "interestRate": 0,
        "monthlyPayment": 20984,
        "totalPayment": 125900,
        "cashback": "1% Cashback",
        "tag": "Most Popular",
        "fundName": "HDFC Mid-Cap Fund"
      }
    ]
  }
}
```

### `GET /api/health`
Health check endpoint.

**Response:** `{ "status": "ok", "timestamp": "2026-09-04T..." }`

---

## 📊 Database Schema

### Product Collection

```javascript
{
  name: String,              // "iPhone 17 Pro"
  slug: String,              // "iphone-17-pro" (unique)
  brand: String,             // "Apple"
  category: String,          // "Smart Phones"
  description: String,       // Product description
  rating: Number,            // 4.5
  reviewCount: Number,       // 2847
  images: [String],          // Array of image paths
  variants: [{
    name: String,            // "Silver · 256 GB"
    color: String,           // "Silver"
    colorHex: String,        // "#C0C0C0"
    storage: String,         // "256 GB"
    mrp: Number,             // 134900
    price: Number,           // 125900
    inStock: Boolean,        // true
    image: String            // Variant-specific image
  }],
  emiPlans: [{
    tenure: Number,          // 6 (months)
    interestRate: Number,    // 0 or 10.5
    monthlyPayment: Number,  // 20984
    totalPayment: Number,    // 125900
    cashback: String | null, // "1% Cashback"
    tag: String | null,      // "Most Popular"
    fundName: String         // "HDFC Mid-Cap Fund"
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### Seed Data
3 products included:
| Product | Variants | EMI Plans |
|---------|----------|-----------|
| iPhone 17 Pro | Silver 256GB, Black Titanium 512GB, Desert Gold 1TB | 3/6/9/12 months |
| Galaxy S24 Ultra | Titanium Black 256GB, Titanium Violet 512GB, Titanium Gray 1TB | 3/6/9/12 months |
| OnePlus 13 | Midnight Ocean 256GB, Arctic Dawn 512GB | 3/6/9/12 months |

---

## 🎨 Design System

- **Primary**: `#5E27EC` (Deep Purple — 1Fi brand)
- **Accent Green**: `#00D66C` (for 0% interest, cashback)
- **Background**: `#F8F9FD`
- **Cards**: White with 12-16px radius, soft shadows
- **Font**: Inter (400, 500, 600, 700, 800)
- **Selected State**: Purple border + lavender background

---

## 📦 Environment Variables

### Server (`server/.env`)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/onefi-marketplace
CLIENT_URL=http://localhost:5173
```

### Client (`client/.env`)
```
VITE_API_URL=http://localhost:5000
```

---

## 🔗 Links

- **GitHub Repository**: [https://github.com/attarubedulla272/1fi-marketplace](https://github.com/attarubedulla272/1fi-marketplace)
- **Demo**: [Deployed Link]
- **Video**: [Demo Video Link]
