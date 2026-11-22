import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // リポジトリで管理する AGENTS.md を開発サーバーの自動追記から保護する。
  agentRules: false,
};

export default nextConfig;
