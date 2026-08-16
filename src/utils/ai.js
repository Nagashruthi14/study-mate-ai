// ============================================================
// StudyMate AI - OpenRouter AI Service
// Model: NVIDIA Nemotron 3 Ultra (Free)
// ============================================================

const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

const API_URL = "https://openrouter.ai/api/v1/chat/completions";

const MODEL = "nvidia/nemotron-3-ultra-550b-a55b:free";

export function isGeminiReady() {
  return Boolean(API_KEY);
}

function limitText(text, maxLength = 100000) {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength);
}

function cleanResponse(text) {
  if (!text) return "";
  return text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

async function callAI(messages, options = {}) {
  if (!API_KEY) {
    throw new Error("OpenRouter API key is not configured. Check your .env file.");
  }

  try {
    const body = {
      model: MODEL,
      messages: messages,
      temperature: options.temperature !== undefined ? options.temperature : 0.2,
      max_tokens: options.maxTokens || 4000,
    };

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + API_KEY,
        "HTTP-Referer": window.location.origin,
        "X-Title": "StudyMate AI",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenRouter API Error:", data);
      const message = (data && data.error && data.error.message) || (data && data.error && data.error.code) || "OpenRouter request failed (" + response.status + ")";
      throw new Error(message);
    }

    const content = data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;

    if (!content) {
      console.error("Unexpected OpenRouter response:", data);
      throw new Error("OpenRouter returned an empty response.");
    }

    return cleanResponse(content);
  } catch (error) {
    console.error("AI request failed:", error);
    if (error instanceof Error) throw error;
    throw new Error("Failed to communicate with OpenRouter.");
  }
}

// ============================================================
// ASK QUESTION
// ============================================================

export async function askQuestion(docText, question, chatHist = []) {
  if (!docText || !docText.trim()) throw new Error("Please upload or add study material first.");
  if (!question || !question.trim()) throw new Error("Please enter a question.");

  const material = limitText(docText);

  const recentHistory = chatHist.slice(-4).map(function (item) {
    return "Student Question: " + item.question + "\nStudyMate Answer: " + item.answer;
  }).join("\n\n");

  const systemPrompt = "You are StudyMate AI, an intelligent exam preparation assistant.\n\nYour job is to help a student understand their uploaded study material.\n\nSTRICT RULES:\n1. Answer using ONLY the provided study material.\n2. Do NOT invent information.\n3. Do NOT use outside knowledge when the answer is not present.\n4. If the answer cannot be found in the material, say: \"This information is not available in the uploaded study material.\"\n5. Explain concepts in simple language.\n6. Make the answer easy to read during exam preparation.\n7. Use headings and bullet points when useful.\n8. Highlight important terms using **bold markdown**.\n9. Do not unnecessarily repeat the entire material.\n10. Give a direct answer first, then explanation if necessary.";

  const userPrompt = "STUDY MATERIAL:\n\n" + material + "\n\n" + (recentHistory ? "RECENT CONVERSATION:\n\n" + recentHistory + "\n\n" : "") + "STUDENT QUESTION:\n\n" + question + "\n\nAnswer the student's question based only on the study material.";

  return callAI([
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ], { temperature: 0.2, maxTokens: 4000 });
}

// ============================================================
// GENERATE QUIZ
// ============================================================

export async function generateQuiz(docText, chatHist = []) {
  if (!docText || !docText.trim()) throw new Error("No study material available.");

  const material = limitText(docText);

  const prompt = "You are StudyMate AI's exam quiz generator.\n\nGenerate EXACTLY 20 multiple-choice questions from the study material below.\n\nRequirements:\n- Exactly 20 questions.\n- Each question has exactly 4 options.\n- Exactly one correct answer.\n- Mix easy, medium and difficult questions.\n- Cover different parts of the material.\n- Avoid duplicate questions.\n- Do not invent information.\n\nReturn ONLY valid JSON in this exact format:\n\n{\n  \"questions\": [\n    {\n      \"question\": \"Question text\",\n      \"options\": [\"Option A\", \"Option B\", \"Option C\", \"Option D\"],\n      \"correct\": 0\n    }\n  ]\n}\n\nThe \"correct\" value is the 0-3 index of the correct option.\n\nSTUDY MATERIAL:\n\n" + material;

  const text = await callAI([
    { role: "user", content: prompt },
  ], { temperature: 0.3, maxTokens: 8000 });

  try {
    var jsonStr = text;
    var m = jsonStr.match(/\{[\s\S]*\}/);
    if (m) jsonStr = m[0];
    const parsed = JSON.parse(jsonStr);
    if (parsed.questions) return parsed.questions;
    if (Array.isArray(parsed)) return parsed;
    throw new Error("No questions found.");
  } catch (error) {
    console.error("Quiz JSON:", text);
    throw new Error("Could not process the generated quiz. Please try again.");
  }
}

