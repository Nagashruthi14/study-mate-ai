import React, { useState, useRef } from 'react'
import { FiUpload, FiFile, FiX, FiCheck, FiClipboard } from 'react-icons/fi'
import { extractText, SUPPORTED_EXTENSIONS } from '../utils/pdf'
import { formatFileSize } from '../utils/helpers'
import '../css/Upload.css'

export default function Upload(props) {
  var onUpload = props.onUpload
  var isUploaded = props.isUploaded
  var docName = props.docName
  var isLoading = props.isLoading

  var ref = useRef(null)
  var fState = useState(null)
  var file = fState[0]
  var setFile = fState[1]
  var dState = useState(false)
  var dragActive = dState[0]
  var setDrag = dState[1]
  var pState = useState('')
  var pasted = pState[0]
  var setPasted = pState[1]
  var mState = useState('text')
  var mode = mState[0]
  var setMode = mState[1]
  var prState = useState(0)
  var progress = prState[0]
  var setProgress = prState[1]

  function handleDrag(e) {
    e.preventDefault()
    e.stopPropagation()
  }

  function handleDragEnter(e) {
    handleDrag(e)
    setDrag(true)
  }

  function handleDragLeave(e) {
    handleDrag(e)
    setDrag(false)
  }

  function handleDrop(e) {
    handleDrag(e)
    setDrag(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
    }
  }

  function handleFileChange(e) {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  function removeFile() {
    setFile(null)
    if (ref.current) ref.current.value = ''
  }

  async function handleUpload() {
    if (mode === 'paste') {
      if (!pasted.trim()) return
      onUpload(pasted.trim(), 'Pasted Text')
      return
    }
    if (!file) return
    var name = file.name.toLowerCase()
    var valid = SUPPORTED_EXTENSIONS.some(function (ext) { return name.endsWith(ext) })
    if (!valid) {
      alert('Unsupported file type. Please upload PDF, DOCX, or TXT.')
      return
    }
    setProgress(30)
    try {
      var text = await extractText(file)
      setProgress(70)
      onUpload(text, file.name)
      setProgress(100)
    } catch (err) {
      alert(err.message)
      setProgress(0)
    }
  }

  return (
    <div className="upload-section">
      <div className="upload-header">
        <h2>Upload Study Material</h2>
        <p>Upload your document or paste text to start studying</p>
      </div>

      <div className="upload-tabs">
        <button className={'tab-btn' + (mode === 'file' ? ' active' : '')} onClick={function () { setMode('file') }}>
          <FiFile /> File Upload
        </button>
        <button className={'tab-btn' + (mode === 'paste' ? ' active' : '')} onClick={function () { setMode('paste') }}>
          <FiClipboard /> Paste Text
        </button>
      </div>

      {mode === 'file' && (
        <div className="upload-dropzone"
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragEnter}
          onDrop={handleDrop}
        >
          {file ? (
            <div className="file-preview">
              <FiFile className="file-icon" />
              <div className="file-info">
                <span className="file-name">{file.name}</span>
                <span className="file-size">{formatFileSize(file.size)}</span>
              </div>
              <button className="file-remove" onClick={removeFile} aria-label="Remove file">
                <FiX />
              </button>
            </div>
          ) : (
            <div className={'drop-content' + (dragActive ? ' drag-active' : '')}>
              <FiUpload className="drop-icon" />
              <p>Drag and drop your file here</p>
              <span>or</span>
              <button className="browse-btn" onClick={function () { ref.current.click() }}>
                Browse Files
              </button>
              <p className="drop-hint">Supports PDF, DOCX, TXT</p>
            </div>
          )}
          <input ref={ref} type="file" accept=".pdf,.docx,.txt" onChange={handleFileChange} hidden />
        </div>
      )}

      {mode === 'paste' && (
        <div className="paste-area">
          <textarea
            placeholder="Paste your study material text here..."
            value={pasted}
            onChange={function (e) { setPasted(e.target.value) }}
            rows={10}
          />
        </div>
      )}

      {progress > 0 && progress < 100 && (
        <div className="upload-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: progress + '%' }}></div>
          </div>
          <span>{progress}%</span>
        </div>
      )}

      {isUploaded ? (
        <div className="upload-ready">
          <FiCheck className="ready-icon" />
          <span>Study Material Ready: {docName}</span>
          <button className="replace-btn" onClick={function () { setFile(null); setPasted(''); setProgress(0); onUpload('', '') }}>
            Replace
          </button>
        </div>
      ) : (
        <button className="upload-btn" onClick={handleUpload} disabled={isLoading || (!file && !pasted.trim())}>
          {isLoading ? 'Processing...' : 'Upload'}
        </button>
      )}
    </div>
  )
}
