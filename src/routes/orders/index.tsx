import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Item } from "@/components/ui/item";
import db from "@/db";
import { tables } from "@/db/tables";
import { switchCurrencyToIDR, switchOrderStatus } from "@/lib/utils";
import { getUserSessionByServer } from "@/server/renders/auth";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { Clock, ListOrderedIcon } from "lucide-react";
import { useState } from "react";
import z from "zod/v3";

export const getOrders = createServerFn({ method: "GET" })
  .inputValidator(z.string())
  .handler(async ({ data: userId }) => {
    return await db.query.order.findMany({
      where: eq(tables.order.userId, userId),
      with: {
        items: {
          with: {
            merchant: true,
            merchantAdditionalInfo: true,
            product: { with: { owner: true } },
          },
        },
      },
    });
  });

export const Route = createFileRoute("/orders/")({
  component: RouteComponent,
  ssr: true,
  loader: async () => {
    const session = await getUserSessionByServer();
    if (!session) throw redirect({ to: "/auth" });
    const orders = await getOrders({ data: session.user.id });
    return { orders };
  },
});

function RouteComponent() {
  const { orders } = Route.useLoaderData();
  const [selectedOrderId, setSelectedOrderId] = useState(
    orders.length > 0 ? orders[0].id : ""
  );

  if (orders.length < 1)
    return (
      <span className="flex gap-3 justify-center items-center my-10 text-muted-foreground">
        Anda belum memiliki Transaksi <ListOrderedIcon />
      </span>
    );

  const isOrderPending = (status: string) => status === "pending";
  const isOrderAwaitingShipmentNumber = (status: string) =>
    status === "awaiting_shipment_number";

  return (
    <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 p-3 pb-10">
      <Card className="">
        <CardHeader>
          <CardTitle>Transaksi</CardTitle>
          <CardDescription>Jumlah Transaksi: {orders.length}</CardDescription>
          <CardContent className="flex flex-col gap-3">
            {orders.map((order, idx) => (
              <Item
                key={order.id}
                className={`flex flex-col ${order.id === selectedOrderId ? "cursor-default" : "cursor-pointer"}`}
                onClick={() => {
                  if (selectedOrderId !== order.id) {
                    setSelectedOrderId(order.id);
                  }
                }}
                variant={selectedOrderId !== order.id ? "outline" : "muted"}
              >
                {order.items.map((item) => (
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
              </Item>
            ))}
          </CardContent>
        </CardHeader>
      </Card>
      {selectedOrderId ? (
        orders
          .filter((order) => order.id === selectedOrderId)
          .map((order) => (
            <Card key={order.id} className="md:flex col-span-1 lg:col-span-2">
              <CardHeader>
                <CardTitle>Detail Transaksi Terpilih</CardTitle>
              </CardHeader>
              <CardContent>
                {order.items.map((item) => (
                  <div key={item.id} className="flex flex-col gap-1 text-sm">
                    <span>Produk: {item.product.name}</span>
                    <span>Quantity: {item.quantity}</span>
                    <span>
                      Harga Satuan: {switchCurrencyToIDR(item.product.price)}
                    </span>
                    <span>
                      Total:{" "}
                      {switchCurrencyToIDR(item.quantity * item.product.price)}
                    </span>
                    <div className="flex gap-2 items-center mt-2">
                      <span>Status:</span>
                      <Badge
                        variant={
                          order.status === "completed" ? "default" : "secondary"
                        }
                      >
                        {isOrderPending(order.status as string) ||
                        isOrderAwaitingShipmentNumber(
                          order.status as string
                        ) ? (
                          <Clock />
                        ) : null}
                        {switchOrderStatus(order.status as string)}
                      </Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Catatan untuk penjual: {order.merchantNote}
                    </span>
                    {isOrderPending(order.status as string) && (
                      <span className="text-sm">
                        Penting: Harap hubungi{" "}
                        {item.merchantAdditionalInfo.phoneNumber} untuk
                        konfirmasi pembelian
                      </span>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          ))
      ) : (
        <Card className="hidden md:flex col-span-1 lg:col-span-2">
          <CardContent>Belum ada Transaksi terpilih</CardContent>
        </Card>
      )}
    </div>
  );
}
