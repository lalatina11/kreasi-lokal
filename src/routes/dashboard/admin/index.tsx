import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/admin/")({
  component: RouteComponent,
  beforeLoad: () => {
    throw redirect({ to: "/dashboard/admin/users" });
  },
});

function RouteComponent() {
  return <div>Hello "/dashboard/admin/"!</div>;
}
