import db from "@/db";
import { createServerFn } from "@tanstack/react-start";

export const getAllUsers = createServerFn({ method: "GET" }).handler(
  async () => await db.query.user.findMany()
);
