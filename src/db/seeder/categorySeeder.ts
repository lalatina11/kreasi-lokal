import { eq, or } from "drizzle-orm";
import db from "..";
import { tables } from "../tables";
import { Category } from "@/types/db/category";
const neededCategory = [
  { id: crypto.randomUUID(), name: "fashion" },
  { id: crypto.randomUUID(), name: "food" },
  { id: crypto.randomUUID(), name: "electronic" },
  { id: crypto.randomUUID(), name: "accessory" },
  { id: crypto.randomUUID(), name: "toy" },
] as Array<Category>;

const categorySeeder = async () => {
  const [merchant] = await db
    .select()
    .from(tables.user)
    .where(eq(tables.user.role, "merchant"));
  if (!merchant) {
    throw new Error("there are no merchant, please seed user table first!");
  }
  const seededCategory = await db.$count(tables.category);
  if (seededCategory >= neededCategory.length) {
    console.log(
      "Product Category already seeded!\ndeleting already seeded Category....",
    );
    for (const alreadySeededCategory of neededCategory) {
      console.log("Searching " + alreadySeededCategory.name + "...");
      const [category] = await db
        .select()
        .from(tables.category)
        .where(eq(tables.category.name, alreadySeededCategory.name));
      if (category) {
        await db
          .delete(tables.category)
          .where(eq(tables.category.name, alreadySeededCategory.name));
        console.log("Deleted " + alreadySeededCategory.name);
      }
    }
    console.log("all the seeded category was deleted\nRecreating category");
  }

  for (const categories of neededCategory) {
    await db
      .insert(tables.category)
      .values({ id: categories.id, name: categories.name });
    console.log("Created " + categories.name);
  }
  console.log("All Categories are seeded successfully");
};

export default categorySeeder;
