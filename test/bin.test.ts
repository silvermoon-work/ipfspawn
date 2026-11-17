import { afterEach, describe, expect, it, vi } from "vitest";

const { main } = vi.hoisted(() => ({
  main: vi.fn<(argv: readonly string[]) => Promise<number>>(),
}));
vi.mock("@silvermoon-work/ipfspawn", () => ({ main }));

const originalArgv = process.argv;
const originalExitCode = process.exitCode;
afterEach(() => {
  process.argv = originalArgv;
  process.exitCode = originalExitCode;
  vi.resetModules();
  vi.clearAllMocks();
});

describe("unscoped thin CLI entry", () => {
  it.each([0, 1, 2, 3, 4, 5, 6, 7, 130, 143])(
    "delegates argv exactly once and preserves exit code %s",
    async (code) => {
      const args = [
        "task",
        "query",
        "--data-dir",
        "\u542b \u7a7a\u683c/state",
        "--",
        "",
        "a b",
      ];
      process.argv = ["node", "ipfspawn", ...args];
      main.mockResolvedValue(code);
      await import("../src/bin.js");
      expect(main).toHaveBeenCalledExactlyOnceWith(args);
      expect(process.exitCode).toBe(code);
      expect(process.argv).toEqual(["node", "ipfspawn", ...args]);
    },
  );

  it("passes no user arguments without injecting options", async () => {
    process.argv = ["node", "ipfspawn"];
    main.mockResolvedValue(0);
    await import("../src/bin.js");
    expect(main).toHaveBeenCalledExactlyOnceWith([]);
    expect(process.exitCode).toBe(0);
  });

  it("awaits main rather than assigning a premature exit code", async () => {
    process.argv = ["node", "ipfspawn", "--help"];
    process.exitCode = 17;
    let complete!: (code: number) => void;
    main.mockImplementation(
      () =>
        new Promise<number>((resolve) => {
          complete = resolve;
        }),
    );
    const loading = import("../src/bin.js");
    await vi.waitFor(() => {
      expect(main).toHaveBeenCalledOnce();
    });
    expect(process.exitCode).toBe(17);
    complete(143);
    await loading;
    expect(process.exitCode).toBe(143);
  });

  it("does not catch or replace an unexpected main rejection", async () => {
    process.argv = ["node", "ipfspawn", "--help"];
    process.exitCode = 17;
    const failure = new Error("controlled main rejection");
    main.mockRejectedValue(failure);
    await expect(import("../src/bin.js")).rejects.toBe(failure);
    expect(process.exitCode).toBe(17);
    expect(main).toHaveBeenCalledExactlyOnceWith(["--help"]);
  });
});
