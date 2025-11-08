import ModeSetting from "@/components/ModeSetting";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/setting")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="flex flex-col gap-3 min-h-screen container mx-auto mt-4">
      <section className="flex flex-col gap-3">
        <Card>
          <CardHeader>
            <CardTitle>Tema Web:</CardTitle>
            <CardDescription>Ubah Tema webmu!</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-3 gap-4">
            <ModeSetting />
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
