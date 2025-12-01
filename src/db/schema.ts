import {
  pgTable,
  text,
  timestamp,
  boolean,
  varchar,
  integer,
} from "drizzle-orm/pg-core";
import * as authSchema from "./auth-schema";

export const {
  account,
  accountRelations,
  session,
  sessionRelations,
  user,
  userRelations,
  verification,
} = authSchema;

export const product = pgTable("products", {
  id: text("id").primaryKey(),
  name: varchar("name", { length: 128 }).notNull(),
  shortDescription: varchar("short_description", {
    length: 128,
  }).notNull(),
  fullDescription: text("full_description").default(""),
  type: text("type", {
    enum: ["goods", "services", "goods_and_services"],
  }).notNull(),
  image: text().default(""),
  isStockReady: boolean("is_stock_ready").default(true),
  userId: text("user_id")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  categoryId: text("category_id")
    .references(() => category.id, { onDelete: "cascade" })
    .notNull(),
  price: integer().notNull(),
  discountPrice: integer().$defaultFn(() => 0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const category = pgTable("categories", {
  id: text("id").primaryKey(),
  name: varchar("name", { length: 32 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const feed = pgTable("feed", {
  id: text("id").primaryKey(),
  text: text().default(""),
  image: text().default(""),
  userId: text("user_id")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const productOnFeed = pgTable("product_on_feed", {
  id: text("id").primaryKey(),
  productId: text()
    .references(() => product.id, { onDelete: "cascade" })
    .notNull(),
  feedId: text()
    .references(() => feed.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});
