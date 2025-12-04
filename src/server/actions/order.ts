import db from "@/db";
import { tables } from "@/db/tables";
import NotAuhorizedError from "@/lib/errors/NotAuthorizedError";
import { createOrderSchema } from "@/lib/formSchema";
import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { getUserSessionByServer } from "../renders/auth";

export const createOrder = createServerFn({ method: "POST" })
  .inputValidator(createOrderSchema)
  .handler(async ({ data }) => {
    const session = await getUserSessionByServer();
    if (!session) {
      throw new NotAuhorizedError("Anda harus login sebelum checkout");
    }
    const cartItem = await db.query.cartItem.findFirst({
      where: eq(tables.cartItem.cartId, data.cartId),
      with: { product: true },
    });
    if (!cartItem) {
      throw new Error("Keranjang tidak valid");
    }
    const [order] = await db
      .insert(tables.order)
      .values({
        id: crypto.randomUUID(),
        totalAmount: cartItem.quantity * cartItem.product.price,
        userId: session.user.id,
        merchantNote: data.merchantNote,
      })
      .returning();
    await db.insert(tables.orderItem).values({
      id: crypto.randomUUID(),
      merchantId: cartItem.product.userId,
      orderId: order.id,
      productId: cartItem.product.id,
      priceAtPurchase: order.totalAmount,
      quantity: cartItem.quantity,
    });
    await db.delete(tables.cart).where(eq(tables.cart.id, cartItem.cartId));
  });
