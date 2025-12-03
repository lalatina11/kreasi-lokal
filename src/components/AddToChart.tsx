import { tables } from "@/db/tables";
import NotAuhorizedError from "@/lib/errors/NotAuthorizedError";
import { addToChart } from "@/server/actions/cart";
import { useRouter } from "@tanstack/react-router";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { FormEventHandler, useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { switchCurrencyToIDR } from "@/lib/utils";

interface Props {
  product: Partial<typeof tables.product.$inferSelect>;
}

const AddToChart = ({ product }: Props) => {
  const router = useRouter();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [formState, setFormState] = useState({ isLoading: false, error: "" });
  const handleCloseDrawer = () => setIsDrawerOpen(false);

  const handleAddToChart: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      setFormState((prev) => ({ ...prev, isLoading: true }));
      await addToChart({
        data: { productId: product.id as string, quantity },
      });
      handleCloseDrawer();
      toast.success("Berhasil menambahkan ke keranjang", {
        description: `${product.name} berhasil ditambahkan ke keranjangmu`,
        action: {
          label: "Lihat",
          onClick: () => router.navigate({ to: "/carts" }),
        },
      });
    } catch (error) {
      if (error instanceof NotAuhorizedError) {
        const { message } = error;
        toast.error("Anda belum login", { description: message });
        return router.navigate({ to: "/auth" });
      }
      const { message } = error as Error;
      toast.error("Gagal menambahkan ke keranjang", { description: message });
      setFormState((prev) => ({ ...prev, error: message }));
    } finally {
      setQuantity(0);
      setFormState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleChangeQuantity = (type: "increment" | "decrement") => {
    if (type === "increment") {
      return setQuantity((prev) => prev + 1);
    }
    if (quantity === 1) return;
    return setQuantity((prev) => prev - 1);
  };

  return (
    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <DrawerTrigger asChild>
        <Button>
          <ShoppingCart />
          Tambah ke keranjang
        </Button>
      </DrawerTrigger>
      <DrawerContent className="w-sm md:w-md mx-auto">
        <DrawerHeader>
          <DrawerTitle>Tambah ke Keranjang</DrawerTitle>
          <DrawerDescription asChild>
            <div className="flex flex-col gap-6 w-full justify-start items-start">
              <span>Nama: {product.name}</span>
              <span>
                Harga (satuan): {switchCurrencyToIDR(product.price || 0)}
              </span>
              <div className="flex w-full justify-center items-center">
                <div className="grid grid-cols-3 gap-3 w-full px-3">
                  <Button
                    disabled={quantity === 1}
                    onClick={() => handleChangeQuantity("decrement")}
                  >
                    <Minus />
                  </Button>
                  <span className="self-center bg-secondary flex w-full h-full justify-center items-center rounded-md">
                    {quantity}
                  </span>
                  <Button onClick={() => handleChangeQuantity("increment")}>
                    <Plus />
                  </Button>
                </div>
              </div>
            </div>
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="grid grid-cols-2 gap-2">
          <Button onClick={handleCloseDrawer} type="button" variant="outline">
            Batal
          </Button>
          <form onSubmit={handleAddToChart}>
            <Button
              disabled={formState.isLoading}
              className="w-full"
              type="submit"
            >
              Tambahkan <ShoppingCart />
            </Button>
          </form>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default AddToChart;
