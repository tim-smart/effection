import * as Effect from "https://raw.githubusercontent.com/Effect-TS/effect-smol/refs/heads/deno/src/Effect.ts";
import { call } from "../../../mod.ts";
import { scenario } from "./scenario.ts";

const recurse: (
  depth: number,
) => Effect.Effect<void> = Effect.fnUntraced(function* (depth) {
  if (depth > 1) {
    return yield* recurse(depth - 1);
  }
  for (let i = 0; i < 100; i++) {
    yield* Effect.void;
  }
});

await scenario(
  "effect.recursion",
  (depth) => call(() => Effect.runPromise(recurse(depth))),
);
