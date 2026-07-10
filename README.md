# SortMail

> **AI-Powered Gmail Inbox Triage built with Next.js, MongoDB, GPT-4o, and the Gmail API.**

SortMail is an AI-powered Gmail inbox management application that intelligently organizes emails using Large Language Models. After securely authenticating with Google OAuth, users can grant access to their Gmail inbox. The application retrieves emails using the Gmail API, analyzes their content through GPT-4o via Mesh API, and automatically classifies them into meaningful categories such as **Urgent**, **Needs Reply**, **Finance**, **Work**, **Personal**, and **Promotions**.

Instead of manually searching through hundreds of emails, SortMail helps users prioritize important conversations and maintain a clean, organized inbox.

---

## Features

* Secure Google OAuth Authentication
* Gmail API Integration
* AI-powered Email Classification
* Intelligent Inbox Triage
* Automatic Smart Tagging
* Priority Detection
* Responsive Dashboard
* MongoDB Data Persistence
* GPT-4o Integration through Mesh API

---

## AI Categories

SortMail automatically classifies emails into categories including:

* Urgent
* Needs Reply
* Early Reply
* Finance
* Work
* Personal
* Promotions
* Newsletters
* Social
* Spam

---

## Tech Stack

### Framework

* Next.js 15
* TypeScript
* Tailwind CSS

### Database

* MongoDB

### Authentication

* Google OAuth 2.0

### AI

* GPT-4o
* Mesh API

### APIs

* Gmail API

---

## Architecture

```text
                    +------------------+
                    |      User        |
                    +------------------+
                              |
                              v
                    +------------------+
                    |    Next.js App   |
                    | Frontend + APIs  |
                    +------------------+
                      |            |
                      |            |
                      v            v
              +-------------+  +-------------+
              | Gmail API   |  | MongoDB     |
              +-------------+  +-------------+
                      |
                      v
               +---------------+
               |   Mesh API    |
               +---------------+
                      |
                      v
               +---------------+
               |    GPT-4o     |
               +---------------+
                      |
                      v
        AI Email Classification & Smart Tagging
```

---

## How It Works

1. Users sign in securely using Google OAuth.
2. Gmail API retrieves the user's emails after permission is granted.
3. Next.js processes email metadata and content.
4. Email content is sent to GPT-4o through Mesh API.
5. GPT-4o analyzes and classifies each email.
6. Classification results are stored in MongoDB.
7. Users can browse their inbox with AI-generated categories and priorities.

---

## Project Structure

```text
sortmail/
│
├── app/
│   ├── (auth)/
│   ├── dashboard/
│   ├── api/
│   └── layout.tsx
│
├── components/
├── lib/
├── hooks/
├── actions/
├── types/
├── public/
├── styles/
├── middleware.ts
├── package.json
├── tsconfig.json
└── README.md
```

---

## Installation

Clone the repository.

```bash
git clone https://github.com/your-username/sortmail.git
```

Navigate to the project directory.

```bash
cd sortmail
```

Install dependencies.

```bash
npm install
```

Create an environment file.

```bash
cp .env.example .env.local
```

Configure your environment variables.

```env
MONGODB_URI=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

NEXTAUTH_SECRET=
NEXTAUTH_URL=

OPENAI_API_KEY=
MESH_API_KEY=

GMAIL_REDIRECT_URI=
```

Run the development server.

```bash
npm run dev
```

Visit:

```
http://localhost:3000
```

---

## Environment Variables

| Variable               | Description                |
| ---------------------- | -------------------------- |
| `MONGODB_URI`          | MongoDB connection string  |
| `GOOGLE_CLIENT_ID`     | Google OAuth Client ID     |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret |
| `NEXTAUTH_SECRET`      | NextAuth secret            |
| `NEXTAUTH_URL`         | Application URL            |
| `OPENAI_API_KEY`       | GPT-4o API Key             |
| `MESH_API_KEY`         | Mesh API Key               |
| `GMAIL_REDIRECT_URI`   | Google OAuth Redirect URL  |

---

## Future Improvements

* AI-generated email replies
* One-click smart reply suggestions
* AI-powered email summaries
* Calendar integration
* Natural language inbox search
* Background synchronization
* Multi-account Gmail support
* User-defined AI labels
* Real-time notifications
* Inbox analytics and productivity insights

---

## Screenshots

Add screenshots for:

* Login Page
* Dashboard
* AI Email Classification
* Tagged Inbox
* Email Details
* Analytics (optional)

---

## Author

**Harsh Kharwar**

**Project:** SortMail

**Project ID:** WK02 – Inbox Triage

---

## License

This project is licensed under the MIT License.
