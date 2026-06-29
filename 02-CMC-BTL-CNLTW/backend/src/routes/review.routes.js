import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../config/prisma.js';
import { verifyToken, requireRole } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();
router.use(verifyToken, requireRole('USER', 'ADMIN'));

router.post('/', asyncHandler(async (req, res) => {
  const schema = z.object({
    productId: z.number(),
    rating: z.number().int().min(1).max(5),
    comment: z.string().optional()
  });
  const { productId, rating, comment } = schema.parse(req.body);
  const purchased = await prisma.orderItem.findFirst({
    where: {
      order: { userId: req.user.userId, orderStatus: 'COMPLETED' },
      variant: { productId }
    }
  });
  if (!purchased) return res.status(403).json({ message: 'Only completed buyers can review this product' });

  const review = await prisma.review.upsert({
    where: { userId_productId: { userId: req.user.userId, productId } },
    create: { userId: req.user.userId, productId, rating, comment },
    update: { rating, comment }
  });
  res.status(201).json(review);
}));

export default router;
