import db from "@/db";
import { tables } from "@/db/tables";
import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import z from "zod/v3";

export const getAllCarts = createServerFn({ method: "GET" })
  .inputValidator(z.string())
  .handler(async ({ data: userId }) => {
    return await db.query.cart.findMany({
      where: eq(tables.cart.userId, userId),
      with: {
        items: { with: { product: true } },
      },
    });
  });
