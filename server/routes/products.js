const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Product = require('../models/Product');

// GET /api/products - List all products (summary view)
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({}, {
      name: 1,
      slug: 1,
      brand: 1,
      category: 1,
      rating: 1,
      reviewCount: 1,
      images: { $slice: 1 },
      variants: 1,
      emiPlans: 1
    });

    const summary = products.map(product => {
      const p = product.toObject();
      return {
        _id: p._id,
        name: p.name,
        slug: p.slug,
        brand: p.brand,
        category: p.category,
        rating: p.rating,
        reviewCount: p.reviewCount,
        image: p.images && p.images[0] ? p.images[0] : null,
        startingPrice: p.startingPrice,
        startingMRP: p.variants && p.variants.length > 0
          ? Math.min(...p.variants.map(v => v.mrp))
          : 0,
        startingEMI: p.startingEMI,
        variantCount: p.variants ? p.variants.length : 0
      };
    });

    res.json({ success: true, data: summary });
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// GET /api/products/:idOrSlug - Get full product details by MongoDB _id or slug
router.get('/:idOrSlug', async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    let query = { slug: idOrSlug };
    if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
      query = { $or: [{ _id: idOrSlug }, { slug: idOrSlug }] };
    }
    const product = await Product.findOne(query);
    
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        error: 'Product not found' 
      });
    }

    res.json({ success: true, data: product });
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;
