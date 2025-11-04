import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

const getUserSessionByServer = createServerFn({ method: "GET" }).handler(
  async () => {
    const { headers } = getRequest();
    return await auth.api.getSession({ headers });
  }
);

export const Route = createFileRoute("/")({
  component: App,
  ssr: true,
  loader: async () => {
    const session = await getUserSessionByServer();
    return { session };
  },
});

function App() {
  const { session } = Route.useLoaderData();
  console.log(session);

  return (
    <main className="min-h-screen">
      <Button>Test</Button>
    </main>
  );
}
