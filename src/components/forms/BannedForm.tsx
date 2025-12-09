import NotAuhorizedError from "@/lib/errors/NotAuthorizedError";
import { bannedUserAction } from "@/server/actions/user";
import { useRouter } from "@tanstack/react-router";
import { FormEventHandler, useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";

interface Props {
  userId: string;
  isBanned: boolean;
}

const BannedForm = ({ userId, isBanned }: Props) => {
  const router = useRouter();
  const [isloading, setIsloading] = useState(false);
  const handleBanned: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      setIsloading(true);
      await bannedUserAction({ data: { userId } });
      await router.invalidate();
    } catch (error) {
      console.log({ error });
      if (error instanceof NotAuhorizedError) {
        toast.error("Gagal melakukan banned pengguna ini", {
          description: error.message,
        });
        return router.navigate({ to: "/auth" });
      }
      const { message } = error as Error;
      toast.error("Gagal melakukan banned pengguna ini", {
        description: message,
      });
    } finally {
      setIsloading(false);
    }
  };
  return (
    <form onSubmit={handleBanned}>
      <Button disabled={isloading}>
        {isloading ? (
          <Spinner />
        ) : !isloading && isBanned ? (
          "Batalkan banned"
        ) : !isloading && !isBanned ? (
          "Banned Penjual ini"
        ) : null}
      </Button>
    </form>
  );
};

export default BannedForm;
