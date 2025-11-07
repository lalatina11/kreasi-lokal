import HomePageContainer from "@/components/containers/HomePageContainer";
import { Button } from "@/components/ui/button";
import { getUserSessionByServer } from "@/server/renders/auth";
import { createFileRoute } from "@tanstack/react-router";

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

  return (
    <HomePageContainer>
      <main className="min-h-screen">
        <Button>Test</Button>
      </main>
    </HomePageContainer>
  );
}
