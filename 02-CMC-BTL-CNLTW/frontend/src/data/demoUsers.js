export const demoUsers = [
  {
    id: 1,
    fullName: 'Tech Blue Admin',
    email: 'admin@techblue.vn',
    phone: '0900000001',
    address: 'Tech Blue HQ, TP.HCM',
    role: 'ADMIN',
    password: 'Admin@123'
  },
  {
    id: 2,
    fullName: 'Nguyen Van User',
    email: 'user@techblue.vn',
    phone: '0900000002',
    address: '12 Nguyen Hue, TP.HCM',
    role: 'USER',
    password: 'User@123'
  }
];

export function findDemoUser(email, password) {
  return demoUsers.find((user) => user.email === email && user.password === password);
}

export function toSafeDemoUser(user) {
  if (!user) return null;
  const { password, ...safeUser } = user;
  return safeUser;
}
