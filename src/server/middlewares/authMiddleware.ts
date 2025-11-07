import { auth } from "@/lib/auth";
import { createMiddleware } from "@tanstack/react-start";
import { redirect } from "@tanstack/react-router";

export const authMiddlewareAsResponse = createMiddleware({
  type: "request",
}).server(async ({ request, next }) => {
  const { headers, url } = request;
  const { pathname } = new URL(url);
  const session = await auth.api.getSession({ headers });

  if (pathname.startsWith("/auth")) {
    if (session) {
      throw redirect({
        to: session.user.role === "admin" ? "/dashboard/admin" : "/feeds",
      });
    }
  }

  if (pathname.startsWith("/dashboard")) {
    if (!session) {
      throw redirect({ to: "/auth" });
    }
    if (session.user.role === "user") {
      throw redirect({ to: "/feeds" });
    }
    if (pathname.startsWith("/dashboard/admin")) {
      if (session.user.role !== "admin") {
        throw redirect({ to: "/dashboard/merchant" });
      }
    }
    if (pathname.startsWith("/dashboard/merchant")) {
      if (session.user.role !== "merchant") {
        throw redirect({ to: "/dashboard/admin" });
      }
    }
  }

  return await next();
});
