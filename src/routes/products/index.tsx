import BackButton from "@/components/BackButton";
import ProductCard from "@/components/ProductCard";
import { getAllProducts } from "@/server/renders/products";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/products/")({
  component: RouteComponent,
  ssr: true,
  loader: async () => {
    const products = await getAllProducts();
    return { products };
  },
});

function RouteComponent() {
  const { products } = Route.useLoaderData();
  return (
    <div className="container mx-auto flex-col flex gap-3 m-3">
      <BackButton />
      <h1>Menampilkan semua produk</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        <ProductCard products={products} />
      </div>
    </div>
  );
}
