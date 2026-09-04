const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  color: { type: String, required: true },
  colorHex: { type: String, default: '#000000' },
  storage: { type: String, required: true },
  mrp: { type: Number, required: true },
  price: { type: Number, required: true },
  inStock: { type: Boolean, default: true },
  image: { type: String }
});

const emiPlanSchema = new mongoose.Schema({
  tenure: { type: Number, required: true },
  interestRate: { type: Number, required: true },
  monthlyPayment: { type: Number, required: true },
  totalPayment: { type: Number, required: true },
  cashback: { type: String, default: null },
  tag: { type: String, default: null },
  fundName: { type: String, default: 'SBI Mutual Fund' }
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  brand: { type: String, required: true },
  category: { type: String, default: 'Smart Phones' },
  description: { type: String },
  rating: { type: Number, default: 4.0 },
  reviewCount: { type: Number, default: 0 },
  images: [String],
  variants: [variantSchema],
  emiPlans: [emiPlanSchema]
}, { timestamps: true });

// Virtual for starting price (lowest variant price)
productSchema.virtual('startingPrice').get(function() {
  if (!this.variants || this.variants.length === 0) return 0;
  return Math.min(...this.variants.map(v => v.price));
});

// Virtual for starting EMI (lowest monthly payment)
productSchema.virtual('startingEMI').get(function() {
  if (!this.emiPlans || this.emiPlans.length === 0) return 0;
  return Math.min(...this.emiPlans.map(p => p.monthlyPayment));
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
