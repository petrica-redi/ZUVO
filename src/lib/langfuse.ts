import { Langfuse } from "langfuse";
import { getLangfuseConfig } from "./env";

let singleton: Langfuse | null | undefined;

// Minimal structural types that describe the Langfuse runtime API we actually use.
// The SDK types don't always surface `baseUrl` or the browser-side trace/flush API
// cleanly, so we keep these local interfaces instead of casting to `any`.
type LangfuseTraceClient = {
  update?: (patch: Record<string, unknown>) => unknown;
};

type LangfuseCompat = {
  trace?: (args: {
    name: string;
    tags?: string[];
    metadata?: Record<string, unknown>;
  }) => LangfuseTraceClient;
  flushAsync?: () => Promise<unknown>;
};

export function getLangfuse(): Langfuse | null {
  if (singleton !== undefined) return singleton;

  const cfg = getLangfuseConfig();
  if (!cfg) {
    singleton = null;
    return singleton;
  }

  // `baseUrl` is a valid LangfuseCoreOptions field but is not always reflected in the
  // per-runtime constructor overload. The cast via `unknown` avoids `any` while letting
  // the SDK validate the value at runtime.
  singleton = new Langfuse({
    publicKey: cfg.publicKey,
    secretKey: cfg.secretKey,
    baseUrl: cfg.baseUrl,
  } as unknown as ConstructorParameters<typeof Langfuse>[0]);

  return singleton;
}

export type TraceAsyncOptions = {
  name: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
};

/**
 * Wrap an async operation with a Langfuse trace and always flush in `finally`.
 * Safe when Langfuse is unconfigured — it just runs `fn()` directly.
 */
export async function traceAsync<T>(
  opts: TraceAsyncOptions,
  fn: () => Promise<T>,
): Promise<T> {
  const lf = getLangfuse();
  if (!lf) return fn();

  const lfTyped = lf as unknown as LangfuseCompat;
  const trace = lfTyped.trace?.({
    name: opts.name,
    tags: opts.tags,
    metadata: opts.metadata,
  });

  try {
    const result = await fn();
    trace?.update?.({ output: result } as Record<string, unknown>);
    return result;
  } catch (err) {
    trace?.update?.({
      statusMessage: err instanceof Error ? err.message : String(err),
      level: "ERROR",
    } as Record<string, unknown>);
    throw err;
  } finally {
    try {
      await lfTyped.flushAsync?.();
    } catch {
      // Never crash the app due to observability flushing.
    }
  }
}
