# sside.net

[sside.net](https://sside.net)の中身です。

## 開発環境

### Pre requested

- Node 18
- Docker compose

とりあえずローカルで動かすまで

```bash
yarn
docker compose up database
yarn dev
```

## デプロイ

TBD

## 環境変数

開発時には.env に、デプロイ後は実行環境で設定しておく。

- NODE_ENV
- DATABASE_URL
  - https://www.prisma.io/docs/reference/database-reference/connection-urls
  - PostgreSQL
- ADMINISTRATOR_EMAIL_ADDRESS
- ADMINISTRATOR_PASSWORD
- SESSION_COOKIE_SECRET
- POSTGRES_USER
- POSTGRES_PASSWORD
- PGPASSWORD
- POSTGRES_DB
- STAGE
  - https-portal の本番設定。本番は必ず production に。

## 本番環境

1. docker compose 入れる
2. docker-compose.yml を引っ張ってくる
3. docker compose up -d
