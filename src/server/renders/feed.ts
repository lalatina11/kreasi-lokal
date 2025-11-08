import db from "@/db";
import { tables } from "@/db/tables";
import { createServerFn } from "@tanstack/react-start";
import { desc, eq } from "drizzle-orm";

export const getAllFeeds = createServerFn({ method: "GET" }).handler(
  async () => {
    return await db
      .select({
        id: tables.feed.id,
        text: tables.feed.text,
        image: tables.feed.image,
        createdAt: tables.feed.createdAt,
        user: {
          id: tables.user.id,
          name: tables.user.name,
          avatar: tables.user.avatar,
        },
        product: {
          id: tables.product.id,
          name: tables.product.name,
          image: tables.product.image,
        },
      })
      .from(tables.feed)
      .leftJoin(
        tables.productOnFeed,
        eq(tables.productOnFeed.feedId, tables.feed.id)
      )
      .leftJoin(
        tables.product,
        eq(tables.product.id, tables.productOnFeed.productId)
      )
      .leftJoin(tables.user, eq(tables.user.id, tables.feed.userId))
      .orderBy(desc(tables.feed.createdAt));
  }
);
