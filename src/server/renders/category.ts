import db from "@/db";
import { createServerFn } from "@tanstack/react-start";

export const getAllCategories = createServerFn({ method: "GET" }).handler(
  async () => {
    return await db.query.category.findMany();
  }
);
