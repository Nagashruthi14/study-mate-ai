import React, { useState, useRef, useEffect } from 'react'
import { FiSend, FiCopy, FiMic, FiDownload, FiVolume2, FiPause, FiTrash2, FiMaximize2, FiMinimize2 } from 'react-icons/fi'
import { copyToClipboard, stripMarkdown } from '../utils/helpers'
import { exportChatPdf, exportAnswerPdf } from '../utils/exportPdf'
import '../css/Chat.css'
import React, { useState, useRef, useEffect } from 'react'

export default function Chat(props) {
  var chatHistory = props.chatHistory
  var onAsk = props.onAsk
  var onClearChat = props.onClearChat
  var isLoading = props.isLoading
  var isUploaded = props.isUploaded
  var docName = props.docName || 'Study Material'
  var summary = props.summary
  var onSummary = props.onSummary

  var qState = useState('')
  var question = qState[0]
  var setQuestion = qState[1]
  var endRef = useRef(null)

  var micSt = useState(false)
  var isListening = micSt[0]
  var setIsListening = micSt[1]
  var recRef = useRef(null)

  var spkSt = useState(null)
  var speakingIdx = spkSt[0]
  var setSpeakingIdx = spkSt[1]

  var fsSt = useState(false)
  var isExpanded = fsSt[0]
  var setExpanded = fsSt[1]

    var hasContent = chatHistory.length > 0 || summary
  var didAutoExpand = useRef(false)

  if (hasContent && !didAutoExpand.current) {
    didAutoExpand.current = true
    setExpanded(true)
  }

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
  }, [chatHistory, isLoading])

  

  useEffect(function () {
    function handleKey(e) {
      if (e.key === 'Escape' && isExpanded) {
        setExpanded(false)
      }
    }
    document.addEventListener('keydown', handleKey)
    return function () { document.removeEventListener('keydown', handleKey) }
  }, [isExpanded])

    useEffect(function () {
    if (isExpanded) {
      document.body.style.overflow = 'hidden'
      document.body.classList.add('chat-fullscreen-active')
    } else {
      document.body.style.overflow = ''
      document.body.classList.remove('chat-fullscreen-active')
    }
    return function () { document.body.style.overflow = ''; document.body.classList.remove('chat-fullscreen-active') }
  }, [isExpanded])

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

  function handleCopy(text) {
    copyToClipboard(stripMarkdown(text))
  }

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

  function toggleSpeech(idx, text) {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-Speech is not supported in your browser.')
      return
    }
    if (speakingIdx === idx) {
      window.speechSynthesis.cancel()
      setSpeakingIdx(null)
    } else {
      window.speechSynthesis.cancel()
      var plainText = text.replace(/<[^>]*>?/gm, '')
      var utterance = new SpeechSynthesisUtterance(plainText)
      utterance.onend = function () { setSpeakingIdx(null) }
      utterance.onerror = function () { setSpeakingIdx(null) }
      window.speechSynthesis.speak(utterance)
      setSpeakingIdx(idx)
    }
  }

  function handleDownloadAnswer(idx, item) {
    var title = item.question || 'Answer'
    exportAnswerPdf(title, item.answer)
  }

  function handleDownloadChat() {
    if (chatHistory.length === 0) return
    exportChatPdf(chatHistory, docName)
  }

  function handleClear() {
    if (chatHistory.length === 0 && !summary) return
    if (confirm('Clear all questions and answers?')) {
      onClearChat()
      setExpanded(false)
    }
  }

  if (!isUploaded) {
    return (
      <div className="chat-panel">
        <div className="chat-empty">
          <p>Upload study material first to start chatting.</p>
        </div>
      </div>
    )
  }

  var panelClass = 'chat-panel'
  if (isExpanded) panelClass += ' chat-expanded'
  if (summary && chatHistory.length === 0) panelClass += ' chat-summary-only'

  return (
    <div className={panelClass}>
      <div className="chat-top-bar">
        <h3>Study Chat</h3>
        <div className="chat-top-actions">
          {chatHistory.length > 0 && (
            <button className="chat-action-btn" onClick={handleDownloadChat} aria-label="Download Chat">
              <FiDownload /> <span>Save All</span>
            </button>
          )}
          {hasContent && (
            <button className="chat-clear-btn" onClick={handleClear} aria-label="Clear Chat">
              <FiTrash2 /> <span>Clear</span>
            </button>
          )}
          <button
            className="chat-expand-btn"
            onClick={function () { setExpanded(!isExpanded) }}
            aria-label={isExpanded ? 'Minimize' : 'Maximize'}
            title={isExpanded ? 'Minimize (Esc)' : 'Maximize'}
          >
            {isExpanded ? <FiMinimize2 /> : <FiMaximize2 />}
          </button>
        </div>
      </div>

      {summary && (
        <div className="summary-banner">
          <div className="summary-banner-header">
            <strong>Document Summary</strong>
            <div className="summary-banner-actions">
              <button onClick={function () { toggleSpeech('summary', summary) }} aria-label="Listen">
                {speakingIdx === 'summary' ? <FiPause /> : <FiVolume2 />}
              </button>
              <button onClick={function () { exportAnswerPdf('Summary', summary) }} aria-label="Download PDF">
                <FiDownload />
              </button>
              <button onClick={function () { handleCopy(summary) }} aria-label="Copy">
                <FiCopy />
              </button>
            </div>
          </div>
          <div className="summary-banner-body" dangerouslySetInnerHTML={{ __html: summary }}></div>
        </div>
      )}

      <div className="chat-messages">
        {chatHistory.length === 0 && !summary && (
          <div className="chat-welcome">
            <p>Ask any question about your study material!</p>
          </div>
        )}
        {chatHistory.map(function (item, idx) {
          return (
            <div key={idx} className="chat-item">
              <div className="chat-question">
                <span className="chat-label">You</span>
                <span>{item.question}</span>
              </div>
              <div className="chat-answer">
                <span className="chat-label">AI</span>
                <div className="chat-answer-text" dangerouslySetInnerHTML={{ __html: item.formattedAnswer }}></div>
                <div className="chat-answer-actions">
                  <button
                    className={'chat-act-btn' + (speakingIdx === idx ? ' active' : '')}
                    onClick={function () { toggleSpeech(idx, item.answer) }}
                    aria-label="Listen"
                  >
                    {speakingIdx === idx ? <FiPause /> : <FiVolume2 />}
                  </button>
                  <button className="chat-act-btn" onClick={function () { handleCopy(item.answer) }} aria-label="Copy">
                    <FiCopy />
                  </button>
                  <button className="chat-act-btn" onClick={function () { handleDownloadAnswer(idx, item) }} aria-label="Download PDF">
                    <FiDownload />
                  </button>
                </div>
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
          rows={1}
        />
        <div className="chat-input-buttons">
          <button
            className={'mic-btn' + (isListening ? ' listening' : '')}
            onClick={handleMic}
            disabled={!isUploaded || isLoading}
            aria-label="Speak"
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