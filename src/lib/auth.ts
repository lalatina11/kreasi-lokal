import db from "@/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { username } from "better-auth/plugins";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite"
  }),
  plugins: [
    username({
      minUsernameLength: 3,
      maxUsernameLength: 32,
      displayUsernameNormalization: false,
    }),
  ],
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        enum: ["admin", "user", "merchant"],
        defaultValue: "user",
        required: true,
      },
      avatar: {
        type: "string",
        required: false,
      },
      bio: {
        type: "string",
        required: false,
      },
      username: {
        type: "string",
        unique: true,
        required: true,
      },
    },
  },
});
