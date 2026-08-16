import React, { useState } from 'react'
import { FiCopy, FiDownload, FiVolume2, FiPause, FiFileText } from 'react-icons/fi'
import { copyToClipboard } from '../utils/helpers'
import { exportAnswerPdf } from '../utils/exportPdf'
import '../css/Chat.css'

export default function Reading(props) {
  var chatHistory = props.chatHistory
  var isUploaded = props.isUploaded
  var summary = props.summary
  var onSummary = props.onSummary
  var isLoading = props.isLoading

  var spkSt = useState(false)
  var isSpeaking = spkSt[0]
  var setSpeaking = spkSt[1]

  if (!isUploaded) return null

  // Determine what to show: Summary if it exists, otherwise latest chat
  var latest = chatHistory.length > 0 ? chatHistory[chatHistory.length - 1] : null
  var displayHtml = summary || (latest ? latest.formattedAnswer : '')
  var displayText = summary || (latest ? latest.answer : '')
  var displayTitle = summary ? "Document Summary" : (latest ? latest.question : "Reading Panel")

  function handleCopy() {
    copyToClipboard(displayText)
  }

  function handleDownload() {
    exportAnswerPdf(displayTitle, displayText)
  }

  function toggleSpeech() {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-Speech is not supported in your browser.')
      return
    }
    
    if (isSpeaking) {
      window.speechSynthesis.cancel()
      setSpeaking(false)
    } else {
      // Strip HTML tags for speech
      var plainText = displayText.replace(/<[^>]*>?/gm, '')
      var utterance = new SpeechSynthesisUtterance(plainText)
      utterance.onend = function() { setSpeaking(false) }
      window.speechSynthesis.speak(utterance)
      setSpeaking(true)
    }
  }

  return (
    <div className="reading-section">
      <div className="reading-header">
        <h3>{displayTitle}</h3>
        <div className="reading-actions">
          {/* NEW: Summary Button */}
          {!summary && (
            <button onClick={onSummary} disabled={isLoading} aria-label="Generate Summary">
              <FiFileText /> Summarize
            </button>
          )}
          {/* NEW: Text-to-Speech Button */}
          <button onClick={toggleSpeech} aria-label="Read Aloud">
            {isSpeaking ? <FiPause /> : <FiVolume2 />} {isSpeaking ? 'Stop' : 'Listen'}
          </button>
          <button onClick={handleCopy} aria-label="Copy"><FiCopy /> Copy</button>
          <button onClick={handleDownload} aria-label="Download PDF"><FiDownload /> PDF</button>
        </div>
      </div>
      <div className="reading-answer" dangerouslySetInnerHTML={{ __html: displayHtml }}></div>
    </div>
  )
}