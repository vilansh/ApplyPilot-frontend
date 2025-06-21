# 🛫 ApplyPilot – AI-Powered Cover Letter Generator & Gmail Outreach Automation

**ApplyPilot** is your personal AI co-pilot for job applications.  
Upload a list of recruiters or companies, and ApplyPilot will generate personalized cover letters using **Langchain + OpenAI** and send them via your **own Gmail account** with a single click.

Designed for job seekers, freelance hunters, and cold outreach warriors — ApplyPilot saves you time and boosts your chances.

---

## 🎯 Use Case

💼 Tired of rewriting cover letters for every job?  
🚀 Need personalized outreach for recruiters, companies, or startups?  
📬 Want to automate outreach using your Gmail with AI support?

**ApplyPilot handles all of this** — intelligently and securely.

---

## 🌟 Features

- 🔐 **Google Sign-In** with Firebase Authentication
- 📁 Upload **Excel/CSV** with Name, Company, Role, Email
- 🧠 Generate **personalized cover letters** using Langchain + OpenAI
- ✉️ Send via **your Gmail account** using OAuth2 and Gmail API
- 📊 Track success/failure of each email
- 🎨 Responsive frontend built with React + Tailwind CSS
- 🚀 Deployed with Vercel (frontend) & Render/Railway (backend)

---

## 🛠️ Tech Stack

| Layer           | Technology                                             |
|------------------|--------------------------------------------------------|
| **Frontend**     | React.js, Vite, Tailwind CSS                           |
| **Auth**         | Firebase Auth (Google OAuth2)                          |
| **Backend**      | Node.js, Express.js                                    |
| **AI Layer**     | Langchain, OpenAI GPT-3.5 or GPT-4                     |
| **Templating**   | Handlebars (for structured dynamic letters)            |
| **Excel Parsing**| `xlsx`                                                 |
| **Email Sender** | Gmail API (OAuth2-scoped per user)                    |
| **Optional DB**  | Firebase Firestore or MongoDB                          |
| **Deployment**   | Vercel (client), Render/Railway (server)               |

---

## 📁 Folder Structure

\`\`\`

applypilot/
├── client/              # React frontend
│   ├── components/
│   ├── pages/
│   ├── utils/
│   └── main.jsx
│
├── server/              # Node.js backend
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── index.js
│
├── shared/              # AI prompt templates
│   └── prompts/
│       └── coverLetter.hbs
│
├── .env.example
└── README.md

\`\`\``

---

## 🧾 Excel File Format

Upload an Excel or CSV file with the following headers:

| Name         | Company        | JobTitle           | Email                 |
|--------------|----------------|--------------------|------------------------|
| Alice Smith  | OpenAI         | Research Engineer  | alice@example.com      |
| John Carter  | Google         | Product Manager    | john@google.com        |

> ApplyPilot uses this data to generate and send personalized emails.

---

## 🔐 Firebase & Gmail API Setup

### 1. Firebase Auth
- Go to [Firebase Console](https://console.firebase.google.com/)
- Create a project, enable Google Sign-In
- Copy config keys and paste into `client/.env`

\`\`\`env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
\`\`\``

### 2. Gmail API

* Go to [Google Cloud Console](https://console.cloud.google.com/)
* Create OAuth Consent Screen (external)
* Enable Gmail API
* Get Client ID and Secret
* Add this to `server/.env`:

\`\`\`env
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GMAIL_REDIRECT_URI=http://localhost:5000/auth/callback
\`\`\`

---

## 📄 Langchain Prompt Template (Handlebars)

`shared/prompts/coverLetter.hbs`

\`\`\`hbs
Dear {{name}},

I'm writing to express interest in the {{jobTitle}} position at {{company}}. With my experience in {{user.skill}}, I’m confident in my ability to contribute effectively to your team.

Looking forward to the opportunity to connect further.

Sincerely,  
{{user.fullName}}
\`\`\`

---

## 🧠 AI Workflow

1. ApplyPilot uses Langchain to inject dynamic values into a prompt.
2. The prompt is sent to OpenAI GPT-3.5/GPT-4.
3. A custom letter is generated for each row in the Excel sheet.
4. The letter is then sent via the user's Gmail using Gmail API.

---

## 🧪 Local Setup Guide

### 1. Clone the Repo

\`\`\`bash
git clone https://github.com/your-username/applypilot.git
cd applypilot
\`\`\`

### 2. Setup Frontend

\`\`\`bash
cd client
npm install
npm run dev
\`\`\`

### 3. Setup Backend

\`\`\`bash
cd ../server
npm install
node index.js
\`\`\`

---

## ⚙️ .env Configuration

### client/.env

\`\`\`env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
\`\`\`

### server/.env

\`\`\`env
OPENAI_API_KEY=sk-...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GMAIL_REDIRECT_URI=http://localhost:5000/auth/callback
SESSION_SECRET=securestring
\`\`\`

---

## 🚀 Deployment Instructions

| Component | Platform                                                      | Notes                 |
| --------- | ------------------------------------------------------------- | --------------------- |
| Frontend  | [Vercel](https://vercel.com)                                  | Push from GitHub repo |
| Backend   | [Render](https://render.com) / [Railway](https://railway.app) | Deploy via Node.js    |
| Gmail API | [Google Console](https://console.cloud.google.com/)           | OAuth2 + Gmail API    |
| Firebase  | [Firebase Console](https://firebase.google.com/)              | Google Auth only      |

---

## 🔮 Future Features

* 🧾 Export generated cover letters as PDF
* 🧠 Resume-to-job match scoring using vector DB (Weaviate)
* ✍️ Tone customization (e.g. friendly, professional)
* 📊 Analytics dashboard (opens, replies)
* 🗂️ Saved campaigns and letter history

---

## 🙌 Contributing

Pull requests are welcome. Please create an issue first if you want to suggest a feature or report a bug.

\`\`\`bash
git checkout -b feature/my-feature
git commit -m "Add new feature"
git push origin feature/my-feature
\`\`\`

---

## 📄 License

MIT License © 2025 \Vilansh

---

## 🙏 Acknowledgements

Built with ❤️ using:

* [Langchain](https://www.langchain.com/)
* [OpenAI](https://platform.openai.com/)
* [Firebase](https://firebase.google.com/)
* [Google Gmail API](https://developers.google.com/gmail/api)

\`\`\`
