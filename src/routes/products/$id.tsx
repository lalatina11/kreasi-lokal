import BackButton from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUserSessionByServer } from "@/server/renders/auth";
import {
  getNoProductImageLink,
  getProductById,
} from "@/server/renders/products";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ListOrdered, LogIn, ShoppingCart } from "lucide-react";

export const Route = createFileRoute("/products/$id")({
  component: RouteComponent,
  ssr: true,
  loader: async ({ params }) => {
    const [product] = await getProductById({ data: params.id });
    if (!product) throw notFound();
    const session = await getUserSessionByServer();
    return { params, product, session };
  },
});

function RouteComponent() {
  const { product, session } = Route.useLoaderData();

  return (
    <div className="container mx-auto flex flex-col gap-3 m-3">
      <BackButton />
      <Card className="flex-1">
        <CardHeader className="flex justify-between items-center gap-3">
          <div>
            <CardTitle>{product.name}</CardTitle>
            <CardDescription>{product.shortDescription}</CardDescription>
          </div>
          {session ? (
            <div className="flex gap-2 items-center">
              <Button>
                <ListOrdered />
                Checkout langsung
              </Button>
              <Button>
                <ShoppingCart />
                Tambah ke keranjang
              </Button>
            </div>
          ) : (
            <Button asChild>
              <Link to="/auth">
                <LogIn />
                Login untuk Checkout
              </Link>
            </Button>
          )}
        </CardHeader>
        <CardContent className="flex w-full flex-col gap-2">
          <img
            className="flex-1 rounded-lg object-cover"
            src={product.image || getNoProductImageLink()}
          />
          {product.fullDescription ? (
            <span>{product.fullDescription}</span>
          ) : (
            <span className="text-muted-foreground text-xs">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit.
              Molestiae praesentium quos vel sed, illo totam eaque error sequi
              accusantium consectetur ex a suscipit aperiam recusandae autem
              excepturi quaerat provident doloribus.
            </span>
          )}
        </CardContent>
      </Card>

      <Button className="w-fit self-center" asChild>
        <Link to="/products">Lihat semua produk</Link>
      </Button>
    </div>
  );
}
