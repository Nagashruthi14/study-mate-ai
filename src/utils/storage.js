function getFromStorage(key) {
  try {
    var value = localStorage.getItem(key);
    if (value) return JSON.parse(value);
    return null;
  } catch (e) {
    return null;
  }
}

function setToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('Storage write failed', e);
  }
}

var KEYS = {
  DOC_TEXT: 'sm_doc_text',
  DOC_NAME: 'sm_doc_name',
  CHAT: 'sm_chat',
  QUIZ: 'sm_quiz',
  FLASH: 'sm_flash',
  MAP: 'sm_map',
  THEME: 'sm_theme',
  QUIZ_ANS: 'sm_quiz_ans',
  FAVS: 'sm_favs'
};

export function getDocumentText() { return getFromStorage(KEYS.DOC_TEXT) || ''; }
export function setDocumentText(t) { setToStorage(KEYS.DOC_TEXT, t); }
export function getDocumentName() { return getFromStorage(KEYS.DOC_NAME) || ''; }
export function setDocumentName(n) { setToStorage(KEYS.DOC_NAME, n); }
export function getChatHistory() { return getFromStorage(KEYS.CHAT) || []; }
export function setChatHistory(h) { setToStorage(KEYS.CHAT, h); }
export function getQuizData() { return getFromStorage(KEYS.QUIZ) || []; }
export function setQuizData(d) { setToStorage(KEYS.QUIZ, d); }
export function getFlashcards() { return getFromStorage(KEYS.FLASH) || []; }
export function setFlashcards(d) { setToStorage(KEYS.FLASH, d); }
export function getMindMapData() { return getFromStorage(KEYS.MAP) || null; }
export function setMindMapData(d) { setToStorage(KEYS.MAP, d); }
export function getTheme() { return getFromStorage(KEYS.THEME) || 'light'; }
export function setTheme(t) { setToStorage(KEYS.THEME, t); }
export function getQuizAnswers() { return getFromStorage(KEYS.QUIZ_ANS) || {}; }
export function setQuizAnswers(a) { setToStorage(KEYS.QUIZ_ANS, a); }
export function getFavorites() { return getFromStorage(KEYS.FAVS) || []; }
export function setFavorites(f) { setToStorage(KEYS.FAVS, f); }

export function clearAll() {
  Object.values(KEYS).forEach(function (key) {
    localStorage.removeItem(key);
  });
}

export function hasDocument() {
  return !!getFromStorage(KEYS.DOC_TEXT);
}

var HISTORY_KEY = 'sm_history';

export function getHistory() {
  try {
    var val = localStorage.getItem(HISTORY_KEY);
    return val ? JSON.parse(val) : [];
  } catch (e) {
    return [];
  }
}

export function saveToHistory(session) {
  try {
    var history = getHistory();
    history.unshift(session);
    if (history.length > 20) history = history.slice(0, 20);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (e) {
    console.warn('History save failed', e);
  }
}

export function clearHistory() {
  localStorage.removeItem(HISTORY_KEY);
}
export function deleteHistoryItem(id) {
  try {
    var history = getHistory();
    history = history.filter(function (item) {
      return item.id !== id;
    });
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (e) {
    console.warn('History delete failed', e);
  }
}