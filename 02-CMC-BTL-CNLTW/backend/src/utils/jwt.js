import jwt from 'jsonwebtoken';

const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
const secret = process.env.JWT_SECRET || 'dev-only-tech-blue-secret';

export function signToken(user) {
  return jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    secret,
    { expiresIn }
  );
}

export function verifyJwt(token) {
  return jwt.verify(token, secret);
}
