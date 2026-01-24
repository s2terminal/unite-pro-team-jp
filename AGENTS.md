# Pokémon UNITE 日本プロチームリポジトリ

Pokémon UNITEの日本のプロチームの情報をまとめているリポジトリです。

## 開発用の情報

data ディレクトリに、選手やチームの情報をYAML形式で保存しています。

src ディレクトリ構成は以下のようになっています。
コンポーネントを編集する際は、以下の構成に従ってください。

```
src/
├── assets       # 画像・スタイル等
├── components   # Reactコンポーネント群 ※React限定
│   ├── layout      # Reactテーマ/ヘッダー/フッター等の大きなレイアウト
│   ├── pages       # Reactページ単位のReactコンポーネント
│   └── ui          # React小さなUIコンポーネント
├── layouts      # Astroレイアウト（全ページ共通フレーム）
├── lib          # JavaScriptドメイン/取得/整形ロジック
└── pages        # Astroルート
```

### GitHub Pages でのパス運用について

GitHub Pages (Project Pages) を想定しています。内部リンクは `src/lib/url.ts` の `href` を使い、パス判定には同ファイルの `normalizePath` を使ってベースパス(`/owner/repo/`)を取り除いてください。
