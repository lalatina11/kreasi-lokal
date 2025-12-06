import DashboardPageContainer from "@/components/containers/DashboardPageContainer";
import NotFound from "@/components/NotFound";
import { getUserSessionByServer } from "@/server/renders/auth";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
  notFoundComponent: () => <NotFound />,
  ssr: true,
  loader: async () => {
    const session = await getUserSessionByServer();
    if (!session) throw redirect({ to: "/auth" });
    if (session.user.role === "user") throw redirect({ to: "/feeds" });
    return { session };
  },
});

function RouteComponent() {
  const { session } = Route.useLoaderData();
  return (
    <div>
      <DashboardPageContainer session={session}>
        <Outlet />
      </DashboardPageContainer>
    </div>
  );
}
