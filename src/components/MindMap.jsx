import React, { useState, useRef } from 'react'
import { FiPlay, FiDownload, FiImage } from 'react-icons/fi'
import { generateMindMap } from '../utils/ai'
import { exportElementAsPng, exportElementAsPdf } from '../utils/exportPdf'
import Loader from './Loader'
import '../css/MindMap.css'

function MindNode(props) {
  var node = props.node
  var depth = props.depth || 0
  if (!node) return null
  return (
    <div className={'mind-node depth-' + Math.min(depth, 3)}>
      <div className="mind-label">{node.topic}</div>
      {node.children && node.children.length > 0 && (
        <div className="mind-children">
          {node.children.map(function (child, i) {
            return <MindNode key={i} node={child} depth={depth + 1} />
          })}
        </div>
      )}
    </div>
  )
}

export default function MindMap(props) {
  var docText = props.docText
  var isUploaded = props.isUploaded
  var savedMap = props.mindMapData
  var onSaveMap = props.onSaveMap

  var lState = useState(false)
  var loading = lState[0]
  var setLoading = lState[1]
  var mState = useState(savedMap || null)
  var mapData = mState[0]
  var setMapData = mState[1]
  var eState = useState('')
  var error = eState[0]
  var setError = eState[1]
  var mapRef = useRef(null)

  async function handleGenerate() {
    if (!isUploaded) return
    setLoading(true)
    setError('')
    try {
      var data = await generateMindMap(docText)
      setMapData(data)
      onSaveMap(data)
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  async function handlePng() {
    if (mapRef.current) await exportElementAsPng(mapRef.current)
  }

  async function handlePdf() {
    if (mapRef.current) await exportElementAsPdf(mapRef.current)
  }

  if (!isUploaded) {
    return (
      <div className="mind-section">
        <div className="mind-empty"><p>Upload study material first.</p></div>
      </div>
    )
  }

  if (loading) return <Loader message="Generating mind map..." />

  return (
    <div className="mind-section">
      <div className="mind-header">
        <h2>Mind Map</h2>
        <div className="mind-actions">
          {!mapData && <button className="gen-btn" onClick={handleGenerate}><FiPlay /> Generate Mind Map</button>}
          {mapData && <button className="gen-btn" onClick={handleGenerate}><FiPlay /> Regenerate</button>}
          {mapData && <button className="dl-btn" onClick={handlePng}><FiImage /> PNG</button>}
          {mapData && <button className="dl-btn" onClick={handlePdf}><FiDownload /> PDF</button>}
        </div>
      </div>

      {error && <div className="mind-error">{error}</div>}

      {mapData && (
        <div className="mind-container" ref={mapRef}>
          <MindNode node={mapData} depth={0} />
        </div>
      )}
    </div>
  )
}