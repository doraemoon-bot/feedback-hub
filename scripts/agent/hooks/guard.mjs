// PreToolUse: Claude Code と Codex の両方で「やってはいけない操作」を、実行される前に止める。
// 権限設定（.claude/settings.json の deny、Codex のサンドボックス）と重ねて使う。どちらか一方が抜けても止まるように。
import { existsSync, readFileSync } from "node:fs";
import { isAbsolute, relative, resolve } from "node:path";
import { bashCommand, block, editedFiles, readInput, repoRoot } from "./lib.mjs";

const input = readInput();
const root = repoRoot();
const rel = (p) => relative(root, isAbsolute(p) ? p : resolve(root, p));

// --- ファイルの編集 ---
// ハーネス自身・CI・ロックファイル・秘密情報は、エージェントに書き換えさせない（人が PR で直す）
const PROTECTED = [
  [/^\.github\/workflows\//, "CI の定義"],
  [/^scripts\/agent\//, "エージェント用のハーネス"],
  [/^\.claude\/settings\.json$/, "Claude Code の権限・Hook 設定"],
  [/^\.codex\//, "Codex の設定・Hook"],
  [/^(biome\.json|\.dependency-cruiser\.cjs|turbo\.json)$/, "検証ルールの設定"],
  [/^pnpm-lock\.yaml$/, "ロックファイル（依存の追加は人が行う）"],
  [/^\.env(\.(?!example$)[^/]+)?$/, "秘密情報（.env）"],
];
const SKIP = /\b(test|it|describe)\.(skip|only|todo)\(|[{,]\s*(skip|only|todo)\s*:/;

for (const file of editedFiles(input).map(rel)) {
  const hit = PROTECTED.find(([re]) => re.test(file));
  if (hit)
    block(`${file} は${hit[1]}なので、エージェントは編集できない。必要なら理由を書いて人に頼む。`);

  // 適用済みのマイグレーションは手で直さない（packages/db/AGENTS.md）
  if (/^packages\/db\/migrations\//.test(file) && existsSync(resolve(root, file))) {
    block(
      `${file} は既存のマイグレーション。編集せず、スキーマを変えて pnpm db:generate で新しいものを足す。`,
    );
  }

  // テストを消す・弱める編集を止める（足すのは自由）
  if (/\.test\.tsx?$|^e2e\//.test(file)) {
    const ti = input.tool_input ?? {};
    const added = [ti.new_string, ti.content, ...(ti.edits ?? []).map((e) => e.new_string)]
      .filter(Boolean)
      .join("\n");
    const patch = typeof ti.command === "string" ? ti.command : "";
    const patchAdded = patch
      .split("\n")
      .filter((l) => l.startsWith("+"))
      .join("\n");
    const patchRemoved = patch.split("\n").filter((l) => l.startsWith("-") && !l.startsWith("---"));
    if (SKIP.test(added) || SKIP.test(patchAdded)) {
      block(
        `${file}: テストに skip / only / todo を足さない。落ちるテストは直すか、人に相談する。`,
      );
    }
    const old = existsSync(resolve(root, file)) ? readFileSync(resolve(root, file), "utf8") : null;
    const editRemoves = [ti, ...(ti.edits ?? [])].some(
      (e) =>
        typeof e.old_string === "string" &&
        !String(e.new_string ?? "").includes(e.old_string.trim()),
    );
    const writeReplaces =
      old !== null && typeof ti.content === "string" && !ti.content.includes(old.trim());
    if (editRemoves || writeReplaces || patchRemoved.length > 0) {
      block(
        `${file}: 既存のテストを消す・書き換える編集は止めている。仕様が変わって直す必要があるなら、理由を書いて人に確認する。`,
      );
    }
  }
}

// --- シェルコマンド ---
const cmd = bashCommand(input);
const RULES = [
  [/\b(pnpm|npm|yarn|bun)\s+(add|install\s+\S|i\s+\S)/, "依存の追加は人が行う（AGENTS.md）"],
  [/\bgit\s+push\b.*(\s--force\b|\s-f\b|--force-with-lease)/, "強制 push は禁止"],
  [/\bgit\s+push\b[^|;&]*\b(main|master)\b/, "main へ直接 push しない。ブランチを切って PR にする"],
  [/\bgit\s+reset\s+--hard\b/, "git reset --hard は作業を消すので、人が判断する"],
  [/\bgh\s+pr\s+merge\b/, "マージは人が行う"],
  [/\bgh\s+(repo\s+delete|secret|variable)\b/, "リポジトリの削除や Secrets の操作は人が行う"],
  [/\brm\s+-[a-zA-Z]*r[a-zA-Z]*f?\s+(\/|~|\$HOME|\.\.)(\s|$)/, "広い範囲の削除は禁止"],
  [/\b(curl|wget)\b[^|]*\|\s*(sh|bash|zsh)\b/, "ダウンロードしたスクリプトをそのまま実行しない"],
  [
    /\b(cat|less|head|tail|grep)\b[^|;&]*\.env(\.(?!example)\w+)?(\s|$)/,
    ".env（秘密情報）を読まない",
  ],
];
for (const [re, why] of RULES) if (cmd && re.test(cmd)) block(`止めた操作: ${cmd}\n理由: ${why}`);
