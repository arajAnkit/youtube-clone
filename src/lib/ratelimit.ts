import { Ratelimit } from "@upstash/ratelimit";

import { redis } from "./radis";

export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "10s"),
});
