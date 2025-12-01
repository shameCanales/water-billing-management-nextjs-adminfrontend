"use client";

import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const queryClient = new QueryClient(); // Query Client instance

interface TanstackProviderProps {
  children: ReactNode;
}

export default function TanstackProvider({ children }: TanstackProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
