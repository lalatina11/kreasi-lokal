import db from "@/db";
import { tables } from "@/db/tables";
import NotAuhorizedError from "@/lib/errors/NotAuthorizedError";
import { addToChartSchema } from "@/lib/formSchema";
import { createServerFn } from "@tanstack/react-start";
import { getUserSessionByServer } from "../renders/auth";
import { eq } from "drizzle-orm";

export const addToChart = createServerFn({ method: "POST" })
  .inputValidator(addToChartSchema)
  .handler(async ({ data }) => {
    const session = await getUserSessionByServer();
    if (!session)
      throw new NotAuhorizedError(
        "Anda harus login sebelum menambahkan keranjang"
      );
    if (session.user.role !== "user") {
      throw new Error("Hanya pelanggan UMKM yang bisa melakukan aksi ini");
    }
    const [product] = await db
      .select({ id: tables.product.id })
      .from(tables.product)
      .where(eq(tables.product.id, data.productId));
    if (!product.id) {
      throw new Error("Invalid Product");
    }
    const [cart] = await db
      .insert(tables.cart)
      .values({
        id: crypto.randomUUID(),
        userId: session.user.id,
      })
      .returning();
    await db
      .insert(tables.cartItem)
      .values({
        id: crypto.randomUUID(),
        cartId: cart.id,
        productId: product.id,
        quantity: data.quantity,
      })
      .returning();
  });
