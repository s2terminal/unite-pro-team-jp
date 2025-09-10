// TODO: このファイル無くしてMeta.astroに統合した方がよさそう
export type MetaParams = {
  siteName?: string;
  title?: string;
  description?: string;
  url?: string;
  image?: string; // absolute URL preferred
  type?: 'website' | 'article' | string;
  noindex?: boolean;
  locale?: string; // e.g., ja_JP
  card?: 'summary_large_image' | 'summary';
};

export function buildMeta({
  siteName = 'Unite Pro Team JP',
  title = siteName,
  description = '日本のポケモンユナイトプロチームの情報をまとめています。',
  url = '',
  image = '',
  type = 'website',
  noindex = false,
  locale = 'ja_JP',
  card = 'summary',
}: MetaParams) {
  return {
    siteName,
    title,
    description,
    url,
    image,
    type,
    noindex,
    locale,
    twitterCard: card,
  };
}
