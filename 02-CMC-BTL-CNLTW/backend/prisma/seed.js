import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const imageFor = (name) =>
  `https://placehold.co/900x900/0f5cff/ffffff?text=${encodeURIComponent(name.replaceAll(' ', '+'))}`;

const phones = [
  ['Apple', 'iPhone 15 Pro Max', 33990000, 'Titanium, chip A17 Pro, camera tele 5x', '256GB', '8GB', 18, true],
  ['Apple', 'iPhone 15', 20990000, 'Dynamic Island, camera 48MP, USB-C', '128GB', '6GB', 24, true],
  ['Apple', 'iPhone 14 Plus', 17990000, 'Màn hình lớn, pin tốt, iOS ổn định', '128GB', '6GB', 15, false],
  ['Apple', 'iPhone 13', 13990000, 'A15 Bionic, camera kép, thiết kế gọn', '128GB', '4GB', 30, false],
  ['Samsung', 'Galaxy S24 Ultra', 31990000, 'Galaxy AI, S Pen, camera 200MP', '256GB', '12GB', 16, true],
  ['Samsung', 'Galaxy S24+', 25990000, 'Màn hình QHD+, Galaxy AI, pin 4900mAh', '256GB', '12GB', 14, true],
  ['Samsung', 'Galaxy Z Fold5', 36990000, 'Điện thoại gập cao cấp, đa nhiệm mạnh', '512GB', '12GB', 9, false],
  ['Samsung', 'Galaxy A55', 9990000, 'Khung kim loại, chống nước, camera OIS', '256GB', '8GB', 35, true],
  ['Xiaomi', 'Xiaomi 14', 21990000, 'Leica camera, Snapdragon 8 Gen 3', '256GB', '12GB', 20, true],
  ['Xiaomi', 'Redmi Note 13 Pro+', 10990000, 'Sạc nhanh 120W, camera 200MP', '256GB', '8GB', 40, true],
  ['Xiaomi', 'POCO F6 Pro', 12990000, 'Hiệu năng mạnh, màn hình AMOLED 120Hz', '512GB', '12GB', 25, false],
  ['Xiaomi', 'Redmi 13C', 3290000, 'Pin lớn, giá tốt, đủ dùng hằng ngày', '128GB', '4GB', 60, false],
  ['Oppo', 'OPPO Find X7 Ultra', 24990000, 'Camera flagship, thiết kế da sang trọng', '256GB', '12GB', 12, true],
  ['Oppo', 'OPPO Reno11 F', 8990000, 'Thiết kế mỏng, sạc nhanh, camera chân dung', '256GB', '8GB', 30, false],
  ['Oppo', 'OPPO A98', 7490000, 'Pin 5000mAh, sạc 67W, màn hình lớn', '256GB', '8GB', 28, false],
  ['Oppo', 'OPPO A58', 4990000, 'Loa kép, pin bền, giá phổ thông', '128GB', '6GB', 45, false],
  ['Vivo', 'vivo V30', 12990000, 'Aura Light, camera chân dung, màn cong', '256GB', '12GB', 22, true],
  ['Vivo', 'vivo V29e', 8990000, 'Thiết kế mỏng nhẹ, selfie sắc nét', '256GB', '8GB', 26, false],
  ['Vivo', 'vivo Y36', 5990000, 'Pin tốt, sạc nhanh, màn hình 90Hz', '128GB', '8GB', 36, false],
  ['Vivo', 'iQOO Z9', 7990000, 'Hiệu năng chơi game tốt, pin 6000mAh', '256GB', '8GB', 32, true]
];

async function main() {
  const passwordAdmin = await bcrypt.hash('Admin@123', 10);
  const passwordUser = await bcrypt.hash('User@123', 10);

  await prisma.user.upsert({
    where: { email: 'admin@techblue.vn' },
    update: {},
    create: {
      fullName: 'Tech Blue Admin',
      email: 'admin@techblue.vn',
      phone: '0900000001',
      address: 'Tech Blue HQ, TP.HCM',
      passwordHash: passwordAdmin,
      role: 'ADMIN'
    }
  });
  await prisma.user.upsert({
    where: { email: 'user@techblue.vn' },
    update: {},
    create: {
      fullName: 'Nguyen Van User',
      email: 'user@techblue.vn',
      phone: '0900000002',
      address: '12 Nguyen Hue, TP.HCM',
      passwordHash: passwordUser,
      role: 'USER'
    }
  });

  const category = await prisma.category.upsert({
    where: { name: 'Điện thoại thông minh' },
    update: {},
    create: { name: 'Điện thoại thông minh', description: 'Smartphone chính hãng tại Tech Blue' }
  });

  const brandRecords = {};
  for (const brandName of ['Apple', 'Samsung', 'Xiaomi', 'Oppo', 'Vivo']) {
    brandRecords[brandName] = await prisma.brand.upsert({
      where: { name: brandName },
      update: {},
      create: {
        name: brandName,
        logoUrl: `https://placehold.co/240x120/eaf3ff/0f5cff?text=${brandName}`
      }
    });
  }

  for (const [brandName, name, price, description, storage, ram, stock, featured] of phones) {
    const product = await prisma.product.upsert({
      where: { name },
      update: {},
      create: {
        name,
        description,
        categoryId: category.id,
        brandId: brandRecords[brandName].id,
        basePrice: price,
        isFeatured: featured,
        variants: {
          create: {
            sku: name.toUpperCase().replace(/[^A-Z0-9]+/g, '-'),
            color: featured ? 'Tech Blue' : 'Graphite',
            storage,
            ram,
            price,
            stockQuantity: stock,
            conditionStatus: 'NEW',
            hasPromotion: featured
          }
        },
        images: {
          create: {
            imageUrl: imageFor(name),
            isPrimary: true
          }
        }
      }
    });
    console.log(`Seeded ${product.name}`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
