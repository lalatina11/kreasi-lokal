import NotAuhorizedError from "@/lib/errors/NotAuthorizedError";
import { addShippingNumber } from "@/server/actions/order";
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
import { Input } from "../ui/input";

interface Props {
  orderId: string;
}
const AddShippingNumberForm = ({ orderId }: Props) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [formState, setFormState] = useState({ error: "", isLoading: false });
  const handleClose = () => {
    setFormState((prev) => ({ ...prev, error: "" }));
    setIsOpen(false);
  };
  const handleOpen = () => setIsOpen(true);

  const handleAddShippingNumber: FormEventHandler<HTMLFormElement> = async (
    e
  ) => {
    e.preventDefault();
    try {
      setFormState((prev) => ({ ...prev, isLoading: true }));
      const formData = new FormData(e.currentTarget);
      const shippingNumber = formData.get("shippingNumber") as string;
      if (shippingNumber.trim().length < 6) {
        throw new Error("Nomor Resi Tidak valid");
      }
      await addShippingNumber({ data: { orderId, shippingNumber } });
      toast.success("Berhasil menerima Pesanan!", {
        description: "Anda berhasil menerima Pesanan ini!",
      });
      await router.invalidate();
      handleClose();
    } catch (error) {
      if (error instanceof NotAuhorizedError) {
        toast.error("Gagal menambahkan nomor resi", {
          description: error.message,
        });
        setFormState((prev) => ({ ...prev, isLoading: false }));
        return router.navigate({ to: "/auth" });
      }
      const { message } = error as Error;
      toast.error("Gagal menambahkan nomor resi", { description: message });
      setFormState((prev) => ({ ...prev, error: message }));
    } finally {
      setFormState((prev) => ({ ...prev, isLoading: false }));
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button onClick={handleOpen}>Tambahkan Nomor Resi</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tambahkan Nomor Resi</DialogTitle>
          <DialogDescription>
            Tambahkan Nomor Resi untuk pengiriman pesanan ini
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-3" onSubmit={handleAddShippingNumber}>
          <FieldGroup className="flex flex-col gap-2">
            <FieldLabel htmlFor="shippingNumber">Nomor Resi</FieldLabel>
            <Input name="shippingNumber" id="shippingNumber" />
            <FieldDescription className="text-xs">
              Nomor resi minimal 6 karakter
            </FieldDescription>
            {formState.error && (
              <span className="text-xs text-red-500">{formState.error}</span>
            )}
          </FieldGroup>
          <div className="grid grid-cols-2 gap-2">
            <Button type="button" onClick={handleClose} variant="outline">
              Batal
            </Button>
            <Button disabled={formState.isLoading} type="submit">
              Submit
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddShippingNumberForm;
