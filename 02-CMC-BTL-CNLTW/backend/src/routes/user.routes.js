import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '../config/prisma.js';
import { verifyToken } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();
router.use(verifyToken);

router.put('/profile', asyncHandler(async (req, res) => {
  const schema = z.object({
    fullName: z.string().min(2).optional(),
    phone: z.string().optional(),
    address: z.string().optional()
  });
  const data = schema.parse(req.body);
  const user = await prisma.user.update({
    where: { id: req.user.userId },
    data,
    select: { id: true, fullName: true, email: true, phone: true, address: true, role: true }
  });
  res.json(user);
}));

router.put('/password', asyncHandler(async (req, res) => {
  const schema = z.object({ currentPassword: z.string(), newPassword: z.string().min(6) });
  const { currentPassword, newPassword } = schema.parse(req.body);
  const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
  if (!user || !(await bcrypt.compare(currentPassword, user.passwordHash))) {
    return res.status(401).json({ message: 'Current password is incorrect' });
  }
  await prisma.user.update({
    where: { id: req.user.userId },
    data: { passwordHash: await bcrypt.hash(newPassword, 10) }
  });
  res.json({ message: 'Password changed successfully' });
}));

export default router;
