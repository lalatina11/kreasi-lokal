import { Link } from "@tanstack/react-router";
import { Button } from "../ui/button";

const AuthPageHeader = () => {
  return (
    <header className="flex justify-between items-center p-4 border-b">
      <Link to="/" className="text-lg font-semibold flex items-center">
        <img src="kl-simple.png" className="h-15 w-auto" />
        <span className="text-lg font-semibold">Kreasi Lokasl</span>
      </Link>
      <nav className="flex gap-2 items-center">
        <Button asChild>
          <Link to="/products">Products</Link>
        </Button>
      </nav>
    </header>
  );
};

export default AuthPageHeader;
