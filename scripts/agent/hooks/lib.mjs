// Claude Code と Codex の Hook で共有する小さな道具。入力 JSON の違い（ツール名・引数の形）をここで吸収する
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

export const readInput = () => {
  try {
    return JSON.parse(readFileSync(0, "utf8") || "{}");
  } catch {
    return {};
  }
};

export const repoRoot = () =>
  execFileSync("git", ["rev-parse", "--show-toplevel"], { encoding: "utf8" }).trim();

/** 編集されようとしている（された）ファイルのパス。Claude は file_path、Codex は apply_patch のパッチ本文から取る */
export function editedFiles(input) {
  const ti = input.tool_input ?? {};
  if (typeof ti.file_path === "string") return [ti.file_path];
  if (input.tool_name === "apply_patch" && typeof ti.command === "string") {
    return [...ti.command.matchAll(/^\*\*\* (?:Add|Update|Delete) File: (.+)$/gm)].map((m) =>
      m[1].trim(),
    );
  }
  return [];
}

/** シェルコマンド（Claude の Bash、Codex の Bash / exec_command） */
export const bashCommand = (input) =>
  input.tool_name === "Bash" || input.tool_name === "exec_command"
    ? String(input.tool_input?.command ?? "")
    : "";

/** ブロックする（両ツールとも「終了コード 2 ＋ stderr の理由」を受け付ける） */
export function block(reason) {
  process.stderr.write(`${reason}\n`);
  process.exit(2);
}
