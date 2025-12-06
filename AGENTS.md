# Pokémon UNITE 日本プロチームリポジトリ
Pokémon UNITEの日本のプロチームの情報をまとめているリポジトリです。

## データ管理用の情報

data/ ディレクトリに、選手やチームの情報をYAML形式で保存しています。

```
data/
├── member.yaml # 選手のマスター情報
├── roster.yaml # チームに加入・脱退した選手の履歴情報
└── team.yaml   # チームのマスター情報
```

### データの追加手順

- チームに加入・脱退した選手の履歴を、検索して収集してください
- 加入・脱退の記録をroster.yamlに追加してください
  - 最初に報じた公式発表を探して、referenceとして記録してください
- member.yamlやteam.yamlに存在しない選手やチームがあれば、追加してください
  - 収集した情報の中に選手やチームの愛称や日本語表記などの情報があれば、aliasに追加してください
  - aliasは必須ではありません。aliasに相当する情報が無い場合は省略してください
- referenceに記載されているURLが間違っていないか、fetchして確認してください
- referenceに記載されているURLが404になっていることがよくあります。検索した時に得た正しいURLを記載してください
- `npm run validate`を実行して、データの整合性をチェックしてください

### データの構造

#### member.yaml

選手の一覧。キーは選手のID。

- name: 名前の最新の正式名称
- alias: 以前の名前や愛称、日本語表記などがあれば
- reference: SNS等の公式アカウントのURL。おもにTwitter

#### team.yaml

チームの一覧。キーはチームのID。

- name: チームの最新の正式名称
- alias: 以前の名称や通称などがあれば
- reference: チームまたは部門の公式サイトの正式なURL

#### roster.yaml

選手の加入・脱退の履歴。キーはチームのID。

- member: 選手のIDで、加入(in)または脱退(out)を示す
- date: 日付
- reference: 加入または脱退を最初に報じた公式発表

## 開発用の情報
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
