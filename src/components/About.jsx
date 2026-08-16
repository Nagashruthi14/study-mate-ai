import React from 'react'
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa'
import { FiBook, FiGrid, FiShare2, FiLayers, FiCpu } from 'react-icons/fi'
import '../css/About.css'

export default function About() {
  return (
    <div className="about-section">
      <div className="about-header">
        <h2>About StudyMate AI</h2>
        <p>An intelligent exam preparation platform powered by AI</p>
      </div>

      <div className="about-grid">
        <div className="about-card">
          <FiBook className="about-icon" />
          <h3>Purpose</h3>
          <p>Help students prepare for exams by uploading study materials and interacting with them using AI. Ask questions, generate quizzes, study with flashcards, and visualize concepts with mind maps.</p>
        </div>

        <div className="about-card">
          <FiGrid className="about-icon" />
          <h3>Features</h3>
          <ul>
            <li>Upload PDF, DOCX, or TXT files</li>
            <li>AI-powered chat with your documents</li>
            <li>Generate quizzes with scoring</li>
            <li>Interactive flashcards</li>
            <li>Visual mind maps</li>
            <li>Dark and light themes</li>
            <li>Session persistence</li>
            <li>Export as PDF and PNG</li>
          </ul>
        </div>

        <div className="about-card">
          <FiCpu className="about-icon" />
          <h3>Tech Stack</h3>
          <ul>
            <li>React 18</li>
            <li>Vite</li>
            <li>OpenRouter AI (NVIDIA Nemotron)</li>
            <li>PDF.js</li>
            <li>Mammoth.js</li>
            <li>jsPDF</li>
            <li>html2canvas</li>
            <li>React Icons</li>
          </ul>
        </div>

        <div className="about-card">
          <FiLayers className="about-icon" />
          <h3>Developer</h3>
          <div className="dev-info">
            <p><strong>Name:</strong> Nagashruthi</p>
            <div className="dev-links">
              <a href="https://github.com/Nagashruthi14" target="_blank" rel="noopener noreferrer"><FaGithub /> GitHub</a>
              <a href="https://linkedin.com/in/nagashruthi-ganiga-a9660532a" target="_blank" rel="noopener noreferrer"><FaLinkedin /> LinkedIn</a>
              <a href="https://mail.google.com/mail/?view=cm&to=nagashruthi02@gmail.com" target="_blank" rel="noopener noreferrer"><FaEnvelope /> Email</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}