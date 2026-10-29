// Stop: エージェントが「終わった」と止まる前に pnpm check を走らせる。落ちたら理由を返して作業を続けさせる。
// - コードを変えていなければ何もしない
// - 同じセッションで続けさせるのは最大 MAX_CONTINUES 回まで（無限に続けない。超えたら止めて人に任せる）
import { execFileSync, spawnSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { readInput, repoRoot } from "./lib.mjs";

// biome-ignore lint/suspicious/noUndeclaredEnvVars: Hook 用の設定で、turbo のタスクとは無関係
const MAX_CONTINUES = Number(process.env.AGENT_STOP_MAX_CONTINUES ?? 3);
const input = readInput();
const root = repoRoot();
const done = (message) => {
  // Codex の Stop は、終了コード 0 のとき JSON を返す決まり
  process.stdout.write(JSON.stringify(message ? { systemMessage: message } : {}));
  process.exit(0);
};

const changed = execFileSync("git", ["status", "--porcelain", "--", "apps", "packages", "e2e"], {
  cwd: root,
  encoding: "utf8",
}).trim();
if (!changed) done();

const gitDir = execFileSync("git", ["rev-parse", "--absolute-git-dir"], {
  cwd: root,
  encoding: "utf8",
}).trim();
const counterDir = join(gitDir, "agent");
mkdirSync(counterDir, { recursive: true });
const counter = join(counterDir, `stop-${input.session_id ?? "unknown"}`);
let count = 0;
try {
  count = Number(readFileSync(counter, "utf8")) || 0;
} catch {}

const r = spawnSync("pnpm", ["-s", "check"], { cwd: root, encoding: "utf8" });
if (r.status === 0) {
  writeFileSync(counter, "0");
  done();
}
if (count >= MAX_CONTINUES) {
  writeFileSync(counter, "0");
  done(
    `pnpm check が ${MAX_CONTINUES} 回続けて落ちたので、これ以上は続けずに止めます。人が確認してください。`,
  );
}
writeFileSync(counter, String(count + 1));
const tail = `${r.stdout}\n${r.stderr}`.trim().split("\n").slice(-40).join("\n");
process.stderr.write(
  `pnpm check が落ちています（${count + 1}/${MAX_CONTINUES} 回目）。直してから終えてください。\n\n${tail}\n`,
);
process.exit(2);
