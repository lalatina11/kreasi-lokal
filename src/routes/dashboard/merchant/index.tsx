import { createFileRoute, useRouter } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/merchant/")({
  component: RouteComponent,
});

function RouteComponent() {
  const router = useRouter();
  return () => router.navigate({ to: "/" });
}
