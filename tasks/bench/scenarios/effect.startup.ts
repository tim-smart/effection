import * as Effect from "https://raw.githubusercontent.com/Effect-TS/effect-smol/refs/heads/deno/src/Effect.ts";
import { action } from "../../../mod.ts";
import { scenario } from "./scenario.ts";

await scenario("effect.startup", function* (_, exit) {
  let start = performance.now();

  const startup = Effect.suspend(() => {
    exit(performance.now() - start);
    return Effect.promise(() => Promise.resolve());
  });

  const fiber = Effect.runFork(startup);

  return yield* action((resolve) => fiber.addObserver(() => resolve()));
});
