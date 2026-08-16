StudyMate AI – Intelligent Exam Preparation Platform

An AI-powered study platform that helps students prepare for exams by uploading study materials and interacting with them using Google Gemini AI.

Features :
Document Upload – Upload PDF, DOCX, TXT files or paste text directly
AI Chat – Ask unlimited questions about your uploaded study material
Reading Panel – View formatted AI answers with copy and PDF download
Quiz Generator – Generate 20 MCQs with scoring, correct/wrong tracking, and PDF export
Flashcards – AI-generated flip cards with shuffle, favorites, and navigation
Mind Map – Visual hierarchical mind map with PNG and PDF export
Dark/Light Theme – Instant toggle with localStorage persistence
Session Memory – All data persists in browser storage until refresh
Responsive Design – Works on mobile, tablet, laptop, and desktop

Tech Stack :
Frontend : React 18, Vite, JavaScript
Styling : Normal CSS, CSS Custom Properties
Icons : React Icons (Feather + Font Awesome)
AI : Google Gemini 1.5 Flash
PDF Extract : pdfjs-dist
DOCX Extract : Mammoth.js
PDF Export : jsPDF
Image Export : html2canvas
Storage : Browser localStorage
Deployment : Vercel / GitHub Pages

Folder Structure :
study-mate-ai/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── Upload.jsx
│   │   ├── Chat.jsx
│   │   ├── Reading.jsx
│   │   ├── Quiz.jsx
│   │   ├── MindMap.jsx
│   │   ├── Flashcards.jsx
│   │   ├── Loader.jsx
│   │   └── About.jsx
│   ├── css/
│   │   ├── App.css
│   │   ├── Navbar.css
│   │   ├── Upload.css
│   │   ├── Chat.css
│   │   ├── Quiz.css
│   │   ├── MindMap.css
│   │   ├── Flashcards.css
│   │   ├── Footer.css
│   │   └── About.css
│   ├── utils/
│   │   ├── gemini.js
│   │   ├── storage.js
│   │   ├── pdf.js
│   │   ├── exportPdf.js
│   │   └── helpers.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
└── README.md

How It Works :
Upload – User uploads a study document (PDF, DOCX, TXT) or pastes text
Extract – Text is extracted and stored in browser localStorage
Chat – User asks questions, Gemini AI answers based only on the uploaded material
Quiz – AI generates 20 multiple choice questions from the material
Flashcards – AI generates question/answer pairs for spaced repetition study
Mind Map – AI generates a hierarchical topic structure rendered visually
Refresh – Clears all session data and returns to initial state

