import { authClient } from "@/lib/authClient";
import { Link } from "@tanstack/react-router";
import LogoutForm from "../forms/LogoutForm";
import { Button } from "../ui/button";
import Logo from "./Logo";
import { ModeToggle } from "../ModeToggle";
import { ShoppingCart } from "lucide-react";

const HomePageHeader = () => {
  const { isPending, data } = authClient.useSession();

  return (
    <header className="flex justify-between items-center p-4 border-b">
      <Logo />
      <nav className="flex gap-2 items-center">
        {data?.user.role === "admin" || data?.user.role === "merchant" ? (
          <Button asChild>
            <Link
              to={
                data?.user.role === "admin"
                  ? "/dashboard/admin/users"
                  : "/dashboard/merchant/katalog"
              }
            >
              Dashboard
            </Link>
          </Button>
        ) : data?.user.role === "user" ? (
          <Button asChild>
            <Link to="/carts">
              <ShoppingCart />
              Keranjang
            </Link>
          </Button>
        ) : null}
        <Button asChild>
          <Link to="/products">Products</Link>
        </Button>
        <Button asChild>
          <Link disabled={isPending} to={data ? "/feeds" : "/auth"}>
            {isPending && !data
              ? "Loading..."
              : !isPending && data
                ? "Feeds"
                : "Login"}
          </Link>
        </Button>
        {data && <LogoutForm />}
        <ModeToggle />
      </nav>
    </header>
  );
};

export default HomePageHeader;
