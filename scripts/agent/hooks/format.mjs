// PostToolUse: 編集されたファイルを Biome で整形する。整形に失敗しても作業は止めない
import { execFileSync } from "node:child_process";
import { editedFiles, readInput, repoRoot } from "./lib.mjs";

const files = editedFiles(readInput()).filter((f) => /\.(ts|tsx|js|mjs|cjs|json)$/.test(f));
if (files.length > 0) {
  try {
    execFileSync(
      "pnpm",
      ["exec", "biome", "check", "--write", "--no-errors-on-unmatched", ...files],
      {
        cwd: repoRoot(),
        stdio: "ignore",
      },
    );
  } catch {
    // lint の指摘が残っていても、ここでは止めない（止まる前の検証 verify-on-stop で確かめる）
  }
}
