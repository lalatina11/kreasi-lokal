import { createFeedSchema } from "@/lib/formSchema";
import { createServerFn } from "@tanstack/react-start";
import { getUserSessionByServer } from "../renders/auth";
import db from "@/db";
import { tables } from "@/db/tables";
import { eq } from "drizzle-orm";

export const createFeedAction = createServerFn({ method: "POST" })
  .inputValidator((formData: FormData) => formData)
  .handler(async ({ data }) => {
    const validatedFields = createFeedSchema.safeParse(
      Object.fromEntries(data.entries())
    );

    if (!validatedFields.success) {
      console.log(validatedFields.error);
      throw new Error("Sepertinya ada fields yang tidak tepat");
    }
    const session = await getUserSessionByServer();
    if (!session) {
      throw new Error("Anda harus login terlebih dahulu");
    }
    if (session.user.role !== "merchant") {
      throw new Error("Hanya pedagang UMKM yang bisa membuat postingan");
    }
    const { productId, image, text } = validatedFields.data;

    console.log(image);

    if (!image && !text) {
      throw new Error("Setidaknya isi text atau tambahkan gambar");
    }

    const [feed] = await db
      .insert(tables.feed)
      .values({
        id: crypto.randomUUID(),
        userId: session.user.id,
        text,
        image: "",
        createdAt: new Date(Date.now()),
        updatedAt: new Date(Date.now()),
      })
      .returning();
    if (!feed) {
      throw new Error("Gagal membuat feed!");
    }
    if (productId) {
      const [{ userId, id }] = await db
        .select({ id: tables.product.id, userId: tables.product.userId })
        .from(tables.product)
        .where(eq(tables.product.id, productId));
      if (!userId || !id) {
        throw new Error("Product yang kamu tautkan tidak valid!");
      }
      if (userId !== session.user.id) {
        throw new Error("Kamu hanya bisa menambahkan produkmu sendiri!");
      }
      const [productOnFeed] = await db
        .insert(tables.productOnFeed)
        .values({
          id: crypto.randomUUID(),
          feedId: feed.id,
          productId: id,
        })
        .returning();
      if (!productOnFeed) {
        throw new Error("Gagal menautkan product di feed");
      }
    }
  });
