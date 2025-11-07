import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/merchant/")({
  component: RouteComponent,
  ssr: true,
  beforeLoad: () => {
    throw redirect({ to: "/dashboard/merchant/katalog" });
  },
  loader: () => {},
});

function RouteComponent() {
  return <>Merchant Dashboard</>;
}
