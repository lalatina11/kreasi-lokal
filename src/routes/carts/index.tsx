import BackButton from "@/components/BackButton";
import CartPageContainer from "@/components/containers/CartPageContainer";
import CheckOutForm from "@/components/forms/CheckOutForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Item } from "@/components/ui/item";
import { switchCurrencyToIDR } from "@/lib/utils";
import { getUserSessionByServer } from "@/server/renders/auth";
import { getAllCarts } from "@/server/renders/cart";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { ShoppingCart } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/carts/")({
  component: RouteComponent,
  ssr: true,
  loader: async () => {
    const session = await getUserSessionByServer();
    if (!session) throw redirect({ to: "/auth" });
    if (session.user.role !== "user") {
      throw redirect({
        to:
          session.user.role === "admin"
            ? "/dashboard/admin"
            : "/dashboard/merchant",
      });
    }
    const carts = await getAllCarts({ data: session.user.id });
    return { session, carts };
  },
});

function RouteComponent() {
  const { carts, session } = Route.useLoaderData();
  const [selectedCartId, setselectedCartId] = useState(
    carts.length > 0 ? carts[0].id : ""
  );

  if (carts.length < 1)
    return (
      <span className="flex gap-3 justify-center items-center my-10 text-muted-foreground">
        Anda belum memiliki keranjang <ShoppingCart />
      </span>
    );

  return (
    <CartPageContainer session={session}>
      <main className="container mx-auto flex flex-col gap-2 p-3">
        <BackButton />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pb-10">
          <Card className="">
            <CardHeader>
              <CardTitle>Keranjang</CardTitle>
              <CardDescription>
                jumlah keranjang: {carts.length}
              </CardDescription>
              <CardContent className="flex flex-col gap-3">
                {carts.map((cart, idx) => (
                  <Item
                    key={cart.id}
                    className={`flex flex-col ${cart.id === selectedCartId ? "cursor-default" : "cursor-pointer"}`}
                    onClick={() => {
                      if (selectedCartId !== cart.id) {
                        setselectedCartId(cart.id);
                      }
                    }}
                    variant={selectedCartId !== cart.id ? "outline" : "muted"}
                  >
                    {/* <div> */}
                    {cart.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-2 w-full items-center justify-between"
                      >
                        <span className="">{idx + 1}.</span>
                        <span className="">
                          {item.product.name.slice(0, 25)}
                          {item.product.name.length > 25 && "..."}
                        </span>
                        <span className="text-xs">x{item.quantity}</span>
                      </div>
                    ))}
                    {/* </div> */}
                  </Item>
                ))}
              </CardContent>
            </CardHeader>
          </Card>
          {selectedCartId ? (
            carts
              .filter((cart) => cart.id === selectedCartId)
              .map((cart) => (
                <Card
                  key={cart.id}
                  className="md:flex col-span-1 lg:col-span-2"
                >
                  <CardHeader>
                    <CardTitle>Detail Keranjang Terpilih</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {cart.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col gap-1 text-sm"
                      >
                        <span>Produk: {item.product.name}</span>
                        <span>Quantity: {item.quantity}</span>
                        <span>
                          Harga Satuan:{" "}
                          {switchCurrencyToIDR(item.product.price)}
                        </span>
                        <span>
                          Total:{" "}
                          {switchCurrencyToIDR(
                            item.quantity * item.product.price
                          )}
                        </span>
                        <div className="mt-2">
                          <CheckOutForm
                            totalPrice={item.quantity * item.product.price}
                            cartId={selectedCartId}
                          />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))
          ) : (
            <Card className="hidden md:flex col-span-1 lg:col-span-2">
              <CardContent>Belum ada keranjang terpilih</CardContent>
            </Card>
          )}
        </div>
      </main>
    </CartPageContainer>
  );
}
