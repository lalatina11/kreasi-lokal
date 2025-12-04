import db from "@/db";
import { tables } from "@/db/tables";
import NotAuhorizedError from "@/lib/errors/NotAuthorizedError";
import { addShippingNumberSchema, createOrderSchema } from "@/lib/formSchema";
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

export const acceptOrder = createServerFn({
  method: "POST",
})
  .inputValidator((orderId: string) => orderId)
  .handler(async ({ data: orderId }) => {
    const session = await getUserSessionByServer();
    if (!session) {
      throw new NotAuhorizedError("Anda harus login sebagai Pedagang dulu");
    }
    if (session.user.role !== "merchant") {
      throw new NotAuhorizedError("Anda harus login sebagai Pedagang dulu");
    }
    const [order] = await db
      .select({ id: tables.order.id, merchantId: tables.orderItem.merchantId })
      .from(tables.order)
      .where(eq(tables.order.id, orderId))
      .leftJoin(
        tables.orderItem,
        eq(tables.orderItem.merchantId, session.user.id)
      );
    if (!order) {
      throw new Error("Orderan tidak valid");
    }
    await db.update(tables.order).set({
      status: "awaiting_shipment_number",
    });
  });
export const addShippingNumber = createServerFn({
  method: "POST",
})
  .inputValidator(addShippingNumberSchema)
  .handler(async ({ data }) => {
    const session = await getUserSessionByServer();
    if (!session) {
      throw new NotAuhorizedError("Anda harus login sebagai Pedagang dulu");
    }
    if (session.user.role !== "merchant") {
      throw new NotAuhorizedError("Anda harus login sebagai Pedagang dulu");
    }
    const [order] = await db
      .select({ id: tables.order.id, merchantId: tables.orderItem.merchantId })
      .from(tables.order)
      .where(eq(tables.order.id, data.orderId))
      .leftJoin(
        tables.orderItem,
        eq(tables.orderItem.merchantId, session.user.id)
      );
    if (!order) {
      throw new Error("Orderan tidak valid");
    }
    await db.update(tables.order).set({
      status: "shipping",
      shippingNumber: data.shippingNumber,
    });
  });
