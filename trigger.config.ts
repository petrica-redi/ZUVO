import { defineConfig } from "@trigger.dev/sdk";

export default defineConfig({
  project: "sastipe",
  dirs: ["src/trigger"],
  maxDuration: 300,
  retries: {
    default: {
      maxAttempts: 3,
      factor: 2,
      minTimeoutInMs: 1_000,
      maxTimeoutInMs: 60_000,
      randomize: true,
    },
    enabledInDev: true,
  },
});

