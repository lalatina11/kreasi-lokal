import { auth } from "@/lib/auth";
import { getBanyumasDistrict } from "@/lib/utils";
import { faker } from "@faker-js/faker";
import { eq, or } from "drizzle-orm";
import db from "..";
import { user } from "../schema";
import { tables } from "../tables";

const numberToRole = (index: number) => {
  return index === 1 ? "user" : index === 2 ? "merchant" : "admin";
};

const registerSeeder = async ({ data }: { data: { index: number } }) => {
  const role = numberToRole(data.index);
  const password = process.env.USER_SEEDER_PASSWORD as string;
  const { user } = await auth.api.signUpEmail({
    body: {
      email: `${role}@${role}.com`,
      password,
      name: faker.person.fullName(),
      username: faker.person.firstName(),
      role,
    },
  });
  await db.delete(tables.session);
  await db.insert(tables.userAdditionalInfo).values({
    id: crypto.randomUUID(),
    userId: user.id,
    address: faker.helpers.arrayElement(getBanyumasDistrict()),
    phoneNumber: faker.phone.number(),
  });
};

const userSeeder = async () => {
  console.log("menghapus user data table...");
  await db
    .delete(user)
    .where(
      or(
        eq(user.email, "user@user.com"),
        eq(user.email, "merchant@merchant.com"),
        eq(user.email, "admin@admin.com"),
      ),
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
