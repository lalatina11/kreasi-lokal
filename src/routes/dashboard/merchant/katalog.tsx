import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAllProductsByIsLoggedInMerchant } from "@/server/renders/products";
import { Product } from "@/types/db/products";
import { createFileRoute } from "@tanstack/react-router";

export const transformProductType = (type: Product["type"]) => {
  return type === "goods"
    ? "Barang"
    : type === "services"
      ? "Jasa"
      : "Barang dan Jasa";
};

export const Route = createFileRoute("/dashboard/merchant/katalog")({
  component: RouteComponent,
  ssr: true,
  loader: async () => {
    const products = await getAllProductsByIsLoggedInMerchant();
    return { products };
  },
  head: () => ({
    meta: [{ title: "Katalog UMKM" }],
  }),
});

function RouteComponent() {
  const { products } = Route.useLoaderData();
  return (
    <main className="min-h-screen container mx-auto mt-4">
      <section className="flex flex-col gap-3">
        <span className="text-xl font-semibold">
          Daftar Product yang anda tawarkan
        </span>
        <Table>
          <TableCaption>
            Sudah menampilkan seluruh daftar product yang anda tawarkan
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">#</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Deskripsi singkat</TableHead>
              <TableHead>Tipe</TableHead>
              <TableHead className="">Harga (Rp)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product, idx) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{idx + 1}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.shortDescription}</TableCell>
                <TableCell>{transformProductType(product.type)}</TableCell>
                <TableCell>5000</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell className="text-right">$2,500.00</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </section>
    </main>
  );
}
