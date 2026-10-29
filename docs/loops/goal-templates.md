# /goal と /loop のひな形

## 目標達成型: Issue を1件片付ける（/goal）

Claude Code・Codex のどちらでも使える。**完了条件は、AI の出力で示せる形にする**（Claude Code では、別の小さなモデルが会話を読んで判定するため）。

```
/goal Issue #<番号> を Skill work-issue の手順で片付ける。完了の条件は次のすべて:
- Issue の完了条件ごとにテストがあり、pnpm check が終了コード 0 で通る（最後の数行を表示する）
- self-review で reviewer と test-auditor が VERDICT: OK を出した（表示する）
- PR を作り、その URL を表示した
途中で work-issue の「止まり方」に当てはまったら、needs-human を付けて止まる。30 ターンで終わらなければ状況を報告して止まる。
```

- 途中経過: `/goal`（引数なし）／止める: `/goal clear`
- Stop の Hook（`verify-on-stop`）も効いているので、`pnpm check` が落ちたままでは止まれない（最大3回まで続ける）

## 時間起動型: PR を見張る（/loop）

```
/loop 10m /babysit-pr <PR 番号>
```

- 開いているセッションの中で動く。端末を閉じると止まる（閉じても続けたいなら Routine にする）
- Claude Code の `/loop` は7日で自動的に終わる
