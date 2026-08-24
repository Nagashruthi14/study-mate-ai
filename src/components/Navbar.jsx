import React, { useState } from 'react'
import { FiUpload, FiInfo, FiRefreshCw, FiCheckSquare, FiLayers, FiGitBranch, FiTrash2, FiClock, FiSun, FiMoon } from 'react-icons/fi'
import '../css/Navbar.css'

var NAV = [
  { id: 'upload', label: 'Upload', Icon: FiUpload },
  { id: 'quiz', label: 'Quiz', Icon: FiCheckSquare },
  { id: 'mindmap', label: 'Mind Map', Icon: FiGitBranch },
  { id: 'flashcards', label: 'Cards', Icon: FiLayers },
  { id: 'about', label: 'About', Icon: FiInfo }
]

export default function Navbar(props) {
  var active = props.active
  var onNav = props.onNavigate
  var theme = props.theme
  var onTheme = props.onToggleTheme
  var onRefresh = props.onRefresh
  var onToggleHistory = props.onToggleHistory

  function go(id) {
    onNav(id)
  }

  return (
    <>
      {/* ===== TOP BAR ===== */}
      <nav className="navbar">
        <div className="navbar-inner">
          <div className="navbar-brand">
            <span className="navbar-title">StudyMate AI</span>
          </div>
          <div className="navbar-desktop-links">
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
          {/* Mobile top-right: theme + history + refresh */}
          <div className="navbar-mobile-top">
            <button className="nav-icon-btn" onClick={onToggleHistory} aria-label="History">
              <FiClock />
            </button>
            <button className="nav-icon-btn" onClick={onRefresh} aria-label="Refresh">
              <FiRefreshCw />
            </button>
            <button className="nav-icon-btn" onClick={onTheme} aria-label="Toggle theme">
              {theme === 'light' ? <FiMoon /> : <FiSun />}
            </button>
          </div>
        </div>
      </nav>

      {/* ===== BOTTOM BAR (mobile only) ===== */}
      <div className="navbar-bottom">
        {NAV.map(function (item) {
          return (
            <button key={item.id} className={'bottom-tab' + (active === item.id ? ' active' : '')} onClick={function () { go(item.id) }} aria-label={item.label}>
              <item.Icon className="bottom-tab-icon" />
              <span className="bottom-tab-label">{item.label}</span>
            </button>
          )
        })}
      </div>
    </>
  )
}