export function formatText(text) {
  if (!text) return ''
  var h = text
  h = h.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  h = h.replace(/\*(.*?)\*/g, '<em>$1</em>')
  h = h.replace(/^### (.*$)/gm, '<h4>$1</h4>')
  h = h.replace(/^## (.*$)/gm, '<h3>$1</h3>')
  h = h.replace(/^- (.*$)/gm, '<li>$1</li>')
  h = h.replace(/^[0-9]+\. (.*$)/gm, '<li>$1</li>')
  h = h.replace(/\n\n/g, '</p><p>')
  h = h.replace(/\n/g, '<br/>')
  return h
}

export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes'
  var k = 1024
  var sizes = ['Bytes', 'KB', 'MB', 'GB']
  var i = Math.floor(Math.log(bytes) / Math.log(k))
  var val = Math.round((bytes / Math.pow(k, i)) * 100) / 100
  return val + ' ' + sizes[i]
}

export function copyToClipboard(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).catch(function () {})
  } else {
    var ta = document.createElement('textarea')
    ta.value = text
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    document.body.removeChild(ta)
  }
}

export function getLoadingMessages() {
  return [
    'Uploading document...',
    'Extracting text...',
    'Understanding content...',
    'Preparing study material...',
    'Generating answer...',
    'Almost ready...',
    'Thinking...',
    'Analyzing your material...'
  ]
}

export function shuffleArray(arr) {
  var a = arr.slice()
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1))
    var temp = a[i]
    a[i] = a[j]
    a[j] = temp
  }
  return a
}