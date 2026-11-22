import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import './globals.css';

export const metadata: Metadata = {
  title: 'web-auth-playground',
  description: 'Web の認証・セッション管理・認可を試す学習用アプリ',
};

/** 共通スタイルと文書の言語を App Router 配下の全ページに適用する。 */
export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ja">
      <body className="bg-background text-foreground">{children}</body>
    </html>
  );
}
