import { auth } from "@/lib/auth";
import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { faker } from "@faker-js/faker";
import db from "..";
import { user } from "../schema";
import { eq, or } from "drizzle-orm";

const registerSeederSchema = z.object({
  index: z.number().min(1).max(3),
});

const numberToRole = (index: number) => {
  return index === 1 ? "user" : index === 2 ? "merchant" : "admin";
};

const registerSeeder = createServerFn({ method: "POST" })
  .inputValidator(registerSeederSchema)
  .handler(async ({ data }) => {
    const role = numberToRole(data.index);
    const password = process.env.USER_SEEDER_PASSWORD as string;
    await auth.api.signUpEmail({
      body: {
        email: `${role}@${role}.com`,
        password,
        name: faker.person.fullName(),
        username: faker.person.firstName(),
        role,
      },
    });
  });

const userSeeder = async () => {
  console.log("menghapus user data table...");
  await db
    .delete(user)
    .where(
      or(
        eq(user.email, "user@user.com"),
        eq(user.email, "merchant@merchant.com"),
        eq(user.email, "admin@admin.com")
      )
    );
  console.log("data user dari seeder terhapus...");
  const userCount = Array.from({ length: 3 });
  for (const count in userCount) {
    const index = Number(count) + 1;
    const role = numberToRole(index);
    await registerSeeder({ data: { index } });
    console.log(`${role} telah terdaftar...`);
  }
};

export default userSeeder;
