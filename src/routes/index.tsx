import HomePageContainer from "@/components/containers/HomePageContainer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getUserSessionByServer } from "@/server/renders/auth";
import { createFileRoute, Link } from "@tanstack/react-router";

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
      <main className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-4">
          Selamat datang di{" "}
          <span className="text-primary-500">Kreasi Lokal</span>
        </h1>
        <p className="text-lg mb-10">
          Temukan produk terbaik dari penjual lokal dan toko online.
        </p>
        <Card className="flex flex-col items-center gap-4 p-8 rounded-lg">
          <CardContent className="grid grid-cols-2 gap-2">
            {!session ? (
              <Button asChild variant="default" size="lg">
                <Link to="/auth">Masuk</Link>
              </Button>
            ) : (
              <Button asChild>
                <Link to="/feeds">Lihat Feeds</Link>
              </Button>
            )}
            <Button className="h-full" asChild>
              <Link to="/products">Lihat Produk</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    </HomePageContainer>
  );
}
