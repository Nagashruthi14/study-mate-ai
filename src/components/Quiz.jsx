import React, { useState } from 'react'
import { FiPlay, FiCheck, FiDownload, FiInfo } from 'react-icons/fi'
import { generateQuiz, explainQuizAnswer } from '../utils/ai'
import { exportQuizPdf } from '../utils/exportPdf'
import { formatText } from '../utils/helpers'
import Loader from './Loader'
import '../css/Quiz.css'

export default function Quiz(props) {
  var docText = props.docText
  var isUploaded = props.isUploaded
  var savedQuiz = props.quizData
  var onSaveQuiz = props.onSaveQuiz

  var lState = useState(false)
  var loading = lState[0]
  var setLoading = lState[1]
  var qState = useState(savedQuiz || [])
  var quiz = qState[0]
  var setQuiz = qState[1]
  var aState = useState({})
  var answers = aState[0]
  var setAnswers = aState[1]
  var sState = useState(false)
  var submitted = sState[0]
  var setSubmitted = sState[1]
  var eState = useState('')
  var error = eState[0]
  var setError = eState[1]

  // NEW: Explanation State
  var expSt = useState({})
  var explanations = expSt[0]
  var setExplanations = expSt[1]
  var expLoadSt = useState({})
  var loadingExps = expLoadSt[0]
  var setLoadingExps = expLoadSt[1]

  async function handleGenerate() {
    if (!isUploaded) return
    setLoading(true)
    setError('')
    setExplanations({}) // clear old explanations
    try {
      var data = await generateQuiz(docText)
      setQuiz(data)
      onSaveQuiz(data)
      setAnswers({})
      setSubmitted(false)
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  function selectAnswer(qIdx, oIdx) {
    if (submitted) return
    var copy = Object.assign({}, answers)
    copy[qIdx] = oIdx
    setAnswers(copy)
  }

  function handleSubmit() {
    setSubmitted(true)
  }

  function getScore() {
    var correct = 0
    for (var i = 0; i < quiz.length; i++) {
      if (answers[i] === quiz[i].correct) correct++
    }
    var wrong = Object.keys(answers).length - correct
    var total = quiz.length
    var pct = total > 0 ? Math.round((correct / total) * 100) : 0
    return { correct: correct, wrong: wrong, total: total, percentage: pct }
  }

  function handleDownload() {
    var score = getScore()
    exportQuizPdf(quiz, answers, score)
  }

  // NEW: Handle Explain Why
  async function handleExplain(qi) {
    var q = quiz[qi]
    var correctAnswer = q.options[q.correct]
    var userAnswer = answers[qi] !== undefined ? q.options[answers[qi]] : "No answer"

    // Set loading true for this specific question
    var newLoad = Object.assign({}, loadingExps)
    newLoad[qi] = true
    setLoadingExps(newLoad)

    try {
      var text = await explainQuizAnswer(docText, q.question, correctAnswer, userAnswer)
      var formatted = formatText(text)
      
      var newExps = Object.assign({}, explanations)
      newExps[qi] = formatted
      setExplanations(newExps)
    } catch (err) {
      var errExps = Object.assign({}, explanations)
      errExps[qi] = "Failed to load explanation."
      setExplanations(errExps)
    }

    var resetLoad = Object.assign({}, loadingExps)
    resetLoad[qi] = false
    setLoadingExps(resetLoad)
  }

  if (!isUploaded) {
    return (
      <div className="quiz-section">
        <div className="quiz-empty"><p>Upload study material first to generate a quiz.</p></div>
      </div>
    )
  }

  if (loading) return <Loader message="Generating quiz..." />

  return (
    <div className="quiz-section">
      <div className="quiz-header">
        <h2>Quiz Generator</h2>
        {!quiz.length && <button className="gen-btn" onClick={handleGenerate}><FiPlay /> Generate Quiz</button>}
      </div>

      {error && <div className="quiz-error">{error}</div>}

      {quiz.length > 0 && (
        <div className="quiz-list">
          {quiz.map(function (q, qi) {
            var isWrong = submitted && answers[qi] !== q.correct
            return (
              <div key={qi} className="quiz-item">
                <p className="quiz-question">{qi + 1}. {q.question}</p>
                <div className="quiz-options">
                  {q.options.map(function (opt, oi) {
                    var cls = 'quiz-option'
                    if (submitted && oi === q.correct) cls += ' correct'
                    if (submitted && answers[qi] === oi && oi !== q.correct) cls += ' wrong'
                    if (!submitted && answers[qi] === oi) cls += ' selected'
                    return (
                      <button key={oi} className={cls} onClick={function () { selectAnswer(qi, oi) }}>
                        {String.fromCharCode(65 + oi)}) {opt}
                      </button>
                    )
                  })}
                </div>
                
                {/* NEW: Explain Why Section */}
                {isWrong && !explanations[qi] && (
                  <button className="explain-btn" onClick={function () { handleExplain(qi) }} disabled={loadingExps[qi]}>
                    <FiInfo /> {loadingExps[qi] ? 'Explaining...' : 'Explain Why'}
                  </button>
                )}
                {explanations[qi] && (
                  <div className="quiz-explanation" dangerouslySetInnerHTML={{ __html: explanations[qi] }}></div>
                )}
              </div>
            )
          })}
          {!submitted ? (
            <button className="submit-btn" onClick={handleSubmit}><FiCheck /> Submit Quiz</button>
          ) : (
            <div className="quiz-results">
              <h3>Results</h3>
              <div className="score-grid">
                <div className="score-item"><span className="score-val">{getScore().correct}</span><span>Correct</span></div>
                <div className="score-item"><span className="score-val">{getScore().wrong}</span><span>Wrong</span></div>
                <div className="score-item"><span className="score-val">{getScore().percentage}%</span><span>Score</span></div>
              </div>
              <button className="download-btn" onClick={handleDownload}><FiDownload /> Download PDF</button>
              <button className="gen-btn" onClick={handleGenerate}><FiPlay /> Regenerate</button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}