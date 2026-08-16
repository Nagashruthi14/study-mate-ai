import React, { useState, useEffect } from 'react'
import { FiZap } from 'react-icons/fi'
import { getLoadingMessages } from '../utils/helpers'

export default function Loader({ message }) {
  const [dotCount, setDotCount] = useState(0)
  const [msgIdx, setMsgIdx] = useState(0)
  const msgs = getLoadingMessages()

  useEffect(function () {
    var d = setInterval(function () {
      setDotCount(function (p) { return (p + 1) % 4 })
    }, 400)
    var m = setInterval(function () {
      setMsgIdx(function (p) { return (p + 1) % msgs.length })
    }, 2500)
    return function () {
      clearInterval(d)
      clearInterval(m)
    }
  }, [msgs.length])

  var displayMsg = message || msgs[msgIdx]
  var dots = '.'.repeat(dotCount)

  return (
    <div className="loader-overlay">
      <div className="loader-card">
        <div className="loader-spinner">
          <FiZap className="loader-icon" />
        </div>
        <p className="loader-text">{displayMsg}{dots}</p>
      </div>
    </div>
  )
}