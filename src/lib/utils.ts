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
