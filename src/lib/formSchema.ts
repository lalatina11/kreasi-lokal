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
    .file("Hanya bisa menerima file image")
    .refine(
      (file) => file?.size <= 40000000,
      "Ukuran gambar maksimum adalah 4MB"
    )
    .refine(
      (files) => files.type.startsWith("image/"),
      "Hanya bisa input image"
    )
    .optional(),
  productId: z.string().optional().default(""),
});

export type CreateFeedSchemaType = z.infer<typeof createFeedSchema>;

const productTypeSchema = z.enum(["goods", "services", "goods_and_services"]);

export const createProductSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Panjang minimal 3 karakter" })
    .max(127, { message: "Panjang maksimal 127 karakter" }),
  shortDescription: z
    .string()
    .min(3, { message: "Panjang minimal 3 karakter" })
    .max(128, { message: "Panjang maksimal 128 karakter" }),
  fullDescription: z.string().optional().default(""),
  type: productTypeSchema.refine(
    (type) => ["goods", "services", "goods_and_services"].includes(type),
    {
      message: "Hanya menerima 'barang', 'jasa', atau 'barang dan jasa'",
    }
  ),
  image: z
    .file()
    .refine((file) => file.type.startsWith("image"), {
      message: "Hanya menerima file gambar",
    })
    .refine((file) => file.size <= 4000000, {
      message: "Ukuran gambar maksimum 4MB",
    })
    .optional(),
  price: z.coerce
    .number()
    .min(1000, { message: "Harga minimal Rp 1.000" })
    .max(100_000_000, { message: "Harga maksimal Rp 100.000.000" })
    .default(0)
    .refine((price) => price % 500 === 0, {
      message: "Harga harus dapat dibagi 500",
    }),
  categoryId: z.string("Kategori wajib diisi"),
  isStockReady: z.boolean(),
});

export type CreateProductSchemaType = z.infer<typeof createProductSchema>;

export const addToChartSchema = z.object({
  productId: z
    .string()
    .trim()
    .refine((id) => id.length > 1, "Product tidak valid"),
  quantity: z.coerce.number().min(1).default(1),
});

export type AddToChartSchema = z.infer<typeof addToChartSchema>;

export const createOrderSchema = z.object({
  cartId: z
    .string()
    .trim()
    .refine((id) => id.trim() !== "", "Keranjang tidak valid"),
  merchantNote: z.string().optional().default(""),
});

export type CreateOrderSchema = z.infer<typeof createOrderSchema>;

export const addShippingNumberSchema = z.object({
  orderId: z
    .string()
    .trim()
    .refine((id) => id.trim().length > 6, "Order tidak valid"),
  shippingNumber: z
    .string()
    .trim()
    .refine((id) => id.trim().length > 6, "Nomor Resi tidak valid"),
});

export type AddShippingNumberSchema = z.infer<typeof addShippingNumberSchema>;

export const bannedUserSchema = z.object({
  userId: z.string().min(3),
});
export type BannedUserSchema = z.infer<typeof bannedUserSchema>;
