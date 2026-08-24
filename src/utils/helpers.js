export function formatText(text) {
  if (!text) return ''
  var t = text
  t = t.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '')
  t = t.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  t = t.replace(/\*(.*?)\*/g, '<em>$1</em>')
  t = t.replace(/^### (.*$)/gm, '<h3>$1</h3>')
  t = t.replace(/^## (.*$)/gm, '<h3>$1</h3>')
  t = t.replace(/^# (.*$)/gm, '<h3>$1</h3>')
  t = t.replace(/^\- (.*$)/gm, '<li>$1</li>')
  t = t.replace(/^\d+\. (.*$)/gm, '<li>$1</li>')
  t = t.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
  t = t.replace(/\n\n/g, '</p><p>')
  t = t.replace(/\n/g, '<br>')
  if (!t.startsWith('<')) t = '<p>' + t + '</p>'
  return t
}

export function stripMarkdown(text) {
  if (!text) return ''
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/^### (.*$)/gm, '$1')
    .replace(/^## (.*$)/gm, '$1')
    .replace(/^# (.*$)/gm, '$1')
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .replace(/^\- (.*$)/gm, '• $1')
    .replace(/^\d+\. (.*$)/gm, '$1')
    .replace(/<[^>]*>?/gm, '')
    .trim()
}

export function copyToClipboard(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text)
  } else {
    var ta = document.createElement('textarea')
    ta.value = text
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    document.body.removeChild(ta)
  }
}

export function formatFileSize(bytes) {
  if (!bytes) return '0 B'
  var sizes = ['B', 'KB', 'MB', 'GB']
  var i = Math.floor(Math.log(bytes) / Math.log(1024))
  return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i]
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

export function getLoadingMessages() {
  return [
    'Analyzing your study material...',
    'Finding key concepts...',
    'Generating your content...',
    'Almost there...',
    'Finalizing results...'
  ]
}