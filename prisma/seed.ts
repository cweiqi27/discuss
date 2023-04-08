import { PrismaClient } from "@prisma/client";
import { categories, flairs, notificationType } from "./data.js";
const prisma = new PrismaClient();

const load = async () => {
  try {
    await prisma.category.deleteMany();
    await prisma.notificationType.deleteMany();
    await prisma.notificationObject.deleteMany();
    await prisma.flair.deleteMany();
    await prisma.$queryRaw`ALTER TABLE NotificationType AUTO_INCREMENT = 1`;
    await prisma.$queryRaw`ALTER TABLE NotificationObject AUTO_INCREMENT = 1`;
    await prisma.$queryRaw`ALTER TABLE NotificationInitiate AUTO_INCREMENT = 1`;
    await prisma.$queryRaw`ALTER TABLE NotificationReceive AUTO_INCREMENT = 1`;
    await prisma.category.createMany({
      data: categories,
    });
    await prisma.notificationType.createMany({
      data: notificationType,
    });
    await prisma.flair.createMany({
      data: flairs,
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

load();
