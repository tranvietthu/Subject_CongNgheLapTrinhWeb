import { Router } from 'express';
import { prisma } from '../config/prisma.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

const includeProduct = {
  brand: true,
  category: true,
  images: true,
  variants: true,
  reviews: { include: { user: { select: { fullName: true } } }, orderBy: { createdAt: 'desc' } }
};

router.get('/', asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page || 1), 1);
  const limit = Math.min(Math.max(Number(req.query.limit || 12), 1), 50);
  const skip = (page - 1) * limit;
  const where = { status: 'ACTIVE' };
  const variantFilters = {};

  if (req.query.search) {
    where.name = { contains: String(req.query.search) };
  }
  if (req.query.brandId) where.brandId = Number(req.query.brandId);
  if (req.query.categoryId) where.categoryId = Number(req.query.categoryId);
  if (req.query.featured === 'true') where.isFeatured = true;
  if (req.query.promotion === 'true') variantFilters.hasPromotion = true;
  if (req.query.condition) variantFilters.conditionStatus = String(req.query.condition).toUpperCase();
  if (req.query.storage) variantFilters.storage = String(req.query.storage);
  if (req.query.minPrice || req.query.maxPrice) {
    variantFilters.price = {
      gte: req.query.minPrice ? Number(req.query.minPrice) : undefined,
      lte: req.query.maxPrice ? Number(req.query.maxPrice) : undefined
    };
  }
  if (Object.keys(variantFilters).length > 0) where.variants = { some: variantFilters };

  const [items, total, brands, categories] = await Promise.all([
    prisma.product.findMany({ where, include: includeProduct, skip, take: limit, orderBy: { createdAt: 'desc' } }),
    prisma.product.count({ where }),
    prisma.brand.findMany({ orderBy: { name: 'asc' } }),
    prisma.category.findMany({ orderBy: { name: 'asc' } })
  ]);
  res.json({ items, page, limit, total, totalPages: Math.ceil(total / limit), brands, categories });
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const product = await prisma.product.findFirst({
    where: { id: Number(req.params.id), status: 'ACTIVE' },
    include: includeProduct
  });
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
}));

export default router;
