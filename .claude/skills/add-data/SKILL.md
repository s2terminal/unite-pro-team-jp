---
name: 選手データ
description: 選手データを反映するための管理と追加手順
---

## データ管理用の情報

data/ ディレクトリに、選手やチームの情報をYAML形式で保存しています。

```
data/
├── member.yaml # 選手のマスター情報
├── roster.yaml # チームに加入・脱退した選手の履歴情報
└── team.yaml   # チームのマスター情報
```

### データの追加手順

- データを反映するには必ずyamlファイルに記載し、ソースコードに直接変更を加えないでください
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

## URLの内容がうまく取得できない場合

URLの内容がうまく取得できない場合は https://r.jina.ai/ を利用することでMarkdownで取得できます。
例: https://r.jina.ai/https://example.com/path/to/page
