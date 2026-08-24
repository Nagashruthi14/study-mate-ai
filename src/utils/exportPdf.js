import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

// ============================================================
// HELPER: Write text with **bold** support in jsPDF
// ============================================================
function writeRichText(doc, text, x, y, maxWidth, fontSize) {
  var segments = text.split(/\*\*(.*?)\*\*/g)
  var currentX = x
  var lineH = fontSize * 0.48

  for (var i = 0; i < segments.length; i++) {
    var isBold = (i % 2 === 1)
    doc.setFontSize(fontSize)
    doc.setFont('helvetica', isBold ? 'bold' : 'normal')

    var segment = segments[i]
    if (!segment) continue

    var words = segment.split(' ')
    for (var w = 0; w < words.length; w++) {
      var word = words[w]
      if (!word) continue
      var wordW = doc.getTextWidth(word)

      if (currentX + wordW > x + maxWidth && currentX > x) {
        y += lineH
        currentX = x
        if (y > 275) return y
      }

      if (currentX > x) {
        doc.setFontSize(fontSize)
        doc.setFont('helvetica', isBold ? 'bold' : 'normal')
        doc.text(' ', currentX, y)
        currentX += doc.getTextWidth(' ')
      }

      doc.setFontSize(fontSize)
      doc.setFont('helvetica', isBold ? 'bold' : 'normal')
      doc.text(word, currentX, y)
      currentX += wordW
    }
  }

  return y
}

// Clean markdown markers (keep ** for bold parsing, strip rest)
function cleanForPdf(text) {
  if (!text) return ''
  return text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .replace(/^### (.*$)/gm, '$1')
    .replace(/^## (.*$)/gm, '$1')
    .replace(/^# (.*$)/gm, '$1')
    .replace(/^\- /gm, '• ')
    .replace(/^\d+\. /gm, '')
    .replace(/\*(?!\*)(.*?)\*/g, '$1')
    .trim()
}

// ============================================================
// EXPORT QUIZ PDF
// ============================================================
export function exportQuizPdf(quizData, userAnswers, score) {
  var doc = new jsPDF()
  var pw = doc.internal.pageSize.getWidth()
  var y = 20

  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text('StudyMate AI - Quiz Results', pw / 2, y, { align: 'center' })
  y += 12

  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.text('Score: ' + score.correct + '/' + quizData.length + ' (' + score.percentage + '%)', 14, y)
  y += 6
  doc.text('Correct: ' + score.correct + '  |  Wrong: ' + score.wrong, 14, y)
  y += 10

  for (var i = 0; i < quizData.length; i++) {
    var q = quizData[i]
    if (y > 270) { doc.addPage(); y = 20 }

    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    var qText = (i + 1) + '. ' + q.question
    var lines = doc.splitTextToSize(qText, pw - 28)
    doc.text(lines, 14, y)
    y += lines.length * 5 + 2

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    for (var oi = 0; oi < q.options.length; oi++) {
      var isCor = oi === q.correct
      var isUser = userAnswers[i] === oi
      var prefix = isCor ? '[CORRECT] ' : (isUser ? '[YOUR ANSWER] ' : '')
      var letter = String.fromCharCode(65 + oi)
      var optText = '  ' + letter + ') ' + q.options[oi] + ' ' + prefix
      var optLines = doc.splitTextToSize(optText, pw - 35)
      doc.text(optLines, 20, y)
      y += optLines.length * 4.5 + 1
    }
    y += 4
  }

  doc.save('studymate-quiz-results.pdf')
}

// ============================================================
// EXPORT SINGLE ANSWER PDF
// ============================================================
export function exportAnswerPdf(question, answer) {
  var doc = new jsPDF()
  var pw = doc.internal.pageSize.getWidth()
  var y = 20

  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('StudyMate AI - Answer', pw / 2, y, { align: 'center' })
  y += 14

  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  var qLines = doc.splitTextToSize('Q: ' + question, pw - 28)
  doc.text(qLines, 14, y)
  y += qLines.length * 6 + 8

  var cleanAnswer = cleanForPdf(answer)
  var answerLines = cleanAnswer.split('\n')

  for (var j = 0; j < answerLines.length; j++) {
    var line = answerLines[j].trim()
    if (!line) { y += 3; continue }

    if (y > 275) { doc.addPage(); y = 20 }

    y = writeRichText(doc, line, 14, y, pw - 28, 11)
    y += 6
  }

  doc.save('studymate-answer.pdf')
}

// ============================================================
// EXPORT FULL CHAT PDF
// ============================================================
export function exportChatPdf(chatHistory, docName) {
  var doc = new jsPDF()
  var pw = doc.internal.pageSize.getWidth()
  var y = 20

  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text('StudyMate AI - Chat History', pw / 2, y, { align: 'center' })
  y += 12

  if (docName) {
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.text('Document: ' + docName, pw / 2, y, { align: 'center' })
    y += 10
  }

  for (var i = 0; i < chatHistory.length; i++) {
    var item = chatHistory[i]

    if (y > 270) { doc.addPage(); y = 20 }

    // Question
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    var qText = 'Q' + (i + 1) + ': ' + item.question
    var qLines = doc.splitTextToSize(qText, pw - 28)
    doc.text(qLines, 14, y)
    y += qLines.length * 6 + 4

    // Answer with bold support
    var cleanAnswer = cleanForPdf(item.answer)
    var aLines = cleanAnswer.split('\n')

    for (var j = 0; j < aLines.length; j++) {
      var line = aLines[j].trim()
      if (!line) { y += 2; continue }

      if (y > 278) { doc.addPage(); y = 20 }

      y = writeRichText(doc, line, 14, y, pw - 28, 11)
      y += 5
    }
    y += 10
  }

  doc.save('studymate-chat-history.pdf')
}

// ============================================================
// EXPORT MIND MAP AS IMAGE / PDF
// ============================================================
export async function exportElementAsPng(element, filename) {
  var fn = filename || 'studymate-mindmap.png'
  var canvas = await html2canvas(element, {
    backgroundColor: null,
    scale: 2,
    useCORS: true
  })
  var link = document.createElement('a')
  link.download = fn
  link.href = canvas.toDataURL('image/png')
  link.click()
}

export async function exportElementAsPdf(element, filename) {
  var fn = filename || 'studymate-mindmap.pdf'
  var canvas = await html2canvas(element, {
    backgroundColor: null,
    scale: 2,
    useCORS: true
  })
  var imgData = canvas.toDataURL('image/png')
  var pdf = new jsPDF('l', 'mm', 'a4')
  var pdfW = pdf.internal.pageSize.getWidth()
  var pdfH = pdf.internal.pageSize.getHeight()
  var imgW = canvas.width
  var imgH = canvas.height
  var ratio = Math.min(pdfW / imgW, pdfH / imgH)
  var posX = (pdfW - imgW * ratio) / 2
  var posY = (pdfH - imgH * ratio) / 2
  if (posX < 5) posX = 5
  if (posY < 5) posY = 5
  pdf.addImage(imgData, 'PNG', posX, posY, imgW * ratio, imgH * ratio)
  pdf.save(fn)
}