import { eq } from "drizzle-orm";
import db from "..";
import { tables } from "../tables";
import { Category } from "@/types/db/category";

const neededCategory = [
  { id: crypto.randomUUID(), name: "fashion" },
  { id: crypto.randomUUID(), name: "food" },
  { id: crypto.randomUUID(), name: "elektronik" },
  { id: crypto.randomUUID(), name: "aksesori" },
  { id: crypto.randomUUID(), name: "mainan" },
] as Array<Category>;

const categorySeeder = async () => {
  const [merchant] = await db
    .select()
    .from(tables.user)
    .where(eq(tables.user.role, "merchant"));
  if (!merchant) {
    throw new Error("belum ada pemilik usaha, seed terlebih dahulu!");
  }

  const seededCategory = await db.$count(tables.category);
  if (seededCategory >= neededCategory.length) {
    console.log(
      "Kategori produk sudah diisi!\nmenghapus kategori yang sudah diisi..."
    );
    for (const alreadySeededCategory of neededCategory) {
      console.log("Mencari " + alreadySeededCategory.name + "...");
      const [category] = await db
        .select()
        .from(tables.category)
        .where(eq(tables.category.name, alreadySeededCategory.name));
      if (category) {
        await db
          .delete(tables.category)
          .where(eq(tables.category.name, alreadySeededCategory.name));
        console.log("Menghapus " + alreadySeededCategory.name);
      }
    }
    console.log("Semua kategori yang diisi sudah dihapus\nmengulangi pengisian kategori");
  }

  for (const categories of neededCategory) {
    await db
      .insert(tables.category)
      .values({ id: categories.id, name: categories.name });
    console.log("Dibuat " + categories.name);
  }
  console.log("Semua Kategori telah diisi");
};

export default categorySeeder;
