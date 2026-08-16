import * as pdfjsLib from 'pdfjs-dist'
import mammoth from 'mammoth'

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/' + pdfjsLib.version + '/pdf.worker.min.mjs'

export async function extractTextFromPDF(file) {
  var ab = await file.arrayBuffer()
  var pdf = await pdfjsLib.getDocument({ data: ab }).promise
  var text = ''
  for (var i = 1; i <= pdf.numPages; i++) {
    var page = await pdf.getPage(i)
    var content = await page.getTextContent()
    text += content.items.map(function (item) { return item.str }).join(' ') + '\n'
  }
  if (!text.trim()) throw new Error('Could not extract text from this PDF.')
  return text.trim()
}

export async function extractTextFromDOCX(file) {
  var ab = await file.arrayBuffer()
  var result = await mammoth.extractRawText({ arrayBuffer: ab })
  if (!result.value.trim()) throw new Error('Could not extract text from this DOCX file.')
  return result.value.trim()
}

export async function extractTextFromTXT(file) {
  var text = await file.text()
  if (!text.trim()) throw new Error('This text file is empty.')
  return text.trim()
}

export async function extractText(file) {
  var name = file.name.toLowerCase()
  if (name.endsWith('.pdf')) return extractTextFromPDF(file)
  if (name.endsWith('.docx')) return extractTextFromDOCX(file)
  if (name.endsWith('.doc')) return extractTextFromDOCX(file)
  if (name.endsWith('.txt')) return extractTextFromTXT(file)
  throw new Error('Unsupported format. Please upload PDF, DOCX, or TXT.')
}

export var SUPPORTED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain'
]

export var SUPPORTED_EXTENSIONS = ['.pdf', '.docx', '.txt']