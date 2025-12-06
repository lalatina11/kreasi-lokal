import { Category } from "@/types/db/category";
import { Product } from "@/types/db/products";
import { faker } from "@faker-js/faker";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function switchJSONBoolean(jsonBool: string) {
  switch (jsonBool) {
    case "true":
      return true;
    default:
      return false;
  }
}

export const switchCurrencyToIDR = (num: number) => {
  return num.toLocaleString("id-ID", { style: "currency", currency: "IDR" });
};

export const getBanyumasDistrict = () => {
  return [
    "Ajibarang",
    "Banyumas",
    "Baturraden", // Sering ditulis Baturraden atau Baturaden (Wiki menggunakan Baturaden, nama resmi Baturraden)
    "Cilongok",
    "Gumelar",
    "Jatilawang",
    "Kalibagor",
    "Karanglewas",
    "Kebasen",
    "Kedungbanteng", // Sering digabung
    "Kembaran",
    "Kemranjen",
    "Lumbir",
    "Patikraja",
    "Pekuncen",
    "Purwojati",
    "Purwokerto Barat",
    "Purwokerto Selatan",
    "Purwokerto Timur",
    "Purwokerto Utara",
    "Rawalo",
    "Sokaraja",
    "Somagede",
    "Sumbang",
    "Sumpiuh",
    "Tambak",
    "Wangon",
  ] as const;
};

export function switchOrderStatus(status: string) {
  switch (status) {
    case "pending":
      return "Pending";
    case "awaiting_shipment_number":
      return "Menunggu Resi";
    case "shipping":
      return "Dalam Perjalanan";
    case "completed":
      return "Selesai";
    default:
      return "";
  }
}

export const neededCategory = [
  { id: crypto.randomUUID(), name: "fashion" },
  { id: crypto.randomUUID(), name: "makanan dan minuman" },
  { id: crypto.randomUUID(), name: "elektronik" },
  { id: crypto.randomUUID(), name: "aksesoris" },
  { id: crypto.randomUUID(), name: "mainan" },
] as Array<Category>;

export const fashionExample =
  "https://images.pexels.com/photos/291738/pexels-photo-291738.jpeg";
export const foodExample =
  "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg";
export const electronicExample =
  "https://images.pexels.com/photos/3199028/pexels-photo-3199028.jpeg";
export const accessoryExample =
  "https://images.pexels.com/photos/1697214/pexels-photo-1697214.jpeg";
export const toyExample =
  "https://images.pexels.com/photos/243206/pexels-photo-243206.jpeg";

export const getProductImageURLByCategory = (category: string): string => {
  switch (category) {
    case "fashion":
      return fashionExample;
    case "makanan dan minuman":
      return foodExample;
    case "elektronik":
      return electronicExample;
    case "aksesoris":
      return accessoryExample;
    case "mainan":
      return toyExample;
    default:
      return "";
  }
};

export const getProductNameByCategory = (category: string): string => {
  switch (category) {
    case "fashion":
      return "Gaun";
    case "makanan dan minuman":
      return "Kopi";
    case "elektronik":
      return "Radio";
    case "aksesoris":
      return "Jam Tangan";
    case "mainan":
      return "Mobil mobilan";
    default:
      return "";
  }
};

export const getRandomGoodsOrServices = () => {
  return faker.helpers.arrayElement([
    "goods",
    "services",
    "goods_and_services",
  ] as Array<Product["type"]>);
};
