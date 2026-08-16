import React, { useState } from 'react'
import { FiPlay, FiChevronLeft, FiChevronRight, FiShuffle, FiHeart } from 'react-icons/fi'
import { generateFlashcards } from '../utils/ai'
import { shuffleArray } from '../utils/helpers'
import Loader from './Loader'
import '../css/Flashcards.css'

export default function Flashcards(props) {
  var docText = props.docText
  var isUploaded = props.isUploaded
  var savedCards = props.flashcards
  var onSaveCards = props.onSaveCards
  var favs = props.favorites
  var onSaveFavs = props.onSaveFavorites

  var lState = useState(false)
  var loading = lState[0]
  var setLoading = lState[1]
  var cState = useState(savedCards || [])
  var cards = cState[0]
  var setCards = cState[1]
  var iState = useState(0)
  var idx = iState[0]
  var setIdx = iState[1]
  var fState = useState(false)
  var flipped = fState[0]
  var setFlipped = fState[1]
  var eState = useState('')
  var error = eState[0]
  var setError = eState[1]

  async function handleGenerate() {
    if (!isUploaded) return
    setLoading(true)
    setError('')
    try {
      var data = await generateFlashcards(docText)
      setCards(data)
      onSaveCards(data)
      setIdx(0)
      setFlipped(false)
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  function next() {
    if (idx < cards.length - 1) { setIdx(idx + 1); setFlipped(false) }
  }

  function prev() {
    if (idx > 0) { setIdx(idx - 1); setFlipped(false) }
  }

  function shuffle() {
    var shuffled = shuffleArray(cards)
    setCards(shuffled)
    setIdx(0)
    setFlipped(false)
  }

  function toggleFav() {
    var cardKey = cards[idx].question
    if (favs.indexOf(cardKey) >= 0) {
      onSaveFavs(favs.filter(function (f) { return f !== cardKey }))
    } else {
      onSaveFavs(favs.concat([cardKey]))
    }
  }

  if (!isUploaded) {
    return (
      <div className="flash-section">
        <div className="flash-empty"><p>Upload study material first.</p></div>
      </div>
    )
  }

  if (loading) return <Loader message="Generating flashcards..." />

  return (
    <div className="flash-section">
      <div className="flash-header">
        <h2>Flashcards</h2>
        {!cards.length && <button className="gen-btn" onClick={handleGenerate}><FiPlay /> Generate Flashcards</button>}
      </div>

      {error && <div className="flash-error">{error}</div>}

      {cards.length > 0 && (
        <div className="flash-content">
          <div className="flash-counter">{idx + 1} / {cards.length}</div>
          <div className={'flash-card' + (flipped ? ' flipped' : '')} onClick={function () { setFlipped(!flipped) }}>
            <div className="flash-front">
              <p>{cards[idx].question}</p>
              <span className="flash-hint">Click to flip</span>
            </div>
            <div className="flash-back">
              <p>{cards[idx].answer}</p>
            </div>
          </div>
          <div className="flash-controls">
            <button onClick={prev} disabled={idx === 0} aria-label="Previous"><FiChevronLeft /></button>
            <button onClick={shuffle} aria-label="Shuffle"><FiShuffle /></button>
            <button onClick={toggleFav} aria-label="Favorite" className={favs.indexOf(cards[idx].question) >= 0 ? 'fav-active' : ''}><FiHeart /></button>
            <button onClick={next} disabled={idx === cards.length - 1} aria-label="Next"><FiChevronRight /></button>
          </div>
          <button className="gen-btn" onClick={handleGenerate}><FiPlay /> Regenerate</button>
        </div>
      )}
    </div>
  )
}