import AddFeedForm from "@/components/forms/AddFeedForm";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { getUserSessionByServer } from "@/server/renders/auth";
import { getAllFeeds } from "@/server/renders/feed";
import { getAllProductsByIsLoggedInMerchant } from "@/server/renders/products";
import { AvatarImage } from "@radix-ui/react-avatar";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { User } from "lucide-react";

export const Route = createFileRoute("/feeds")({
  component: RouteComponent,
  ssr: true,
  loader: async () => {
    const feeds = await getAllFeeds();
    const products = await getAllProductsByIsLoggedInMerchant();
    const session = await getUserSessionByServer();
    if (!session) throw redirect({ to: "/auth" });
    return { products, feeds, session };
  },
});

function RouteComponent() {
  const { products: allProducts, session, feeds } = Route.useLoaderData();

  return (
    <main className="flex flex-col gap-7 py-4">
      {session.user.role === "merchant" && (
        <AddFeedForm allProducts={allProducts} />
      )}
      <section>
        {feeds.length ? (
          <div className="flex flex-col gap-6 justify-center items-center">
            {feeds.map((feed) => (
              <Card key={feed.id} className="w-sm">
                <CardHeader className="flex flex-row gap-3 items-center">
                  <Avatar>
                    <AvatarImage src={feed.user?.avatar as string} />
                    <AvatarFallback>
                      <User />
                    </AvatarFallback>
                  </Avatar>
                  <span>{feed.user?.name}</span>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  {feed.product?.image && (
                    <img src={feed.product?.image as string} />
                  )}
                  <span>{feed.text}</span>
                </CardContent>
                {feed.product && (
                  <Link to={"/products" + `/${feed.product.id}`}>
                    <CardFooter className="flex flex-col gap-1 justify-normal items-start">
                      <span className="text-sm text-muted-foreground">
                        Produk yang ditautkan
                      </span>
                      <div className="bg-accent w-full p-2 rounded-md flex gap-2 items-center truncate">
                        <Avatar>
                          <AvatarImage src={""} />
                          <AvatarFallback>-</AvatarFallback>
                        </Avatar>
                        <span className="text-sm truncate">
                          {feed.product.name}
                        </span>
                      </div>
                    </CardFooter>
                  </Link>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <span className="flex justify-center items-center text-muted-foreground text-sm">
            Belum ada postingan, cobalah buat
          </span>
        )}
        {feeds.length && (
          <span className="flex justify-center items-center text-muted-foreground text-sm mt-5">
            Semua feeds sudah dimuat
          </span>
        )}
      </section>
    </main>
  );
}
