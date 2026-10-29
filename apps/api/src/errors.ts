/** サービス層が投げるエラー。HTTP のステータスへの変換は app.ts だけが行う */
export class NotFoundError extends Error {}
export class ConflictError extends Error {}
export class ForbiddenError extends Error {}
