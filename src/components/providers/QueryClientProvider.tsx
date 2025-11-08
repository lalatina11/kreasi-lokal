import type { ReactNode } from "react";
import * as TanstackQuery from "@tanstack/react-query";

interface Props {
  children: ReactNode;
}

const QueryClientProvider = ({ children }: Props) => {
  const client = new TanstackQuery.QueryClient();
  return (
    <TanstackQuery.QueryClientProvider client={client}>
      {children}
    </TanstackQuery.QueryClientProvider>
  );
};

export default QueryClientProvider;
