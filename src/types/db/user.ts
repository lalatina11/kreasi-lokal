import { tables } from "@/db/tables";

export type User = typeof tables.user.$inferSelect;
