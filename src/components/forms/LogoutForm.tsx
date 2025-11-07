import { LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { authClient } from "@/lib/authClient";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "@tanstack/react-router";

const LogoutForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onRequest: () => setIsLoading(true),
        onError: ({ error }) => {
          toast.error("Gagal untuk Logout", {
            description:
              error.message || "Terjadi Kesalahan, coba lagi beberapa saat",
            action: {
              label: "OK",
              onClick: () => {},
            },
          });
        },
        onSuccess: () => {
          toast.success("Berhasil Logout", {
            description: "anda akan diarahkan ke halaman login!",
            action: {
              label: "OK",
              onClick: () => {},
            },
          });
          router.navigate({ to: "/auth" });
        },
      },
    });
  };
  return (
    <Button disabled={isLoading} onClick={handleLogout} variant={"destructive"}>
      <LogOut />
      Logout
    </Button>
  );
};

export default LogoutForm;
