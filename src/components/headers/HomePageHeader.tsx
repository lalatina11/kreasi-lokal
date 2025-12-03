import { authClient } from "@/lib/authClient";
import { Link } from "@tanstack/react-router";
import LogoutForm from "../forms/LogoutForm";
import { Button } from "../ui/button";

const HomePageHeader = () => {
  const { isPending, data } = authClient.useSession();

  return (
    <header className="flex justify-between p-4">
      <Link to="/" className="text-lg font-semibold">
        Kreasi Lokal
      </Link>
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
      </nav>
    </header>
  );
};

export default HomePageHeader;
