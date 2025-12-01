import { createProductSchema } from "@/lib/formSchema";
import { createServerFn } from "@tanstack/react-start";
import { getUserSessionByServer } from "../renders/auth";
import db from "@/db";
import { tables } from "@/db/tables";
import { switchJSONBoolean } from "@/lib/utils";
import { eq } from "drizzle-orm";

export const createProductForMerchant = createServerFn({
  method: "POST",
})
  .inputValidator((formData: FormData) => formData)
  .handler(async ({ data: formData }) => {
    try {
      const { success, data } = createProductSchema
        .omit({ isStockReady: true })
        .safeParse(Object.fromEntries(formData.entries()));
      if (!success) {
        throw new Error("Invalid input");
      }
      const session = await getUserSessionByServer();
      if (!!!session) {
        throw new Error("Anda harus login sebagai pedagang terlebih dahulu");
      }
      if (session.user.role !== "merchant") {
        throw new Error("Anda harus login sebagai pedagang terlebih dahulu");
      }
      let image = "";
      if (data.image) {
        image = "";
      }
      const isStockReady = switchJSONBoolean(
        formData.get("isStockReady") as string
      );
      console.log({ ...data, isStockReady, image });

      const existingCategoryCount = await db.$count(
        tables.category,
        eq(tables.category.id, data.categoryId)
      );

      if (existingCategoryCount < 1) {
        throw new Error("Kategori Produk tidak valid!");
      }

      await db.insert(tables.product).values({
        id: crypto.randomUUID(),
        ...data,
        image,
        userId: session.user.id,
        isStockReady,
      });

      return { error: false, message: "created" };
    } catch (error) {
      const { message } = error as Error;
      return { error: true, message };
    }
  });
