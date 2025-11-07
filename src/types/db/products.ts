import { tables } from "@/db/tables";

export type Product = typeof tables.product.$inferSelect;
