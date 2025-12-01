import { eq } from "drizzle-orm";
import db from "..";
import { tables } from "../tables";
import { createServerFn } from "@tanstack/react-start";
import { faker } from "@faker-js/faker";
import { Product } from "@/types/db/products";

const productSeeder = createServerFn().handler(async () => {
  console.log("Mencari pemilik usaha...");

  const [merchant] = await db
    .select({ id: tables.user.id })
    .from(tables.user)
    .where(eq(tables.user.role, "merchant"));
  if (!merchant) {
    throw new Error(
      "Tidak ada pemilik usaha, seed table pengguna terlebih dahulu!"
    );
  }
  console.log("Pemilik usaha ditemukan!\nMencari Kategori...");
  const categories = await db
    .select({ id: tables.category.id, name: tables.category.name })
    .from(tables.category);
  if (!categories.length) {
    throw new Error("Tidak ada kategori, seed table kategori terlebih dahulu!");
  }
  console.log("Kategori ditemukan!\nMembuat Produk...");
  for (const category of categories) {
    const companyName = faker.company.buzzPhrase();
    const name = `${category.name} ${companyName}`;
    const type = faker.helpers.arrayElement([
      "goods",
      "services",
      "goods_and_services",
    ] as Array<Product["type"]>);
    await db.transaction((tx) =>
      tx.insert(tables.product).values({
        id: crypto.randomUUID(),
        name,
        userId: merchant.id,
        categoryId: category.id,
        shortDescription: `${name}`,
        price: faker.number.int({ min: 5000, max: 1000000 }),
        type,
      })
    );
    console.log(`berhasil membuat product: ${name}!`);
  }
  console.log(`berhasil membuat ${categories.length} products!`);
});

export default productSeeder;
