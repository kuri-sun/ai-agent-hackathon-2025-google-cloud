<h1>
  <span>Co Email<span>
  &nbsp;
  <a href="README.md">
    <img src="https://img.shields.io/badge/lang-English-brightgreen.svg" alt="Click to translate this into English.">
  </a>
</h1>

Co Email は、メールの内容を考慮しながら、より自信を持ってメールを送信できるようにするメールレビューツールです。

<img src="https://img.shields.io/badge/Powered_with-Gemini-5698EE?logoColor=white" alt="このプロジェクトはGeminiで構築されています"/>
<img src="https://img.shields.io/badge/For-Google_Cloud_AI_Hackathon_2025-5698EE?logoColor=white" alt="このプロジェクトはAI Agent Hackathon with Google Cloudへ提出します。"/>

## 技術スタック

- **言語**: TypeScript
- **フロントエンド**: ReactJS
- **バックエンド**: ExpressJS
- **認証サービス**: OIDC(OAuth2.0)
- **メールサービス**: Gmail API
- **AI サービス**: Google Cloud Vertex API(Gemini)
- **インフラ**: Google Cloud Platform(Cloud Run, Artifact Registry, Cloud Build)

## 前提条件

- Google Cloud プロジェクトが設定されていること。
- Google OAuth 2.0 が設定されていること。
- Google Vertex AI モデルが設定されていること。

## セットアップ

**注**: ローカルの Docker コンテナを Vertex AI モデルに接続する方法については、以下の記事を参考にしてください。 ([https://medium.com/google-cloud/how-to-test-google-cloud-services-locally-in-docker-d74196147841](https://medium.com/google-cloud/how-to-test-google-cloud-services-locally-in-docker-d74196147841))

1. リポジトリをローカルにクローンします。

```sh
git clone https://github.com/kuri-sun/ai-agent-hackathon-2025-google-cloud.git
```

2. `/server` ディレクトリへ移動します。（実行権限がない場合は以下を実行）

```sh
cd ai-agent-hackathon-2025-google-cloud/server
chmod +x ./build.sh
```

3. スクリプトを実行します。

```sh
./build.sh
```

4. 環境変数を設定し、必要に応じて編集します。

```sh
cp .env.example .env
```

5. 以下のコマンドを実行します。

```sh
docker compose up
```

## アプリの機能

1. Gmail の受信トレイと同期します（現在は「個人」ラベルのみ対応）。
2. 受信トレイでメールを選択し、返信を作成します。
3. メール本文を作成後、「送信前にレビュー」をクリックします。
4. 「ReviewBox」に移動し、下書きメールの内容を選択します。
5. Vertex AI からのレビュー結果を確認できます。

---

© 2025 Haruki Kuriwada