// ============================================================
// GENERATE FLASHCARDS
// ============================================================

export async function generateFlashcards(docText) {
  if (!docText || !docText.trim()) throw new Error("No study material available.");

  const material = limitText(docText);

  const prompt = "You are StudyMate AI.\n\nGenerate at least 15 flashcards from the study material below.\n\nFocus on important concepts, definitions, key facts, formulas, and exam-relevant information.\n\nEach answer should be concise and easy to remember.\n\nDo NOT invent information.\n\nReturn ONLY valid JSON in this exact format:\n\n{\n  \"flashcards\": [\n    {\n      \"question\": \"What is ...?\",\n      \"answer\": \"...\"\n    }\n  ]\n}\n\nSTUDY MATERIAL:\n\n" + material;

  const text = await callAI([
    { role: "user", content: prompt },
  ], { temperature: 0.2, maxTokens: 6000 });

  try {
    var jsonStr = text;
    var m = jsonStr.match(/\{[\s\S]*\}/);
    if (m) jsonStr = m[0];
    const parsed = JSON.parse(jsonStr);
    if (parsed.flashcards) return parsed.flashcards;
    if (Array.isArray(parsed)) return parsed;
    throw new Error("No flashcards found.");
  } catch (error) {
    console.error("Flashcard JSON:", text);
    throw new Error("Could not process flashcards. Please try again.");
  }
}

// ============================================================
// GENERATE MIND MAP
// ============================================================

export async function generateMindMap(docText) {
  if (!docText || !docText.trim()) throw new Error("No study material available.");

  const material = limitText(docText);

  const prompt = "You are StudyMate AI.\n\nCreate a hierarchical mind map from the study material below.\n\nThe mind map should contain main topic, major topics, subtopics, important concepts, definitions, and relationships.\n\nKeep topic names short (2-6 words). Do not create unnecessarily deep trees.\n\nUse information ONLY from the study material.\n\nReturn ONLY valid JSON in this exact format:\n\n{\n  \"topic\": \"Main Topic\",\n  \"children\": [\n    {\n      \"topic\": \"Major Topic\",\n      \"children\": [\n        {\n          \"topic\": \"Important Concept\",\n          \"children\": []\n        }\n      ]\n    }\n  ]\n}\n\nAt least 3 major topics when the material allows. Avoid duplicate topics.\n\nSTUDY MATERIAL:\n\n" + material;

  const text = await callAI([
    { role: "user", content: prompt },
  ], { temperature: 0.2, maxTokens: 6000 });

  try {
    var jsonStr = text;
    var m = jsonStr.match(/\{[\s\S]*\}/);
    if (m) jsonStr = m[0];
    const parsed = JSON.parse(jsonStr);
    if (parsed.topic) return parsed;
    throw new Error("No topic found.");
  } catch (error) {
    console.error("Mind map JSON:", text);
    throw new Error("Could not process the mind map. Please try again.");
  }
}

// ============================================================
// GENERATE SUMMARY
// ============================================================

export async function generateSummary(docText) {
  if (!docText || !docText.trim()) throw new Error("No study material available.");

  const material = limitText(docText);

  const prompt = "You are StudyMate AI.\n\nSummarize the study material below in exactly 5-7 concise bullet points.\n\nHighlight key concepts and important terms using **bold markdown**.\n\nReturn ONLY the text summary, no JSON.\n\nSTUDY MATERIAL:\n\n" + material;

  const text = await callAI([
    { role: "user", content: prompt },
  ], { temperature: 0.2, maxTokens: 1000 });

  return text; // Returns plain text with markdown
}

// ============================================================
// EXPLAIN QUIZ ANSWER
// ============================================================

export async function explainQuizAnswer(docText, question, correctAnswer, userAnswer) {
  if (!docText || !docText.trim()) throw new Error("No study material available.");

  const material = limitText(docText);

  const prompt = "You are StudyMate AI.\n\nA student answered a quiz question incorrectly.\n\nQuestion: " + question + "\nCorrect Answer: " + correctAnswer + "\nStudent's Wrong Answer: " + userAnswer + "\n\nBased on the study material, briefly explain WHY the correct answer is right and WHY the student's answer is wrong. Keep it under 4 sentences. Use **bold** for key terms.\n\nSTUDY MATERIAL:\n\n" + material;

  const text = await callAI([
    { role: "user", content: prompt },
  ], { temperature: 0.2, maxTokens: 500 });

  return text;
}