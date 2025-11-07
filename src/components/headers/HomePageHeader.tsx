import { authClient } from "@/lib/authClient";
import { Link } from "@tanstack/react-router";
import LogoutForm from "../forms/LogoutForm";
import { buttonVariants } from "../ui/button";

const HomePageHeader = () => {
  const { isPending, data } = authClient.useSession();

  return (
    <header className="flex justify-between p-4">
      <Link to="/" className="text-lg font-semibold">
        Kreasi Lokal
      </Link>
      <nav className="flex gap-2 items-center">
        <Link
          disabled={isPending}
          to={data ? "/feeds" : "/auth"}
          className={"" + buttonVariants({ variant: "default" })}
        >
          {isPending && !data
            ? "Loading..."
            : !isPending && data
              ? "Lihat Feeds"
              : "Login"}
        </Link>
        {data && <LogoutForm />}
      </nav>
    </header>
  );
};

export default HomePageHeader;
