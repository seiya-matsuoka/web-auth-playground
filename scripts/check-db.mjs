import postgres from 'postgres';

/** 公開 DB への誤接続を防ぐため、ローカルの接続 URL だけを使う。 */
function getLocalDatabaseUrl() {
  try {
    const url = new URL(process.env.DATABASE_URL ?? '');
    if (url.hostname === '127.0.0.1' && ['postgres:', 'postgresql:'].includes(url.protocol)) {
      return url;
    }
  } catch {
    // URL の解析エラーには接続情報が含まれ得るため、その内容は出力しない。
  }

  return undefined;
}

/** アプリと同じドライバーで、データを変更せずに接続を確認する。 */
async function checkDatabase(url) {
  const sql = postgres(url.href, {
    host: url.hostname,
    max: 1,
    connect_timeout: 5,
  });

  try {
    const [row] = await sql`SELECT 1 AS connected`;
    if (row?.connected !== 1) {
      throw new Error('Unexpected result');
    }

    console.log('ローカル PostgreSQL への接続を確認しました（SELECT 1）。');
  } catch {
    console.error(
      'ローカル PostgreSQL に接続できませんでした。DB の起動と .env の設定を確認してください。',
    );
    process.exitCode = 1;
  } finally {
    // 一度の確認でプロセスを終了できるよう、接続プールを閉じる。
    await sql.end({ timeout: 1 });
  }
}

const databaseUrl = getLocalDatabaseUrl();
if (databaseUrl) {
  await checkDatabase(databaseUrl);
} else {
  console.error(
    '.env の DATABASE_URL に 127.0.0.1 を使った PostgreSQL の接続先を設定してください。',
  );
  process.exitCode = 1;
}
