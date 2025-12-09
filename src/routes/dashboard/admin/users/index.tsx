import BannedForm from "@/components/forms/BannedForm";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAllUsers } from "@/server/renders/user";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/admin/users/")({
  component: RouteComponent,
  ssr: true,
  loader: async () => {
    const users = await getAllUsers();
    return { users };
  },
});

function RouteComponent() {
  const { users } = Route.useLoaderData();
  return (
    <main className="container mx-auto flex flex-col gap-10 py-3">
      <section className="flex flex-col gap-3">
        <span>Daftar Pedagang UMKM</span>
        <Card>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">#</TableHead>
                  <TableHead>Nama Lengkap</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead className="text-center">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users
                  .filter((user) => user.role === "merchant")
                  .map((user, i) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{i + 1}</TableCell>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>
                        <div className="flex justify-center items-center">
                          <BannedForm
                            userId={user.id}
                            isBanned={user.isBanned}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>
      <Separator />
      <section className="flex flex-col gap-3">
        <span>Daftar Pelanggan UMKM</span>
        <Card>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">#</TableHead>
                  <TableHead>Nama Lengkap</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead className="text-center">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users
                  .filter((user) => user.role === "user")
                  .map((user, i) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{i + 1}</TableCell>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>
                        <div className="flex justify-center items-center">
                          <BannedForm
                            userId={user.id}
                            isBanned={user.isBanned}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
