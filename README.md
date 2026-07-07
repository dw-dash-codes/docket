# 🚀 Docket | Secure, Hallucination-Free Document AI

🔗 **Live Application:** [Test Docket Here](https://docket-preview.vercel.app)

## 🎯 The Problem
As AI tools become mainstream, professionals face two critical hurdles when analyzing documents: **Data Security** and **AI Hallucinations**. 
When users upload sensitive files to public LLMs and ask questions, the AI often suffers from "knowledge bleed"—it mixes external training data with the document's content, leading to fabricated or factually incorrect answers (hallucinations). Furthermore, uploading proprietary documents to public models raises severe data privacy and compliance concerns.

## 💡 The Solution
**Docket** is a secure, full-stack AI platform engineered to completely eliminate AI hallucinations through strict context bounding. 

Built on Retrieval-Augmented Generation (RAG) principles, Docket forces the AI engine to act strictly as a reader, not a creator. When you query a document, Docket ensures the AI answers **only** using the data provided within that specific file. If the information does not exist in the uploaded document, the system explicitly states it, ensuring 100% factual reliability. Coupled with isolated user sessions, Docket keeps your queries and documents private and secure.

## ✨ Key Features
* **Zero-Hallucination Architecture:** Strict contextual boundaries ensure the AI never invents information or pulls from outside the uploaded document.
* **Data Security & Privacy:** User-isolated database architecture means your chat histories and document contexts are completely insulated.
* **Persistent Cognitive Sessions:** All interactions are securely saved in an Azure cloud database, allowing you to seamlessly return to past document analyses.
* **Enterprise-Grade Performance:** Fast, real-time responses utilizing a robust C# backend and an optimized React frontend.

## 🛠️ Tech Stack
* **Frontend:** React, Vite, JavaScript (Deployed on Vercel)
* **Backend API:** C#, ASP.NET Core 8+ (Deployed on Azure App Service)
* **Database:** Azure SQL Database (Managed via Entity Framework Core)
* **AI Engine:** Google Gemini API (Configured for strict contextual grounding)

---

## 🧪 Try it Out!
Want to test Docket's strict context enforcement without signing up? Use the following test credentials:

* **Email:** `test@gmail.com` 
* **Password:** `Test@123` 

> **Note:** Upload a document and try asking a question completely unrelated to its content to see how Docket successfully refuses to hallucinate!

---

## 👨‍💻 Developed By
**Danish Waheed**
Full-Stack Developer & Software Engineer
