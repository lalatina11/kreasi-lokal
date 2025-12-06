import { authClient } from "@/lib/authClient";
import { Link } from "@tanstack/react-router";
import LogoutForm from "../forms/LogoutForm";
import { Button } from "../ui/button";
import Logo from "./Logo";
import { ModeToggle } from "../ModeToggle";

const HomePageHeader = () => {
  const { isPending, data } = authClient.useSession();

  return (
    <header className="flex justify-between items-center p-4 border-b">
      <Logo />
      <nav className="flex gap-2 items-center">
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
