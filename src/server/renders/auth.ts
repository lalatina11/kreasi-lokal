import { auth } from "@/lib/auth";
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

export const getUserSessionByServer = createServerFn({ method: "GET" }).handler(
  async () => {
    const { headers } = getRequest();
    return await auth.api.getSession({ headers });
  }
);
