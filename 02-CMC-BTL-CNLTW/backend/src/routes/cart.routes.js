import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../config/prisma.js';
import { verifyToken, requireRole } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();
router.use(verifyToken, requireRole('USER', 'ADMIN'));

async function getOrCreateCart(userId) {
  return prisma.cart.upsert({
    where: { userId },
    update: {},
    create: { userId },
    include: {
      items: {
        include: {
          variant: { include: { product: { include: { images: true, brand: true } } } }
        }
      }
    }
  });
}

function cartSummary(cart) {
  const totalAmount = cart.items.reduce((sum, item) => sum + Number(item.variant.price) * item.quantity, 0);
  return { ...cart, totalAmount };
}

router.get('/', asyncHandler(async (req, res) => {
  res.json(cartSummary(await getOrCreateCart(req.user.userId)));
}));

router.post('/items', asyncHandler(async (req, res) => {
  const schema = z.object({ productVariantId: z.number(), quantity: z.number().int().positive().default(1) });
  const { productVariantId, quantity } = schema.parse(req.body);
  const variant = await prisma.productVariant.findUnique({ where: { id: productVariantId } });
  if (!variant) return res.status(404).json({ message: 'Product variant not found' });
  if (variant.stockQuantity < quantity) return res.status(400).json({ message: 'Not enough stock' });

  const cart = await getOrCreateCart(req.user.userId);
  const existed = cart.items.find((item) => item.productVariantId === productVariantId);
  const nextQty = (existed?.quantity || 0) + quantity;
  if (variant.stockQuantity < nextQty) return res.status(400).json({ message: 'Quantity exceeds stock' });

  await prisma.cartItem.upsert({
    where: { cartId_productVariantId: { cartId: cart.id, productVariantId } },
    create: { cartId: cart.id, productVariantId, quantity },
    update: { quantity: nextQty }
  });
  res.status(201).json(cartSummary(await getOrCreateCart(req.user.userId)));
}));

router.put('/items/:id', asyncHandler(async (req, res) => {
  const schema = z.object({ quantity: z.number().int().positive() });
  const { quantity } = schema.parse(req.body);
  const cart = await getOrCreateCart(req.user.userId);
  const item = cart.items.find((row) => row.id === Number(req.params.id));
  if (!item) return res.status(404).json({ message: 'Cart item not found' });
  if (item.variant.stockQuantity < quantity) return res.status(400).json({ message: 'Quantity exceeds stock' });
  await prisma.cartItem.update({ where: { id: item.id }, data: { quantity } });
  res.json(cartSummary(await getOrCreateCart(req.user.userId)));
}));

router.delete('/items/:id', asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user.userId);
  const item = cart.items.find((row) => row.id === Number(req.params.id));
  if (!item) return res.status(404).json({ message: 'Cart item not found' });
  await prisma.cartItem.delete({ where: { id: item.id } });
  res.json(cartSummary(await getOrCreateCart(req.user.userId)));
}));

export default router;
