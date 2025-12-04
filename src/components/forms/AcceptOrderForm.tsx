import { acceptOrder } from "@/server/actions/order";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { toast } from "sonner";
import NotAuhorizedError from "@/lib/errors/NotAuthorizedError";
import { useRouter } from "@tanstack/react-router";

interface Props {
  orderId: string;
}
const AcceptOrderForm = ({ orderId }: Props) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);
  const handleOpen = () => setIsOpen(true);
  const [formState, setFormState] = useState({ error: "", isLoading: false });

  const handleAcceptOrder = async () => {
    try {
      setFormState((prev) => ({ ...prev, isLoading: true }));
      await acceptOrder({ data: orderId });
      toast.success("Berhasil menerima Pesanan!", {
        description: "Anda berhasil menerima Pesanan ini!",
      });
      await router.invalidate();
      handleClose();
    } catch (error) {
      if (error instanceof NotAuhorizedError) {
        toast.error("Gagal menerima Pesanan", { description: error.message });
        setFormState((prev) => ({ ...prev, isLoading: false }));
        return router.navigate({ to: "/auth" });
      }
      const { message } = error as Error;
      toast.error("Gagal menerima Pesanan", { description: message });
      setFormState((prev) => ({ ...prev, error: message }));
    } finally {
      setFormState((prev) => ({ ...prev, isLoading: false }));
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button onClick={handleOpen}>Terima Pesanan</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Terima Pesanan</DialogTitle>
          <DialogDescription>
            Apakah anda mau menerima pesanan ini?
          </DialogDescription>
        </DialogHeader>
        {formState.error && (
          <span className="text-red-500 text-xs">{formState.error}</span>
        )}
        <div className="grid gap-4"></div>
        <DialogFooter>
          <Button onClick={handleClose} variant="outline">
            Batal
          </Button>
          <Button
            onClick={handleAcceptOrder}
            disabled={formState.isLoading}
            type="submit"
          >
            Terima
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AcceptOrderForm;
