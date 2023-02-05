import { PrismaClient } from "@prisma/client";
import { categories, notificationType } from "./data.mjs";
const prisma = new PrismaClient();

const load = async () => {
  try {
    await prisma.category.deleteMany();
    await prisma.notificationType.deleteMany();
    await prisma.$queryRaw`ALTER TABLE Category AUTO_INCREMENT = 1`;
    await prisma.$queryRaw`ALTER TABLE NotificationType AUTO_INCREMENT = 1`;
    await prisma.category.createMany({
      data: categories,
    });
    await prisma.notificationType.createMany({
      data: notificationType,
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

load();
