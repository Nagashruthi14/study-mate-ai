import React from 'react'
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa'
import '../css/Footer.css'

export default function Footer(props) {
  var onNavigate = props.onNavigate || function() {}
  var year = new Date().getFullYear()
  
  return (
    <footer className="footer">
      <div className="footer-inner">

        <div className="footer-top">
          <div className="footer-brand-area">
            <span className="footer-brand-name">StudyMate AI</span>
            <p className="footer-tagline">Your intelligent exam preparation companion</p>
            <p className="footer-tagline2">Upload, ask, quiz, and master any subject with AI power</p>
          </div>

          <div className="footer-links-area">
            <div className="footer-link-group">
              <h4>Platform</h4>
              {/* FIXED: Changed to buttons calling onNavigate */}
              <button onClick={function() { onNavigate('upload') }}>Upload</button>
              <button onClick={function() { onNavigate('quiz') }}>Quiz Generator</button>
              <button onClick={function() { onNavigate('flashcards') }}>Flashcards</button>
              <button onClick={function() { onNavigate('mindmap') }}>Mind Map</button>
            </div>
            <div className="footer-link-group">
              <h4>Connect</h4>
              <a href="https://github.com/Nagashruthi14" target="_blank" rel="noopener noreferrer">GitHub</a>
              <a href="https://linkedin.com/in/nagashruthi-ganiga-a9660532a" target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <a href="https://mail.google.com/mail/?view=cm&to=nagashruthi02@gmail.com" target="_blank" rel="noopener noreferrer">Email</a>
            </div>
          </div>
        </div>

        <div className="footer-divider"></div>

        <div className="footer-bottom">
          <div className="footer-social-row">
            <a href="https://github.com/Nagashruthi14" target="_blank" rel="noopener noreferrer" className="footer-social-btn" aria-label="GitHub"><FaGithub /></a>
            <a href="https://linkedin.com/in/nagashruthi-ganiga-a9660532a" target="_blank" rel="noopener noreferrer" className="footer-social-btn" aria-label="LinkedIn"><FaLinkedin /></a>
            <a href="https://mail.google.com/mail/?view=cm&to=nagashruthi02@gmail.com" target="_blank" rel="noopener noreferrer" className="footer-social-btn" aria-label="Email"><FaEnvelope /></a>
          </div>
          <p className="footer-copy">&copy; {year} StudyMate AI. All rights reserved.</p>
          <div className="footer-meta">
            <span className="footer-made">Developed by Nagashruthi</span>
            <span className="footer-version">v1.0.0</span>
          </div>
        </div>

      </div>
    </footer>
  )
}