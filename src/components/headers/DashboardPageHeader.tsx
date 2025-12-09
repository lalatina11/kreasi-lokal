import { Session } from "@/types";
import { Link } from "@tanstack/react-router";
import LogoutForm from "../forms/LogoutForm";
import { Button } from "../ui/button";
import Logo from "./Logo";
import { ModeToggle } from "../ModeToggle";

interface Props {
  session: Session;
}

const DashboardPageHeader = ({ session }: Props) => {
  const isMerchant = session?.user.role === "merchant";
  const isAdmin = session?.user.role === "admin";

  if (!session) return null;

  return (
    <header className="flex justify-between items-center p-4 border-b">
      <Logo />
      <nav className="flex gap-2 items-center">
        {isMerchant && (
          <>
            <Button asChild>
              <Link to="/dashboard/merchant/katalog">Katalog</Link>
            </Button>
            <Button asChild>
              <Link to="/dashboard/merchant/orders">Orders</Link>
            </Button>
          </>
        )}
        {isAdmin && (
          <>
            <Button asChild>
              <Link to="/dashboard/admin/users">Katalog</Link>
            </Button>
          </>
        )}
        <Button asChild>
          <Link to="/feeds">Feeds</Link>
        </Button>
        <Button asChild>
          <Link to="/products">Product</Link>
        </Button>
        <LogoutForm />
        <ModeToggle />
      </nav>
    </header>
  );
};

export default DashboardPageHeader;
