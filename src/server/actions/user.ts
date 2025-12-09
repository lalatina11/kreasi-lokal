import db from "@/db";
import { tables } from "@/db/tables";
import NotAuhorizedError from "@/lib/errors/NotAuthorizedError";
import { bannedUserSchema } from "@/lib/formSchema";
import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { getUserSessionByServer } from "../renders/auth";

export const bannedUserAction = createServerFn({ method: "POST" })
  .inputValidator(bannedUserSchema)
  .handler(async ({ data }) => {
    const session = await getUserSessionByServer();
    if (!session) throw new NotAuhorizedError("");
    if (session.user.role !== "admin") {
      throw new Error("Hanya admin yang bisa melakukan banned");
    }

    const [user] = await db
      .select({ id: tables.user.id, isBanned: tables.user.isBanned })
      .from(tables.user)
      .where(eq(tables.user.id, data.userId));

    if (!user) throw new Error("Failed to ban User");

    return await db
      .update(tables.user)
      .set({ isBanned: !user.isBanned })
      .where(eq(tables.user.id, user.id))
      .returning();
  });
