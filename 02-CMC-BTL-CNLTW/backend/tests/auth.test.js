import test from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import request from 'supertest';
import { verifyToken, requireRole } from '../src/middleware/auth.js';
import { signToken, verifyJwt } from '../src/utils/jwt.js';

process.env.JWT_SECRET = process.env.JWT_SECRET || 'unit-test-secret';

test('signToken creates JWT payload with userId, email, role', () => {
  const token = signToken({ id: 7, email: 'user@techblue.vn', role: 'USER' });
  const payload = verifyJwt(token);
  assert.equal(payload.userId, 7);
  assert.equal(payload.email, 'user@techblue.vn');
  assert.equal(payload.role, 'USER');
});

test('verifyToken returns 401 when token is missing', async () => {
  const app = express();
  app.get('/protected', verifyToken, (req, res) => res.json({ ok: true }));
  const res = await request(app).get('/protected');
  assert.equal(res.status, 401);
});

test('requireRole returns 403 when role is not enough', async () => {
  const app = express();
  app.get('/admin', (req, res, next) => {
    req.user = { role: 'USER' };
    next();
  }, requireRole('ADMIN'), (req, res) => res.json({ ok: true }));
  const res = await request(app).get('/admin');
  assert.equal(res.status, 403);
});
