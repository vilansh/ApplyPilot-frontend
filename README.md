# 📄 ApplyPilot

**AI-powered Cover Letter Generator + Resume Mailer**  
ApplyPilot lets job seekers instantly generate tailored cover letters from their resumes and send them to recruiters via email – all in one click.

---

## 🚀 Features

- 📎 Upload your resume (PDF)
- 🧠 AI-generated, personalized cover letters (Gemini / HuggingFace)
- 📬 Auto-send email with resume + cover letter to recruiter
- 🧾 Gmail API integration (OAuth2.0)
- ⚙️ Backend (Express.js + Multer + pdf-parse)
- 🌐 Frontend (Next.js + TailwindCSS)
- 🔐 .env config for HuggingFace or Gemini API keys

---
https://apply-pilot-online.vercel.app/
## 📁 Project Structure

```

ApplyPilot/
│
├── ApplyPilot-frontend/       # Next.js frontend
│   ├── app/                   # Main app pages (dashboard)
│   ├── components/            # UI components
│   ├── styles/                # TailwindCSS styles
│   ├── public/                # Static files
│   └── .env.local             # Environment variables (frontend)
│
├── ApplyPilot-backend/       # Express.js backend
│   ├── routes/                # API routes (Gmail Auth, Send Mail)
│   ├── uploads/               # Uploaded resume storage
│   ├── index.ts              # Entry point
│   └── .env                  # Environment variables (backend)

````

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/ApplyPilot.git
cd ApplyPilot
````

---

### 2. Install Dependencies

#### Backend:

```bash
cd ApplyPilot-backend
npm install
```

#### Frontend:

```bash
cd ../ApplyPilot-frontend
npm install
```

---

### 3. Configure Environment Variables

#### Backend (`ApplyPilot-backend/.env`)

```env
PORT=5000
GMAIL_CLIENT_ID=your-google-client-id
GMAIL_CLIENT_SECRET=your-google-client-secret
GMAIL_REDIRECT_URI=http://localhost:5000/gmail/callback
GMAIL_REFRESH_TOKEN=your-refresh-token
```

#### Frontend (`ApplyPilot-frontend/.env.local`)

For **Gemini**:

```env
NEXT_PUBLIC_GEMINI_API_KEY=your-gemini-api-key
```

Or for **Hugging Face**:

```env
NEXT_PUBLIC_HUGGINGFACE_API_KEY=your-huggingface-api-key
```

---

### 4. Start the Application

#### Backend:

```bash
cd ApplyPilot-backend
npx ts-node index.ts
```

#### Frontend:

```bash
cd ../ApplyPilot-frontend
npm run dev
```

Open in browser: [http://localhost:3000](http://localhost:3000)

---

## 🧠 AI Models Supported

* **Google Gemini** (`gemini-pro`)
* **Hugging Face** (`flan-t5-large`, `mistralai/Mixtral` etc.)

Switch model and API key via `.env.local`.

---

## 📤 Email Integration

* Auth via Gmail OAuth2
* Sends email with:

  * 🎯 To: Recruiter's email
  * 📄 Attachment: Uploaded resume
  * 📝 Body: AI-generated cover letter

---

## 📦 Tech Stack

| Frontend     | Backend            | AI Generation             | Email Service    |
| ------------ | ------------------ | ------------------------- | ---------------- |
| Next.js 14   | Express.js         | Gemini / HF Inference API | Gmail OAuth2 API |
| Tailwind CSS | Multer + PDF-Parse | Prompt Engineering        | Nodemailer       |

---

## 🛡️ Security & Best Practices

* API keys stored in `.env.local` / `.env`
* OAuth tokens securely handled
* Resume PDFs stored in `uploads/` and optionally auto-deleted after send

---

## 💡 Future Enhancements

* 🧾 Job description-based tailoring
* 🔍 Resume parsing highlights
* 🧠 GPT-4 or Claude 3 support
* 📊 Email open/click analytics

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss.

---

## 📝 License

MIT © 2025 Vilansh Sharma

