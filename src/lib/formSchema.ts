import { z } from "zod";
export const registerSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Panjang minimal 3 karakter" })
    .max(128, { message: "Panjang maksimal 128 karakter" })
    .regex(/^[a-zA-Z\s]+$/, {
      message: "Nama hanya boleh berisi huruf dan spasi",
    }),
  username: z
    .string()
    .min(3, { message: "Panjang minimal 3 karakter" })
    .max(32, { message: "Panjang maksimal 32 karakter" })
    .regex(/^[a-z]+[a-z\-_]*[a-z]$/, {
      message:
        "Username hanya boleh berisi huruf kecil, tidak boleh mengandung karakter spesial",
    }),
  email: z.email({ message: "Format email tidak valid" }),
  password: z
    .string()
    .min(8, { message: "Panjang minimal 8 karakter" })
    .max(32, { message: "Panjang maksimal 32 karakter" })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      {
        message:
          "Password harus berisi huruf kecil, huruf besar, angka, dan karakter spesial",
      }
    ),
  confirmPassword: z
    .string()
    .min(8, { message: "Panjang minimal 8 karakter" })
    .max(32, { message: "Panjang maksimal 32 karakter" })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      {
        message:
          "Konfirmasi password harus berisi huruf kecil, huruf besar, angka, dan karakter spesial",
      }
    ),
  role: z.enum(["user", "merchant"]),
});

export type RegisterSchemaType = z.infer<typeof registerSchema>;

export const loginSchema = registerSchema.omit({
  name: true,
  username: true,
  confirmPassword: true,
  role: true,
});

export type LoginSchemaType = z.infer<typeof loginSchema>;

export const createFeedSchema = z.object({
  text: z.string().optional().default(""),
  image: z
    .file()
    .refine((file) => file.size <= 4000000, "Ukuran gambar maksimum adalah 4MB")
    .refine((file) => file.type !== "image/*", "Hanya bisa input image")
    .optional(),
  productId: z.string().optional().default(""),
});

export type CreateSchemaType = z.infer<typeof createFeedSchema>;
