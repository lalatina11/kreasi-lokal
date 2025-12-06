import { Session } from "@/types";
import Logo from "./Logo";
import LogoutForm from "../forms/LogoutForm";
import { Button } from "../ui/button";
import { Link } from "@tanstack/react-router";
import { ShoppingCart } from "lucide-react";
import { ModeToggle } from "../ModeToggle";

interface Props {
  session: Session;
}

const FeedsPageHeader = ({ session }: Props) => {
  if (!session) return null;
  const isAdmin = session.user.role === "admin";
  const isMerchant = session.user.role === "merchant";

  return (
    <header className="flex justify-between items-center p-4 border-b">
      <Logo />
      <nav className="flex gap-2 items-center">
        {isAdmin || isMerchant ? (
          <Button asChild>
            <Link to={isAdmin ? "/dashboard/admin" : "/dashboard/merchant"}>
              Dashboard
            </Link>
          </Button>
        ) : (
          <Button asChild>
            <Link to="/carts">
              <ShoppingCart /> Keranjang
            </Link>
          </Button>
        )}
        <Button asChild>
          <Link to="/products">Produk</Link>
        </Button>
        <LogoutForm />
        <ModeToggle />
      </nav>
    </header>
  );
};

export default FeedsPageHeader;
