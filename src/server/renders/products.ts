import db from "@/db";
import { tables } from "@/db/tables";
import { eq } from "drizzle-orm";
import { getUserSessionByServer } from "./auth";
import { redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const querySchema = z.string().optional().default("");

export const getAllProductsByIsLoggedInMerchant = createServerFn({
  method: "GET",
})
  .inputValidator(querySchema)
  .handler(async () => {
    const session = await getUserSessionByServer();
    if (!session) throw redirect({ to: "/auth" });
    const products = await db
      .select({
        id: tables.product.id,
        name: tables.product.name,
        shortDescription: tables.product.shortDescription,
        fullDescription: tables.product.fullDescription,
        categoryId: tables.product.categoryId,
        image: tables.product.image,
        type: tables.product.type,
        createdAt: tables.product.createdAt,
        category: { id: tables.category.id, name: tables.category.name },
      })
      .from(tables.product)
      .where(eq(tables.product.userId, session.user.id))
      .leftJoin(
        tables.category,
        eq(tables.product.categoryId, tables.category.id)
      );
    return products;
  });

export const getProductById = createServerFn({ method: "GET" })
  .inputValidator((id: string) => id)
  .handler(async ({ data: id }) => {
    return await db
      .select()
      .from(tables.product)
      .where(eq(tables.product.id, id));
  });

export const getAllProducts = createServerFn({ method: "GET" }).handler(
  async () => {
    return await db.select().from(tables.product);
  }
);

export const getNoProductImageLink = () => "https://placehold.co/600x400";
