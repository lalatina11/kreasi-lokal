import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/merchant/katalog")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>this is your /products</div>;
}
