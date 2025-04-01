import * as Effect from "https://raw.githubusercontent.com/Effect-TS/effect-smol/refs/heads/deno/src/Effect.ts";
import * as Fiber from "https://raw.githubusercontent.com/Effect-TS/effect-smol/refs/heads/deno/src/Fiber.ts";
import * as Stream from "https://raw.githubusercontent.com/Effect-TS/effect-smol/refs/heads/deno/src/Stream.ts";
import { call } from "../../../mod.ts";
import { scenario } from "./scenario.ts";

export const start = Effect.fnUntraced(function* (depth: number) {
  const target = new EventTarget();
  const task = yield* Effect.fork(recurse(target, depth));
  for (let i = 0; i < 100; i++) {
    yield* Effect.sleep(0);
    target.dispatchEvent(new Event("foo"));
  }
  yield* Effect.sleep(0);
  yield* Fiber.interrupt(task);
});

const recurse: (
  target: EventTarget,
  depth: number,
) => Effect.Effect<void> = Effect.fnUntraced(function* (target, depth) {
  const eventStream = Stream.fromEventListener(target, "foo");

  if (depth > 1) {
    const subTarget = new EventTarget();
    yield* Effect.fork(recurse(subTarget, depth - 1));

    yield* Stream.runForEach(eventStream, () =>
      Effect.sync(() => {
        subTarget.dispatchEvent(new Event("foo"));
      }));
  } else {
    yield* Stream.runDrain(eventStream);
  }
});

await scenario(
  "effect.events",
  (depth) => call(() => Effect.runPromise(start(depth))),
);
