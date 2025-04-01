import { call, type Operation, spawn } from "../../../mod.ts";
import { scenario } from "./scenario.ts";

await scenario("effection.startup", function* (_, exit) {
  let start = performance.now();

  function* startup(): Operation<void> {
    exit(performance.now() - start);
    yield* call(() => Promise.resolve());
  }

  const task = yield* spawn(() => startup());

  return yield* task;
});
