import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '../config/prisma.js';
import { verifyToken } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { signToken } from '../utils/jwt.js';
import { findDemoUser, toSafeDemoUser } from '../utils/demoAuth.js';

const router = Router();

const registerSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  address: z.string().optional(),
  password: z.string().min(6)
});

router.post('/register', asyncHandler(async (req, res) => {
  const data = registerSchema.parse(req.body);
  const existed = await prisma.user.findUnique({ where: { email: data.email } });
  if (existed) return res.status(409).json({ message: 'Email already registered' });

  const passwordHash = await bcrypt.hash(data.password, 10);
  const user = await prisma.user.create({
    data: {
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      address: data.address,
      passwordHash
    },
    select: { id: true, fullName: true, email: true, phone: true, address: true, role: true }
  });
  const token = signToken(user);
  res.status(201).json({ token, user });
}));

router.post('/login', asyncHandler(async (req, res) => {
  const schema = z.object({ email: z.string().email(), password: z.string().min(1) });
  const { email, password } = schema.parse(req.body);
  let user;

  try {
    user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    const demoUser = findDemoUser(email);
    if (!demoUser || demoUser.password !== password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const safeDemoUser = toSafeDemoUser(demoUser);
    return res.json({ token: signToken(safeDemoUser), user: safeDemoUser, mode: 'demo' });
  }

  const safeUser = {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    address: user.address,
    role: user.role
  };
  res.json({ token: signToken(user), user: safeUser });
}));

router.get('/me', verifyToken, asyncHandler(async (req, res) => {
  let user;
  try {
    user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { id: true, fullName: true, email: true, phone: true, address: true, role: true, createdAt: true }
    });
  } catch (error) {
    user = toSafeDemoUser(findDemoUser(req.user.email));
  }
  if (!user) return res.status(401).json({ message: 'Unauthorized' });
  res.json(user);
}));

export default router;
