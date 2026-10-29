/**
 * 依存の向きのルール。違反すると `pnpm deps` が落ち、どこをどう直せばよいかを表示する。
 * エラーメッセージ（comment）は、AI エージェントが読んで直せるように「何が禁止で、どうすればよいか」まで書く。
 */
module.exports = {
  forbidden: [
    {
      name: "api-routes-no-repositories",
      comment:
        "routes から repositories / DB を直接使わない。services 経由にする（apps/api/AGENTS.md）",
      severity: "error",
      from: { path: "^apps/api/src/routes/" },
      // 型（Db）を受け渡すための type-only import は許す
      to: {
        path: ["^apps/api/src/repositories/", "^packages/db/"],
        dependencyTypesNot: ["type-only"],
      },
    },
    {
      name: "api-services-no-routes",
      comment: "services は HTTP（routes や hono）を知らない。必要な値は引数で受け取る",
      severity: "error",
      from: { path: "^apps/api/src/services/" },
      to: { path: ["^apps/api/src/routes/", "node_modules/hono/"] },
    },
    {
      name: "api-repositories-no-upper-layers",
      comment: "repositories は DB アクセスだけ。services / routes を import しない",
      severity: "error",
      from: { path: "^apps/api/src/repositories/" },
      to: { path: ["^apps/api/src/services/", "^apps/api/src/routes/"] },
    },
    {
      name: "web-no-db",
      comment:
        "画面から DB を直接使わない。lib/api.ts の型付きクライアントで API を呼ぶ（apps/web/AGENTS.md）",
      severity: "error",
      from: { path: "^apps/web/" },
      to: { path: "^packages/db/" },
    },
    {
      name: "web-only-api-app-type",
      comment: "画面が API から使ってよいのは app.ts の型（AppType）だけ。実装を import しない",
      severity: "error",
      from: { path: "^apps/web/" },
      to: { path: "^apps/api/src/", pathNot: "^apps/api/src/app\\.ts$" },
    },
    {
      name: "packages-no-apps",
      comment: "packages は apps を import しない（共有コードがアプリに依存すると循環する）",
      severity: "error",
      from: { path: "^packages/" },
      to: { path: "^apps/" },
    },
    {
      name: "no-circular",
      comment: "循環 import をなくす",
      severity: "error",
      from: {},
      to: { circular: true },
    },
  ],
  options: {
    doNotFollow: { path: "node_modules" },
    exclude: { path: ["\\.next/", "node_modules/\\.pnpm"] },
    tsPreCompilationDeps: true,
    combinedDependencies: true,
    tsConfig: { fileName: "tsconfig.base.json" },
    enhancedResolveOptions: {
      exportsFields: ["exports"],
      conditionNames: ["import", "require", "node", "default"],
    },
  },
};
