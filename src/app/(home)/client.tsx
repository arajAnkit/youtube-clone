"use client";

import { trpc } from "@/trpc/client";

export const PageClient = () => {
  const [data] = trpc.hello.useSuspenseQuery({
    text: "arajAnkit",
  });
  return <div>Greeting: {data.greeting}</div>;
};
