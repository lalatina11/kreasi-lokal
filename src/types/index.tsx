import { getUserSessionByServer } from "@/server/renders/auth";

export type Session = Awaited<ReturnType<typeof getUserSessionByServer>>;
