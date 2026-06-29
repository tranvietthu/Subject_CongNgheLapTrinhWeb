import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../config/prisma.js';
import { verifyToken, requireRole } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();
router.use(verifyToken, requireRole('USER', 'ADMIN'));

router.post('/', asyncHandler(async (req, res) => {
  const schema = z.object({
    shippingAddress: z.string().min(8),
    paymentMethod: z.enum(['COD', 'BANKING', 'CREDIT_CARD'])
  });
  const { shippingAddress, paymentMethod } = schema.parse(req.body);
  const cart = await prisma.cart.findUnique({
    where: { userId: req.user.userId },
    include: { items: { include: { variant: true } } }
  });
  if (!cart || cart.items.length === 0) return res.status(400).json({ message: 'Cart is empty' });

  for (const item of cart.items) {
    if (item.variant.stockQuantity < item.quantity) {
      return res.status(400).json({ message: `${item.variant.sku} exceeds available stock` });
    }
  }

  const totalAmount = cart.items.reduce((sum, item) => sum + Number(item.variant.price) * item.quantity, 0);
  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        userId: req.user.userId,
        totalAmount,
        shippingAddress,
        paymentMethod,
        paymentStatus: paymentMethod === 'COD' ? 'PENDING' : 'PAID',
        items: {
          create: cart.items.map((item) => ({
            productVariantId: item.productVariantId,
            quantity: item.quantity,
            unitPrice: item.variant.price
          }))
        }
      },
      include: { items: { include: { variant: { include: { product: true } } } } }
    });

    for (const item of cart.items) {
      await tx.productVariant.update({
        where: { id: item.productVariantId },
        data: { stockQuantity: { decrement: item.quantity } }
      });
    }
    await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
    return created;
  });

  res.status(201).json(order);
}));

router.get('/my', asyncHandler(async (req, res) => {
  const orders = await prisma.order.findMany({
    where: { userId: req.user.userId },
    include: { items: { include: { variant: { include: { product: { include: { images: true } } } } } } },
    orderBy: { createdAt: 'desc' }
  });
  res.json(orders);
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const order = await prisma.order.findFirst({
    where: { id: Number(req.params.id), userId: req.user.userId },
    include: { items: { include: { variant: { include: { product: true } } } } }
  });
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json(order);
}));

export default router;
