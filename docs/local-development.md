# ローカル開発手順

[環境構築](./project-plan.md#環境構築) で用意したアプリと PostgreSQL を、リポジトリ直下から起動・確認する手順である。
コマンド例は Windows PowerShell 用である。

## 前提と依存関係

Node.js 24 系と npm、Linux コンテナを実行できる Docker Desktop と Docker Compose を使用する。
ローカルで使う Node.js の基準バージョンは `.node-version` に記載し、GitHub Actions でも同じファイルを参照する。

Windows では、開発サーバーが依存ファイルを使用していると `npm ci` で置き換えられない場合がある。
開発サーバーを起動している場合は、依存関係を復元する前に停止する。 [アプリの起動と停止](#アプリの起動と停止)

```powershell
node --version
npm.cmd --version
docker compose version
npm.cmd ci
```

## PostgreSQL の起動と疎通確認

`.env` が未作成の場合は、`.env.example` を複製する。

```powershell
Copy-Item -LiteralPath .env.example -Destination .env
```

`POSTGRES_PASSWORD` を英数字からなるローカル専用の値に変更し、`DATABASE_URL` のパスワード部分もそろえる。
ホスト側ポートは既定で `15433` とし、変更するときは `POSTGRES_PORT` と `DATABASE_URL` の両方を更新する。
接続先は `127.0.0.1` とし、DB 名とユーザー名は `web_auth_playground` を使う。
`.env` は Git の管理対象外とする。

```powershell
docker compose up -d --wait db
docker compose ps db
npm.cmd run db:check
```

Compose のヘルスチェックは PostgreSQL が接続を受け付けられるか確認する。
`db:check` は `DATABASE_URL` を使い、Windows 側の Node.js から Postgres.js で `SELECT 1` を実行して、接続先と認証設定が合うかを確認する。

## アプリの起動と停止

Next.js のテレメトリーを無効にする環境変数を設定してから起動する。

```powershell
$env:NEXT_TELEMETRY_DISABLED = '1'
npm.cmd run dev
```

ターミナルに表示されるローカル URL をブラウザで開き、トップページの文字と共通の背景色・文字色が表示されることを確認する。
開発サーバーを停止するには、起動したターミナルで `Ctrl+C` を押す。

DB は次のコマンドで停止する。
停止後もデータはこのプロジェクトの Docker ボリュームに残る。
同じボリュームを使う間は、初期化時に設定したユーザー名とパスワードで接続する。

```powershell
docker compose stop db
```

## 書式・lint・型チェック・ビルド

書式をそろえるときは `npm.cmd run format` を実行する。
ファイルを書き換えずに確認するときは `npm.cmd run format:check` を実行する。
コード、設定、計画書・設計書などの Markdown が対象で、`AGENTS.md`、`.env*`、生成ファイルなどは `.prettierignore` で除外する。
Markdown の文章の改行は維持し、Tailwind CSS のクラスは `src/app/globals.css` の定義を参照して整列する。

`npm.cmd run check` は、書式チェック、lint、Next.js のルート型の生成を含む型チェックを順に実行する。
ビルドも確認するときは `npm.cmd run verify` を実行する。

```powershell
$env:NEXT_TELEMETRY_DISABLED = '1'
npm.cmd run verify
```

`main` 向け PR の GitHub Actions も、`npm ci` の後に同じ `npm run verify` を実行する。
DB への疎通は、[PostgreSQL の起動と疎通確認](#postgresql-の起動と疎通確認) の手順でローカル環境から確認する。

## VS Code のワークスペース設定

リポジトリのフォルダーを開くと、`.vscode/settings.json` の設定が適用される。
Prettier 拡張機能で保存時に整形し、改行コードを LF にそろえる。
明示的に保存すると、ESLint 拡張機能が自動修正し、JavaScript・TypeScript・TSX の import を VS Code が整理する。
TypeScript はワークスペースの `node_modules/typescript/lib` を使用する。
Tailwind CSS IntelliSense 拡張機能を使うと、`src/app/globals.css` を Tailwind CSS の言語モードで扱える。
