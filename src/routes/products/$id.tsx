import AddToChart from "@/components/AddToChart";
import BackButton from "@/components/BackButton";
import BannedForm from "@/components/forms/BannedForm";
import NotFound from "@/components/NotFound";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { switchCurrencyToIDR } from "@/lib/utils";
import { getUserSessionByServer } from "@/server/renders/auth";
import {
  getNoProductImageLink,
  getProductById,
} from "@/server/renders/products";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRightCircle, ListOrdered, LogIn, User } from "lucide-react";

export const Route = createFileRoute("/products/$id")({
  component: RouteComponent,
  ssr: true,
  loader: async ({ params }) => {
    const product = await getProductById({ data: params.id });
    if (!product) throw notFound();
    const session = await getUserSessionByServer();
    return { params, product, session };
  },
  notFoundComponent: () => <NotFound />,
});

function RouteComponent() {
  const { product, session } = Route.useLoaderData();

  return (
    <div className="container mx-auto flex flex-col gap-3 m-3 mb-10">
      <BackButton />
      <Card className="flex-1">
        <CardHeader className="flex justify-between items-center gap-3">
          <div>
            <CardTitle>{product.name}</CardTitle>
            <CardDescription className="flex flex-col gap-2">
              <span>{product.shortDescription}</span>
              <span>{switchCurrencyToIDR(product.price)}</span>
            </CardDescription>
          </div>
          {session && session.user.role === "user" ? (
            <div className="flex gap-2 items-center">
              <Button>
                <ListOrdered />
                Checkout langsung
              </Button>
              <AddToChart product={product} />
            </div>
          ) : session && session.user.role !== "user" ? null : (
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
            <span>Deskripsi Lengkap: {product.fullDescription}</span>
          ) : (
            <span className="text-muted-foreground text-xs">
              Deskripsi Lengkap: Lorem ipsum dolor sit, amet consectetur
              adipisicing elit. Molestiae praesentium quos vel sed, illo totam
              eaque error sequi accusantium consectetur ex a suscipit aperiam
              recusandae autem excepturi quaerat provident doloribus.
            </span>
          )}
        </CardContent>
        <div className="ml-4 flex w-full">
          <HoverCard>
            <HoverCardTrigger>
              <div className="flex w-fit gap-2 items-center">
                <Avatar>
                  <AvatarImage src={product.owner.avatar || ""} />
                  <AvatarFallback>
                    <User />
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm">{product.owner.name}</span>
              </div>
            </HoverCardTrigger>
            <HoverCardContent>
              <div className="flex flex-col gap-2">
                <div className="flex w-fit gap-2 items-center">
                  <Avatar>
                    <AvatarImage src={product.owner.avatar || ""} />
                    <AvatarFallback>
                      <User />
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{product.owner.name}</span>
                </div>
                {product.owner.bio ? (
                  <span className="text-xs text-muted-foreground">
                    {product.owner.bio}
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  </span>
                )}
                <span className="text-xs text-muted-foreground">
                  Bergabung Pada{" "}
                  {product.owner.createdAt.toLocaleDateString("id-ID")}
                </span>
                {session?.user.role === "admin" && (
                  <BannedForm
                    userId={product.userId}
                    isBanned={product.owner.isBanned}
                  />
                )}
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
      </Card>

      <Button className="w-fit self-center" asChild>
        <Link to="/products">
          Lihat semua produk <ArrowRightCircle />
        </Link>
      </Button>
    </div>
  );
}
