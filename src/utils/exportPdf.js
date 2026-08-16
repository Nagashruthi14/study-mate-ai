import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

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
  doc.text(
    'Score: ' + score.correct + '/' + quizData.length + ' (' + score.percentage + '%)',
    14,
    y
  )
  y += 6
  doc.text(
    'Correct: ' + score.correct + '  |  Wrong: ' + score.wrong,
    14,
    y
  )
  y += 10

  for (var i = 0; i < quizData.length; i++) {
    var q = quizData[i]
    if (y > 270) {
      doc.addPage()
      y = 20
    }

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

export function exportAnswerPdf(question, answer) {
  var doc = new jsPDF()
  var pw = doc.internal.pageSize.getWidth()
  var y = 20

  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('StudyMate AI - Answer', pw / 2, y, { align: 'center' })
  y += 12

  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  var qLines = doc.splitTextToSize('Q: ' + question, pw - 28)
  doc.text(qLines, 14, y)
  y += qLines.length * 6 + 6

  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  var aLines = doc.splitTextToSize(answer, pw - 28)
  for (var j = 0; j < aLines.length; j++) {
    if (y > 280) {
      doc.addPage()
      y = 20
    }
    doc.text(aLines[j], 14, y)
    y += 5
  }

  doc.save('studymate-answer.pdf')
}

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

    if (y > 270) { doc.addPage(); y = 20 }

    // Answer
    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    var aText = 'A: ' + item.answer
    var aLines = doc.splitTextToSize(aText, pw - 28)
    
    for (var j = 0; j < aLines.length; j++) {
      if (y > 280) { doc.addPage(); y = 20 }
      doc.text(aLines[j], 14, y)
      y += 5
    }
    y += 8 // Space between Q&A pairs
  }

  doc.save('studymate-chat-history.pdf')
}