// GitHub Pagesなどbase配下での配信に対応するためのURLヘルパー
// - 外部URL( http:, https:, mailto:, tel: など)はそのまま返す
// - 内部パスは import.meta.env.BASE_URL を前置
// - 二重スラッシュを抑止
// - ディレクトリパス(拡張子なし/末尾が / のもの)は末尾スラッシュを強制

const EXTERNAL_RE = /^(https?:)?\/\/|^(mailto:|tel:)/i;

function isExternal(url: string): boolean {
  return EXTERNAL_RE.test(url);
}

function joinPath(...parts: string[]): string {
  // 先頭と末尾のスラッシュを調整して結合
  // ポイント:
  // - 先頭要素(BASE_URLなど)の「末尾スラッシュ」は除去しておく（結合時の // 防止）
  // - 2番目以降は両端のスラッシュを除去
  // - 空要素は弾く
  // - 最終的に先頭スラッシュを必ず1つ付与
  const cleaned = parts
    .filter(Boolean)
    .map((p, i) => {
      if (i === 0) return p.replace(/\/+$/g, ''); // 末尾スラッシュを除去
      return p.replace(/^\/+|\/+$/g, ''); // 両端を除去
    })
    .filter((p) => p.length > 0)
    .join('/');
  return '/' + cleaned.replace(/^\/+/, '');
}

function ensureDirSlash(path: string): string {
  // 拡張子らしきものがあればファイルとみなして末尾スラッシュを付けない
  // e.g. .html, .svg, .png など
  if (/\.[A-Za-z0-9]+$/.test(path)) return path;
  // 既に末尾スラッシュならそのまま
  if (path.endsWith('/')) return path;
  return path + '/';
}

export type HrefOptions = {
  // trueの場合、末尾スラッシュを強制（デフォルト: true）
  trailingSlash?: boolean;
};

/**
 * BASE_URLを考慮して内部リンクhrefを生成する。
 * - pathには先頭スラッシュなし・ありのどちらでもOK
 * - 配列を渡すと結合してくれる（['team', slug] => 'team/slug/')
 */
export function href(path: string | string[], opts: HrefOptions = {}): string {
  const baseURL = import.meta.env.BASE_URL as string;
  const trailing = opts.trailingSlash ?? true;
  const raw = Array.isArray(path) ? path.join('/') : path;
  if (!raw) return baseURL;

  // 外部URLはそのまま
  if (isExternal(raw)) return raw;

  const normalized = raw.replace(/^\/+/, '');
  let out = joinPath(baseURL, normalized);
  if (trailing) out = ensureDirSlash(out);
  return out;
}

export default href;
