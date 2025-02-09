<h1>
  <span>Co Email<span>
  &nbsp;
  <img src="https://img.shields.io/badge/lang-JA-brightgreen.svg" alt="Click to translate this into Japanese.">
  <img src="https://img.shields.io/badge/Powered_with-Gemini-5698EE?logoColor=white" alt="This project is built with Gemini"/>
  <img src="https://img.shields.io/badge/Google_Cloud_AI_Hackathon_2025-5698EE?logoColor=white" alt="This projec is AI Agent Hackathon with Google Cloud"/>
</h1>

Co Email is the email-review application that makes people more confident on their emails with considering about email context.

<br/>

## (Important) Regarding the trial operation period

**Note:** Currently, Co Email is going under the Google OAuth App Verification process. So, Co Email only works under the following test account for now. 😭 (After the verificaiton, we could expose this to the world! 🤩)

**Test Account:** <br/>
email: `testuserrukis@gmail.com`<br/>
password: `TestRuki,1212`<br/>

## Application Work Flow

1. Sync with your Gmail inbox.(only "personal" label for now)
2. In "Inbox", Click one of the email to reply.
3. After writing your email content, click "Review before send".
4. Go to the "ReviewBox" and select the draft email content.
5. You can see the review from the Vertex AI.

## Tech Stack

- **Language**: TypeScript
- **Frontend**: ReactJS
- **Backend**: ExpressJS
- **Auth Service**: OIDC(Oauth2.0)
- **Email Service**: Gmail API
- **AI Service**: Google Cloud Vertex API(Gemini)
- **Infra**: Google Cloud Platform(Cloud Run, Artifact Registry, Cloud Build)

## Prerequisite

- You need your Google Cloud Project set up.
- You need your Google Oauth 2.0 set up.
- You need your Goolge Vertex model set up.

## Dev Environment Setup

**Note**: Small note, please refer to this content, if you would like to connect your local docker container to your Vertext AI model. (https://medium.com/google-cloud/how-to-test-google-cloud-services-locally-in-docker-d74196147841)

1. Clone this into your local.

`git clone https://github.com/kuri-sun/ai-agent-hackathon-2025-google-cloud.git`

2. Go to `/server` directory.(If you don't have permission to execute the file, then you need to run `chmod +x ./build.sh`)

`cd ai-agent-hackathon-2025-google-cloud/server`

3. Run the script.

`./build.sh`

3. Set up environment variables. Also, fix the variables as you need.

`cp .env.example .env`

4. Run:

`docker compose up`

## References

- The Event Detail: https://zenn.dev/hackathons/2024-google-cloud-japan-ai-hackathon 
- Gmail API: https://developers.google.com/gmail/api/reference/rest/v1/users.threads/list?hl=ja 
- VertexAI Node SDK: https://www.npmjs.com/package/@google-cloud/vertexai 

---

© 2025 Haruki Kuriwada
