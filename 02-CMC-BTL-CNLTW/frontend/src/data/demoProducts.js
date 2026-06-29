export const demoBrands = [
  { id: 1, name: 'Apple' },
  { id: 2, name: 'Samsung' },
  { id: 3, name: 'Xiaomi' },
  { id: 4, name: 'Oppo' },
  { id: 5, name: 'Vivo' }
];

const specs = [
  ['Apple', 'iPhone 15 Pro Max', 33990000, 'A17 Pro', '256GB', '8GB', 18, true],
  ['Samsung', 'Galaxy S24 Ultra', 31990000, 'Galaxy AI', '256GB', '12GB', 16, true],
  ['Xiaomi', 'Xiaomi 14', 21990000, 'Leica Camera', '256GB', '12GB', 20, true],
  ['Oppo', 'OPPO Find X7 Ultra', 24990000, 'Portrait Pro', '256GB', '12GB', 12, true],
  ['Vivo', 'vivo V30', 12990000, 'Aura Light', '256GB', '12GB', 22, true],
  ['Apple', 'iPhone 15', 20990000, 'Dynamic Island', '128GB', '6GB', 24, false],
  ['Samsung', 'Galaxy A55', 9990000, 'Super AMOLED', '256GB', '8GB', 35, true],
  ['Xiaomi', 'Redmi Note 13 Pro+', 10990000, '120W Charge', '256GB', '8GB', 40, true]
];

export const demoProducts = specs.map(([brandName, name, price, chip, storage, ram, stock, hasPromotion], index) => ({
  id: index + 1,
  name,
  description: `${name} chinh hang, hieu nang manh, camera dep va ton kho ro rang tai Tech Blue.`,
  basePrice: price,
  isFeatured: index < 5,
  brand: demoBrands.find((brand) => brand.name === brandName),
  category: { id: 1, name: 'Smartphone' },
  images: [{
    id: index + 1,
    imageUrl: `https://placehold.co/900x900/${index % 2 ? '0f5cff' : '061a44'}/ffffff?text=${encodeURIComponent(name)}`,
    isPrimary: true
  }],
  variants: [{
    id: index + 1,
    color: index % 2 ? 'Tech Blue' : 'Titanium',
    storage,
    ram,
    price,
    stockQuantity: stock,
    conditionStatus: 'NEW',
    hasPromotion,
    sku: name.toUpperCase().replace(/[^A-Z0-9]+/g, '-'),
    chip
  }]
}));
