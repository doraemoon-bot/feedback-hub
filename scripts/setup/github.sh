#!/bin/bash
# GitHub 側の守りを設定する（リポジトリの管理者が1回だけ実行する）
#   - main のルールセット: PR 必須・CI 必須・強制 push 禁止・削除禁止
#   - ラベル（エージェントの状態と、任せるレベル）
# usage: scripts/setup/github.sh [owner/repo]   （省略すると今のリポジトリ）
set -euo pipefail
REPO=${1:-$(gh repo view --json nameWithOwner -q .nameWithOwner)}
echo "対象: $REPO"

# --- ルールセット（無料プランでは公開リポジトリのみ） ---
gh api -X POST "repos/$REPO/rulesets" --input - <<JSON >/dev/null && echo "✔ ルールセット protect-main を作りました"
{
  "name": "protect-main",
  "target": "branch",
  "enforcement": "active",
  "conditions": { "ref_name": { "include": ["~DEFAULT_BRANCH"], "exclude": [] } },
  "rules": [
    { "type": "deletion" },
    { "type": "non_fast_forward" },
    { "type": "pull_request", "parameters": {
        "required_approving_review_count": 0,
        "dismiss_stale_reviews_on_push": true,
        "require_code_owner_review": false,
        "require_last_push_approval": false,
        "required_review_thread_resolution": true } },
    { "type": "required_status_checks", "parameters": {
        "strict_required_status_checks_policy": false,
        "required_status_checks": [
          { "context": "check（lint・型・依存ルール・テスト）" },
          { "context": "e2e（Playwright）" },
          { "context": "secrets（gitleaks）" } ] } }
  ]
}
JSON

# --- ラベル ---
label() { gh label create "$1" --repo "$REPO" --color "$2" --description "$3" --force >/dev/null && echo "✔ ラベル $1"; }
label "agent:ready"        "0e8a16" "エージェントに実装を任せてよい（完了条件が書かれている）"
label "agent:report-only"  "c5def5" "エージェントは調べて報告するだけ（コードは変えない）"
label "agent:working"      "fbca04" "エージェントが作業中"
label "agent:auto-merge"   "5319e7" "検証を通ったら自動でマージしてよい（低リスクのみ）"
label "needs-human"        "d93f0b" "人の判断が必要（エージェントが止まって質問している）"
label "triage"             "ededed" "仕分け待ち"
label "risk:low"           "bfdadc" "影響が小さい（ドキュメント・テストのみ など）"
label "risk:high"          "b60205" "影響が大きい（DB・認証・広い範囲）"
label "type:bug"           "d73a4a" "バグ"
label "type:feature"       "a2eeef" "機能"
label "type:docs"          "0075ca" "ドキュメント"
