/** 開発サーバーの起動と共通スタイルの適用を確認できるトップページ。 */
export default function HomePage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-2xl font-semibold">web-auth-playground</h1>
      <p className="mt-2">Web の認証・セッション管理・認可を試す学習用アプリ。</p>
    </main>
  );
}
