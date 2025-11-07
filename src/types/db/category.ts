import { category } from "@/db/schema";

export type Category = typeof category.$inferSelect;
