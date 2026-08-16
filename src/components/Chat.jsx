import React, { useState, useRef, useEffect } from 'react'
import { FiSend, FiCopy, FiMic, FiDownload } from 'react-icons/fi'
import { copyToClipboard } from '../utils/helpers'
import { exportChatPdf } from '../utils/exportPdf'
import '../css/Chat.css'

export default function Chat(props) {
  var chatHistory = props.chatHistory
  var onAsk = props.onAsk
  var isLoading = props.isLoading
  var isUploaded = props.isUploaded
  var docName = props.docName || 'Study Material'

  var qState = useState('')
  var question = qState[0]
  var setQuestion = qState[1]
  var endRef = useRef(null)

  var micSt = useState(false)
  var isListening = micSt[0]
  var setIsListening = micSt[1]
  var recRef = useRef(null)

  useEffect(function () {
    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SpeechRecognition) {
      var recognition = new SpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = 'en-US'

      recognition.onresult = function (event) {
        var transcript = event.results[0][0].transcript
        setQuestion(transcript)
        setIsListening(false)
      }
      recognition.onerror = function () { setIsListening(false) }
      recognition.onend = function () { setIsListening(false) }
      recRef.current = recognition
    }
  }, [])

  useEffect(function () {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [chatHistory])

  function handleSend() {
    if (!question.trim() || !isUploaded || isLoading) return
    onAsk(question.trim())
    setQuestion('')
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  function handleCopy(text) { copyToClipboard(text) }

  function handleMic() {
    if (!recRef.current) {
      alert('Speech-to-Text is not supported in your browser.')
      return
    }
    if (isListening) {
      recRef.current.stop()
      setIsListening(false)
    } else {
      setQuestion('')
      recRef.current.start()
      setIsListening(true)
    }
  }

  // NEW: Handle Full Chat PDF Export
  function handleDownloadChat() {
    if (chatHistory.length === 0) return
    exportChatPdf(chatHistory, docName)
  }

  if (!isUploaded) {
    return (
      <div className="chat-section">
        <div className="chat-empty">
          <p>Upload study material first to start chatting.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="chat-section">
      <div className="chat-header">
        <h3>Ask Questions</h3>
        {/* NEW: Download Chat Button */}
        {chatHistory.length > 0 && (
          <button className="chat-download-btn" onClick={handleDownloadChat} aria-label="Download Full Chat">
            <FiDownload /> Save Chat
          </button>
        )}
      </div>
      <div className="chat-messages">
        {chatHistory.length === 0 && (
          <div className="chat-welcome">
            <p>Ask any question about your study material!</p>
          </div>
        )}
        {chatHistory.map(function (item, idx) {
          return (
            <div key={idx} className="chat-item">
              <div className="chat-question">
                <span className="chat-label">You:</span>
                <span>{item.question}</span>
              </div>
              <div className="chat-answer">
                <span className="chat-label">AI:</span>
                <div className="chat-answer-text" dangerouslySetInnerHTML={{ __html: item.formattedAnswer }}></div>
                <button className="copy-btn" onClick={function () { handleCopy(item.answer) }} aria-label="Copy answer">
                  <FiCopy />
                </button>
              </div>
            </div>
          )
        })}
        {isLoading && (
          <div className="chat-typing">
            <span className="typing-dot"></span>
            <span className="typing-dot"></span>
            <span className="typing-dot"></span>
          </div>
        )}
        <div ref={endRef}></div>
      </div>
      
      <div className="chat-input-area">
        <textarea
          className="chat-input"
          placeholder={isListening ? 'Listening...' : 'Ask a question about your study material...'}
          value={question}
          onChange={function (e) { setQuestion(e.target.value) }}
          onKeyDown={handleKey}
          rows={2}
        />
        <div className="chat-input-buttons">
          <button 
            className={'mic-btn' + (isListening ? ' listening' : '')} 
            onClick={handleMic} 
            disabled={!isUploaded || isLoading} 
            aria-label="Speak question"
          >
            <FiMic />
          </button>
          <button 
            className="send-btn" 
            onClick={handleSend} 
            disabled={!question.trim() || isLoading} 
            aria-label="Send"
          >
            <FiSend />
          </button>
        </div>
      </div>
    </div>
  )
}