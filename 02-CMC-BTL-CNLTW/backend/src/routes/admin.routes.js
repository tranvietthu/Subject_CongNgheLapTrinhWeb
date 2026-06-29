import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../config/prisma.js';
import { verifyToken, requireRole } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();
router.use(verifyToken, requireRole('ADMIN'));

const productInclude = { brand: true, category: true, images: true, variants: true };

router.get('/products', asyncHandler(async (req, res) => {
  const products = await prisma.product.findMany({ include: productInclude, orderBy: { createdAt: 'desc' } });
  res.json(products);
}));

router.post('/products', asyncHandler(async (req, res) => {
  const schema = z.object({
    categoryId: z.number(),
    brandId: z.number(),
    name: z.string().min(2),
    description: z.string().min(5),
    basePrice: z.number().positive(),
    isFeatured: z.boolean().optional(),
    imageUrl: z.string().url().optional(),
    variant: z.object({
      sku: z.string(),
      color: z.string(),
      storage: z.string(),
      ram: z.string(),
      price: z.number().positive(),
      stockQuantity: z.number().int().min(0),
      conditionStatus: z.enum(['NEW', 'USED']).default('NEW')
    })
  });
  const data = schema.parse(req.body);
  const product = await prisma.product.create({
    data: {
      categoryId: data.categoryId,
      brandId: data.brandId,
      name: data.name,
      description: data.description,
      basePrice: data.basePrice,
      isFeatured: data.isFeatured || false,
      variants: { create: data.variant },
      images: data.imageUrl ? { create: { imageUrl: data.imageUrl, isPrimary: true } } : undefined
    },
    include: productInclude
  });
  res.status(201).json(product);
}));

router.put('/products/:id', asyncHandler(async (req, res) => {
  const schema = z.object({
    categoryId: z.number().optional(),
    brandId: z.number().optional(),
    name: z.string().min(2).optional(),
    description: z.string().min(5).optional(),
    basePrice: z.number().positive().optional(),
    status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
    isFeatured: z.boolean().optional()
  });
  const product = await prisma.product.update({
    where: { id: Number(req.params.id) },
    data: schema.parse(req.body),
    include: productInclude
  });
  res.json(product);
}));

router.delete('/products/:id', asyncHandler(async (req, res) => {
  await prisma.product.update({ where: { id: Number(req.params.id) }, data: { status: 'INACTIVE' } });
  res.json({ message: 'Product disabled successfully' });
}));

router.put('/variants/:id', asyncHandler(async (req, res) => {
  const schema = z.object({
    color: z.string().optional(),
    storage: z.string().optional(),
    ram: z.string().optional(),
    price: z.number().positive().optional(),
    stockQuantity: z.number().int().min(0).optional(),
    conditionStatus: z.enum(['NEW', 'USED']).optional(),
    hasPromotion: z.boolean().optional()
  });
  const variant = await prisma.productVariant.update({ where: { id: Number(req.params.id) }, data: schema.parse(req.body) });
  res.json(variant);
}));

router.get('/categories', asyncHandler(async (req, res) => {
  res.json(await prisma.category.findMany({ orderBy: { name: 'asc' } }));
}));

router.post('/categories', asyncHandler(async (req, res) => {
  const schema = z.object({ name: z.string().min(2), description: z.string().optional() });
  res.status(201).json(await prisma.category.create({ data: schema.parse(req.body) }));
}));

router.put('/categories/:id', asyncHandler(async (req, res) => {
  const schema = z.object({ name: z.string().min(2).optional(), description: z.string().optional() });
  res.json(await prisma.category.update({ where: { id: Number(req.params.id) }, data: schema.parse(req.body) }));
}));

router.delete('/categories/:id', asyncHandler(async (req, res) => {
  await prisma.category.delete({ where: { id: Number(req.params.id) } });
  res.json({ message: 'Category deleted' });
}));

router.get('/brands', asyncHandler(async (req, res) => {
  res.json(await prisma.brand.findMany({ orderBy: { name: 'asc' } }));
}));

router.post('/brands', asyncHandler(async (req, res) => {
  const schema = z.object({ name: z.string().min(2), logoUrl: z.string().url().optional() });
  res.status(201).json(await prisma.brand.create({ data: schema.parse(req.body) }));
}));

router.put('/brands/:id', asyncHandler(async (req, res) => {
  const schema = z.object({ name: z.string().min(2).optional(), logoUrl: z.string().url().optional() });
  res.json(await prisma.brand.update({ where: { id: Number(req.params.id) }, data: schema.parse(req.body) }));
}));

router.delete('/brands/:id', asyncHandler(async (req, res) => {
  await prisma.brand.delete({ where: { id: Number(req.params.id) } });
  res.json({ message: 'Brand deleted' });
}));

router.get('/orders', asyncHandler(async (req, res) => {
  res.json(await prisma.order.findMany({
    include: { user: { select: { fullName: true, email: true } }, items: { include: { variant: { include: { product: true } } } } },
    orderBy: { createdAt: 'desc' }
  }));
}));

router.put('/orders/:id/status', asyncHandler(async (req, res) => {
  const schema = z.object({ orderStatus: z.enum(['PENDING', 'SHIPPING', 'COMPLETED', 'CANCELLED']) });
  res.json(await prisma.order.update({ where: { id: Number(req.params.id) }, data: schema.parse(req.body) }));
}));

router.get('/users', asyncHandler(async (req, res) => {
  res.json(await prisma.user.findMany({
    select: { id: true, fullName: true, email: true, phone: true, address: true, role: true, createdAt: true },
    orderBy: { createdAt: 'desc' }
  }));
}));

router.put('/users/:id/role', asyncHandler(async (req, res) => {
  const schema = z.object({ role: z.enum(['USER', 'ADMIN']) });
  const user = await prisma.user.update({
    where: { id: Number(req.params.id) },
    data: schema.parse(req.body),
    select: { id: true, fullName: true, email: true, role: true }
  });
  res.json(user);
}));

router.get('/reports/summary', asyncHandler(async (req, res) => {
  const [totalOrders, totalUsers, stockProducts, revenueAgg, bestSellers] = await Promise.all([
    prisma.order.count(),
    prisma.user.count(),
    prisma.productVariant.findMany({ where: { stockQuantity: { gt: 0 } }, include: { product: true }, orderBy: { stockQuantity: 'asc' }, take: 10 }),
    prisma.order.aggregate({ where: { orderStatus: 'COMPLETED' }, _sum: { totalAmount: true } }),
    prisma.orderItem.groupBy({ by: ['productVariantId'], _sum: { quantity: true }, orderBy: { _sum: { quantity: 'desc' } }, take: 5 })
  ]);
  const variants = await prisma.productVariant.findMany({
    where: { id: { in: bestSellers.map((row) => row.productVariantId) } },
    include: { product: true }
  });
  res.json({
    totalOrders,
    totalUsers,
    totalRevenue: Number(revenueAgg._sum.totalAmount || 0),
    stockProducts,
    bestSellers: bestSellers.map((row) => ({
      quantity: row._sum.quantity,
      variant: variants.find((variant) => variant.id === row.productVariantId)
    }))
  });
}));

export default router;
