# Contributing

Read [README](./README.md). Use the pinned Node and pnpm versions:

```sh
pnpm install --frozen-lockfile
pnpm check
```

Keep [src/bin.ts](./src/bin.ts) a direct call to the upstream public `main`.
Do not add argument parsing, subprocesses, error translation, a library API or
Task Engine logic. Keep the runtime dependency pinned to an exact published
version and update the lockfile together with the manifest.

Follow ipfsaw's direct-tool scripts, strict TypeScript, type-aware ESLint,
single-run Vitest and four global 90% coverage thresholds. Add focused behavioral
tests in [test/bin.test.ts](./test/bin.test.ts); targeted execution:

```sh
pnpm test test/bin.test.ts
```

Run the complete `pnpm check` before submitting. Real consumer smoke checks
complement mocks; neither replaces remote exact-SHA CI or publishing gates.
Do not publish, push release tags or change dist-tags without explicit approval.
