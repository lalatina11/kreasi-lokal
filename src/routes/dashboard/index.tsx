import { createFileRoute, redirect } from "@tanstack/react-router";
import { getUserSessionByServer } from "@/server/renders/auth";

export const Route = createFileRoute("/dashboard/")({
  component: RouteComponent,
  ssr: true,
  beforeLoad: async () => {
    const session = await getUserSessionByServer();
    if (!session) throw redirect({ to: "/auth" });
    throw redirect({
      to:
        session.user.role === "user"
          ? "/feeds"
          : session.user.role === "merchant"
            ? "/dashboard/merchant/katalog"
            : "/dashboard/admin",
    });
  },
});

function RouteComponent() {
  return <div>Hello "/dashboard/"!</div>;
}
