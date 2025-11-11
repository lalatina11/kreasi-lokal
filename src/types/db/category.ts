import { tables } from "@/db/tables";

export type Category = typeof tables.category.$inferSelect;
