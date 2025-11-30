import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  getAllProducts,
  getNoProductImageLink,
} from "@/server/renders/products";
import { createFileRoute, Link } from "@tanstack/react-router";

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
      <h1>Menampilkan semua produk</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {products.map((product) => (
          <Card key={product.id}>
            <CardContent>
              <img
                className="rounded-md object-cover"
                src={product.image || getNoProductImageLink()}
                alt=""
              />
            </CardContent>
            <CardHeader className="w-full self-start flex">
              <Link to={`/products` + `/${product.id}`}>
                <CardTitle>{product.name}</CardTitle>
                <CardDescription className="">
                  {product.shortDescription}
                </CardDescription>
              </Link>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
