import React, { useState } from 'react'
import { FiMenu, FiX, FiSun, FiMoon, FiUpload, FiInfo, FiRefreshCw, FiCheckSquare, FiLayers, FiGitBranch, FiTrash2, FiClock } from 'react-icons/fi'
import '../css/Navbar.css'

var NAV = [
  { id: 'upload', label: 'Upload', Icon: FiUpload },
  { id: 'quiz', label: 'Quiz', Icon: FiCheckSquare },
  { id: 'mindmap', label: 'Mind Map', Icon: FiGitBranch },
  { id: 'flashcards', label: 'Flashcards', Icon: FiLayers },
  { id: 'about', label: 'About', Icon: FiInfo }
]

export default function Navbar(props) {
  var active = props.active
  var onNav = props.onNavigate
  var theme = props.theme
  var onTheme = props.onToggleTheme
  var onRefresh = props.onRefresh
  var onToggleHistory = props.onToggleHistory
  var mob = useState(false)
  var mobileOpen = mob[0]
  var setMobile = mob[1]

  function go(id) {
    onNav(id)
    setMobile(false)
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="navbar-brand">
          <span className="navbar-title">StudyMate AI</span>
        </div>
        <div className={'navbar-links' + (mobileOpen ? ' open' : '')}>
          {NAV.map(function (item) {
            return (
              <button key={item.id} className={'nav-btn' + (active === item.id ? ' active' : '')} onClick={function () { go(item.id) }} aria-label={item.label}>
                <item.Icon className="nav-icon" />
                <span>{item.label}</span>
              </button>
            )
          })}
          <button className="nav-btn theme-btn" onClick={onTheme} aria-label="Toggle theme">
            {theme === 'light' ? <FiMoon /> : <FiSun />}
          </button>
          <button className="nav-btn refresh-btn" onClick={onRefresh} aria-label="Refresh">
            <FiRefreshCw />
            <span>Refresh</span>
          </button>
          <button className="nav-btn" onClick={onToggleHistory} aria-label="History">
            <FiClock />
            <span>History</span>
          </button>
        </div>
        <button className="mobile-btn" onClick={function () { setMobile(!mobileOpen) }} aria-label="Menu">
          {mobileOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>
    </nav>
  )
}