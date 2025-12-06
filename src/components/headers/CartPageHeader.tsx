import { Session } from "@/types";
import { Link, useLocation } from "@tanstack/react-router";
import LogoutForm from "../forms/LogoutForm";
import { ModeToggle } from "../ModeToggle";
import { Button } from "../ui/button";
import Logo from "./Logo";

interface Props {
  session: Session;
}

const CartPageHeader = ({ session }: Props) => {
  const location = useLocation();

  if (!session) return null;

  return (
    <header className="flex justify-between items-center p-4 border-b">
      <Logo />
      <nav className="flex gap-2 items-center">
        <Button asChild>
          <Link to="/products">Products</Link>
        </Button>
        <Button asChild>
          <Link to="/feeds">Feeds</Link>
        </Button>
        {location.pathname.startsWith("/orders") ? (
          <Button asChild>
            <Link to="/carts">Keranjang</Link>
          </Button>
        ) : (
          <Button asChild>
            <Link to="/orders">Order</Link>
          </Button>
        )}
        <LogoutForm />
        <ModeToggle />
      </nav>
    </header>
  );
};

export default CartPageHeader;
