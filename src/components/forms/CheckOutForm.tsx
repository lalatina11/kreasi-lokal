import NotAuhorizedError from "@/lib/errors/NotAuthorizedError";
import { switchCurrencyToIDR } from "@/lib/utils";
import { useRouter } from "@tanstack/react-router";
import { FormEventHandler, useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { FieldDescription, FieldGroup, FieldLabel } from "../ui/field";
import { Textarea } from "../ui/textarea";
import { createOrder } from "@/server/actions/order";

interface Props {
  totalPrice: number;
  cartId: string;
}

const CheckOutForm = ({ totalPrice, cartId }: Props) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [formState, setFormState] = useState({
    isLoading: false,
    error: "",
  });
  const handleOrder: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      if (cartId.trim().length < 1) {
        throw new Error("Keranjang tidak valid!");
      }
      const formData = new FormData(e.currentTarget);
      const merchantNote = formData.get("merchantNote") as string;
      await createOrder({ data: { cartId, merchantNote } });
      setIsOpen(false);
      return router.navigate({ to: "/orders" });
    } catch (error) {
      console.log(error);

      if (error instanceof NotAuhorizedError) {
        toast.error("Gagal untuk checkout", { description: error.message });
        return router.navigate({ to: "/auth" });
      }
      const { message } = error as Error;
      toast.error("Gagal untuk checkout", { description: message });
      setFormState((prev) => ({ ...prev, error: message }));
    } finally {
      setFormState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsOpen(true)}>CheckOut</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Checkout Keranjang</DialogTitle>
          <DialogDescription asChild>
            <form onSubmit={handleOrder} className="flex flex-col text-sm">
              <span>Anda ingin memesan keranjang ini?</span>
              <span>Total tagihan: {switchCurrencyToIDR(totalPrice)}</span>
              <FieldGroup className="flex flex-col gap-1 my-2">
                <FieldLabel htmlFor="merchantNote">Catatan Penjual</FieldLabel>
                <Textarea
                  name="merchantNote"
                  id="merchantNote"
                  placeholder="Kirim dengan aman dan amanah"
                ></Textarea>
                <FieldDescription className="text-xs">
                  *Catatan bisa dikosongi
                </FieldDescription>
              </FieldGroup>
              {formState.error && (
                <span className="mt-3 text-xs text-destructive">
                  {formState.error}
                </span>
              )}
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => setIsOpen(false)}
                  type="button"
                  variant="outline"
                >
                  Batal
                </Button>
                <Button type="submit">Bayar</Button>
              </div>
            </form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default CheckOutForm;
