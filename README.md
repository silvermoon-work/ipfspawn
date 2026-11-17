# ipfspawn

Thin unscoped CLI entry for
[`@silvermoon-work/ipfspawn`](https://www.npmjs.com/package/@silvermoon-work/ipfspawn),
following the delegate-package pattern used by
[`ipfsaw`](https://github.com/silvermoon-work/ipfsaw).

This package is a local release candidate, not a claim of npm publication.
`ipfspawn@0.2.1-rc.0` depends only on the exact
`@silvermoon-work/ipfspawn@0.2.1` runtime package.

## CLI

After installation:

```sh
ipfspawn --help
ipfspawn --version
ipfspawn task --help
```

The entry imports `main` from the scoped package's public root export, forwards
`process.argv.slice(2)` unchanged, awaits completion and preserves its exit code.
Unlike ipfsaw, this upstream package does not export a `/cli` subpath.
There is no child process, nested npx, argument rewriting, extra library API or
copy of the Task Engine implementation.

The upstream owns command parsing, output, configuration, local server lifecycle,
signals and task execution. Help and version are delegated too; version reports
the scoped implementation's version. Unexpected rejected promises are not caught
or replaced by this alias. See the upstream help and documentation for supported
commands and behavior.

## Development

Use Node `26.13.1` from [.node-version](./.node-version) and pnpm `11.28.12`
from [package.json](./package.json). The consumer Node range is identical to
the upstream package: `^22.15.0 || >=23.5.0`.

```sh
pnpm install --frozen-lockfile
pnpm check
node dist/bin.js --help
node dist/bin.js --version
```

This is one root package, not a monorepo. The workspace configuration only defines
installation policies. Runtime dependencies are resolved from the configured
registry, not local tarballs, overrides or workspace links.

pnpm recorded release-age exceptions only for the exact newly released versions
of `@silvermoon-work/ipfspawn`, `@silvermoon-work/task-engine` and
`@silvermoon-work/task-protocol` at `0.2.1`, plus the pinned publish gate at
`0.1.0`. These entries do not disable supply-chain checks globally or cover
future versions.

| Command              | Purpose                                               |
| -------------------- | ----------------------------------------------------- |
| `pnpm build`         | Clean dist and emit ESM, declarations and maps        |
| `pnpm typecheck`     | Strict source, test and Vitest configuration checking |
| `pnpm lint`          | Type-aware ESLint with zero warnings                  |
| `pnpm format-check`  | Read-only Prettier check                              |
| `pnpm format`        | Explicit formatting                                   |
| `pnpm test`          | Single-run delegation tests                           |
| `pnpm test-coverage` | All source, four global thresholds of 90%             |
| `pnpm lint-package`  | Strict publint package validation                     |
| `pnpm check`         | All quality gates in the order above                  |

`check` runs format-check, build, typecheck, lint, test-coverage and lint-package,
stopping at the first failure. Mock tests verify forwarding, completion, exit
codes and rejection propagation; they do not prove upstream task behavior.
CI also checks Node `22.15.0` and `24.11.1`, with real help/version smoke checks.

For independent delivery verification, build and pack with lifecycle hooks
disabled, then install the tarball in a fresh consumer with scripts disabled.
Inspect the packed manifest for the exact scoped dependency and compare help,
version, invalid-command stdout/stderr and exit status with the real scoped bin.
The delivery allowlist contains only dist, src, README, LICENSE and the manifest;
it excludes tests, development configuration and dependency directories.

## Publication boundary

The [publish workflow](./.github/workflows/publish-npm.yaml) follows ipfsaw:
[deliverable.yaml](./deliverable.yaml) declares the single npm package and
`prepublishOnly` invokes the exact installed
`@silvermoon-work/devtool.publish-gate@0.1.0`.

- Only `ipfspawn@<version>` tag pushes enter the real publication path.
- Manual workflow dispatch is always dry-run.
- The gate requires successful exact-SHA main-push CI, including compatibility
  and aggregate jobs, and checks ancestry, version, tag and registry dependencies.
- Configure the GitHub `npm` environment and npm Trusted Publisher for this
  repository, `publish-npm.yaml` and that environment. No stored npm token.
- Stable versions use `latest`; release candidates use `rc`.

Creating this package does **not** authorize publication, tag pushes, dist-tag
changes or remote artifact uploads. Exact version/commit authorization and the
remote checks and publisher configuration are required before release. Local
checks do not establish that Trusted Publishing is configured.

## License

MIT. See [LICENSE](./LICENSE).
