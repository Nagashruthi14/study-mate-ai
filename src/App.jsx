import React, { useState, useEffect } from 'react'
import { FiTrash2 } from 'react-icons/fi'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Upload from './components/Upload'
import Chat from './components/Chat'
import Quiz from './components/Quiz'
import MindMap from './components/MindMap'
import Flashcards from './components/Flashcards'
import About from './components/About'
import Loader from './components/Loader'
import { askQuestion } from './utils/ai'
import { formatText } from './utils/helpers'
import {
  getDocumentText, setDocumentText,
  getDocumentName, setDocumentName,
  getChatHistory, setChatHistory,
  getQuizData, setQuizData as saveQuizToStorage,
  getFlashcards, setFlashcards as saveFlashToStorage,
  getMindMapData, setMindMapData as saveMapToStorage,
  getTheme, setTheme as saveThemeToStorage,
  getQuizAnswers, setQuizAnswers,
  getFavorites, setFavorites as saveFavsToStorage,
  clearAll,
  getHistory, saveToHistory, clearHistory, deleteHistoryItem
} from './utils/storage'
import './css/App.css'

export default function App() {
  var navState = useState('upload')
  var active = navState[0]
  var setActive = navState[1]

  var docState = useState('')
  var docText = docState[0]
  var setDocText = docState[1]

  var nameState = useState('')
  var docName = nameState[0]
  var setDocName = nameState[1]

  var chatState = useState([])
  var chatHistory = chatState[0]
  var setChatHist = chatState[1]

  var quizSt = useState([])
  var quizData = quizSt[0]
  var setQuizDataLocal = quizSt[1]

  var flashSt = useState([])
  var flashcards = flashSt[0]
  var setFlashLocal = flashSt[1]

  var mapSt = useState(null)
  var mindMapData = mapSt[0]
  var setMapLocal = mapSt[1]

  var themeSt = useState('light')
  var theme = themeSt[0]
  var setTheme = themeSt[1]

  var favSt = useState([])
  var favorites = favSt[0]
  var setFavs = favSt[1]

  var loadSt = useState(false)
  var isLoading = loadSt[0]
  var setIsLoading = loadSt[1]

  var msgSt = useState('')
  var loadingMsg = msgSt[0]
  var setLoadingMsg = msgSt[1]

  var errSt = useState('')
  var error = errSt[0]
  var setError = errSt[1]

  var histSt = useState([])
  var historyList = histSt[0]
  var setHistoryList = histSt[1]

  var showHistSt = useState(false)
  var showHistory = showHistSt[0]
  var setShowHistory = showHistSt[1]

  var sumSt = useState('')
  var summary = sumSt[0]
  var setSummary = sumSt[1]

  useEffect(function () {
    var st = getTheme()
    setTheme(st)
    document.documentElement.setAttribute('data-theme', st)
    var sd = getDocumentText()
    if (sd) {
      setDocText(sd)
      setDocName(getDocumentName())
    }
    var sc = getChatHistory()
    if (sc.length) setChatHist(sc)
    var sq = getQuizData()
    if (sq.length) setQuizDataLocal(sq)
    var sf = getFlashcards()
    if (sf.length) setFlashLocal(sf)
    var sm = getMindMapData()
    if (sm) setMapLocal(sm)
    var sv = getFavorites()
    if (sv.length) setFavs(sv)
    setHistoryList(getHistory())
  }, [])

  useEffect(function () {
    if (docText) setDocumentText(docText)
  }, [docText])

  useEffect(function () {
    if (docName) setDocumentName(docName)
  }, [docName])

  useEffect(function () {
    if (chatHistory.length > 0) setChatHistory(chatHistory)
  }, [chatHistory])

  function handleThemeToggle() {
    var next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    saveThemeToStorage(next)
    document.documentElement.setAttribute('data-theme', next)
  }

  function handleUpload(text, name) {
    setDocText(text)
    setDocName(name)
    setDocumentText(text)
    setDocumentName(name)
    setSummary('')
  }

  function handleAsk(question) {
    if (!docText) return
    setIsLoading(true)
    setLoadingMsg('Generating answer...')
    setError('')
    askQuestion(docText, question, chatHistory).then(function (answer) {
      var formatted = formatText(answer)
      var entry = { question: question, answer: answer, formattedAnswer: formatted }
      var newHist = chatHistory.concat([entry])
      setChatHist(newHist)
      setChatHistory(newHist)
      setIsLoading(false)
    }).catch(function (err) {
      setError(err.message || 'Failed to get answer.')
      setIsLoading(false)
    })
  }

  function handleSummary() {
    if (!docText) return
    setIsLoading(true)
    setLoadingMsg('Generating summary...')
    setError('')
    askQuestion(docText, 'Provide a comprehensive summary of this document. Cover all main topics and key points.', []).then(function (answer) {
      setSummary(formatText(answer))
      setIsLoading(false)
    }).catch(function (err) {
      setError(err.message || 'Failed to generate summary.')
      setIsLoading(false)
    })
  }

  function handleClearChat() {
    setChatHist([])
    setChatHistory([])
    setSummary('')
  }

  function handleSaveQuiz(data) {
    setQuizDataLocal(data)
    saveQuizToStorage(data)
  }

  function handleSaveFlash(data) {
    setFlashLocal(data)
    saveFlashToStorage(data)
  }

  function handleSaveMap(data) {
    setMapLocal(data)
    saveMapToStorage(data)
  }

  function handleSaveFavs(data) {
    setFavs(data)
    saveFavsToStorage(data)
  }

  function handleDeleteHistory(id) {
    deleteHistoryItem(id)
    setHistoryList(getHistory())
  }

  function handleRefresh() {
    if (docText && docText.trim()) {
      var session = {
        id: Date.now(),
        date: new Date().toLocaleString(),
        docName: docName,
        docText: docText,
        chatHistory: chatHistory
      }
      saveToHistory(session)
      setHistoryList(getHistory())
    }
    clearAll()
    setDocText('')
    setDocName('')
    setChatHist([])
    setQuizDataLocal([])
    setFlashLocal([])
    setMapLocal(null)
    setFavs([])
    setSummary('')
    setActive('upload')
  }

  function handleClearHistory() {
    clearHistory()
    setHistoryList([])
  }

  function handleRestore(session) {
    setDocText(session.docText)
    setDocName(session.docName)
    setDocumentText(session.docText)
    setDocumentName(session.docName)
    if (session.chatHistory && session.chatHistory.length) {
      setChatHist(session.chatHistory)
      setChatHistory(session.chatHistory)
    }
    setSummary('')
    setShowHistory(false)
    setActive('upload')
  }

  var isUploaded = docText.length > 0

  function renderContent() {
    if (active === 'upload') {
      return (
        <div className="upload-chat-layout">
          <Upload onUpload={handleUpload} isUploaded={isUploaded} docName={docName} isLoading={isLoading} />
          {isUploaded && (
            <Chat
              chatHistory={chatHistory}
              onAsk={handleAsk}
              onClearChat={handleClearChat}
              isLoading={isLoading}
              isUploaded={isUploaded}
              docName={docName}
              summary={summary}
              onSummary={handleSummary}
            />
          )}
        </div>
      )
    }
    if (active === 'quiz') {
      return <Quiz docText={docText} isUploaded={isUploaded} quizData={quizData} onSaveQuiz={handleSaveQuiz} />
    }
    if (active === 'mindmap') {
      return <MindMap docText={docText} isUploaded={isUploaded} mindMapData={mindMapData} onSaveMap={handleSaveMap} />
    }
    if (active === 'flashcards') {
      return <Flashcards docText={docText} isUploaded={isUploaded} flashcards={flashcards} onSaveCards={handleSaveFlash} favorites={favorites} onSaveFavorites={handleSaveFavs} />
    }
    if (active === 'about') {
      return <About />
    }
    return null
  }

  return (
    <div className="app">
      <Navbar
        active={active}
        onNavigate={function (id) { setActive(id); setShowHistory(false) }}
        theme={theme}
        onToggleTheme={handleThemeToggle}
        onRefresh={handleRefresh}
        isUploaded={isUploaded}
        onToggleHistory={function () { setShowHistory(!showHistory) }}
      />
      <main className="main">
        {isLoading && <Loader message={loadingMsg} />}
        {error && <div className="app-error">{error}</div>}

        {showHistory && (
          <div className="history-panel">
            <div className="history-header">
              <h3>Session History</h3>
              <button className="history-clear-btn" onClick={handleClearHistory}>Clear All</button>
              <button className="history-close-btn" onClick={function () { setShowHistory(false) }}>Close</button>
            </div>
            {historyList.length === 0 ? (
              <p className="history-empty">No saved sessions yet.</p>
            ) : (
              <div className="history-list">
                {historyList.map(function (session) {
                  return (
                    <div key={session.id} className="history-item">
                      <div className="history-item-info" onClick={function () { handleRestore(session) }}>
                        <div className="history-item-name">{session.docName}</div>
                        <div className="history-item-date">{session.date}</div>
                        <div className="history-item-chats">{session.chatHistory ? session.chatHistory.length : 0} msgs</div>
                      </div>
                      <button className="history-delete-btn" onClick={function (e) { e.stopPropagation(); handleDeleteHistory(session.id) }} aria-label="Delete session">
                        <FiTrash2 />
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {renderContent()}
      </main>
     <Footer onNavigate={function (id) { setActive(id); setShowHistory(false) }} />
    </div>
  )
}