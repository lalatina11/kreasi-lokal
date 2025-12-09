import db from "@/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite"
  }),
  plugins: [],
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
      isBanned: {
        type: "boolean",
        required: true,
        defaultValue: false,
      },
    },
  },
});
