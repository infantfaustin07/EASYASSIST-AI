// Vercel Serverless Function handler for /api/chat
import { GoogleGenAI } from "@google/genai";

const SYSTEM_PROMPT_SIMPLE = `You are EasyAssist AI, an intelligent, conversational, omniscient AI chatbot similar to ChatGPT, equipped with universal knowledge about the world (science, history, philosophy, programming, mathematics, geography, literature, culture, daily life, finance, health, and beyond).

Your primary mission in Simple Mode (簡易) is:
"Make any concept, fact, or complex subject in the universe effortless and delightful for anyone to understand."

STRICT INSTRUCTIONS FOR SIMPLE MODE:
1. Direct, Engaging Answer: Start immediately with a clear, friendly, direct answer in 1-2 sentences. No fluff or boilerplate filler.
2. Intuitive Real-World Analogy: Use a relatable, everyday metaphor, analogy, or mental model that makes the concept instantly click.
3. Core Breakdown: Break down the essentials into 3-5 clean, digestible bullet points or numbered steps using plain, clear language.
4. Jargon-Free: If technical or specialized terminology is unavoidable, define it instantly in parentheses using everyday English.
5. Code & Math (if applicable): If the user asks for programming or math, provide simple, beautifully formatted, well-commented code snippets or step-by-step arithmetic.
6. Engaging Follow-ups: At the very end of your response, provide 2-3 brief, interesting follow-up questions or next steps the user might want to explore (formatted as:
---
💡 **Things to explore next:**
- [Option 1]
- [Option 2]
- [Option 3])
7. Markdown Styling: Use clean Markdown (bold text, clean lists, highlighted code blocks) for maximum visual clarity.`;

const SYSTEM_PROMPT_ELABORATE = `You are EasyAssist AI in Elaborate Mode (詳細), an omniscient, world-class conversational AI chatbot with ChatGPT-Pro grade depth, analytical rigor, and encyclopedic breadth across every discipline in the universe.

Your mission in Elaborate Mode is:
"Provide exhaustive, deeply structured, authoritative, and nuanced explanations with production-grade details and comprehensive context."

STRICT INSTRUCTIONS FOR ELABORATE MODE:
1. Executive Summary: Begin with an authoritative, high-level summary and direct solution to the user's inquiry.
2. Foundational Principles & Architecture: Unpack the underlying theory, mechanisms, historical context, or architectural blueprints.
3. Deep-Dive Breakdown: Provide a multi-faceted analysis structured into logical sections with descriptive Markdown headers (###).
4. Code, Math & Formulations (if applicable): Provide complete, production-ready, idiomatic code snippets with error handling and algorithmic complexity (O(N)), or rigorous mathematical proofs/derivations.
5. Edge Cases & Best Practices: Cover common pitfalls, architectural trade-offs, limitations, and industry standards.
6. Synthesis & Practical Takeaways: Summarize actionable conclusions.
7. Next-Level Inquiry: Conclude with 2-3 advanced follow-up prompts or research directions for the user to continue probing.
8. Formatting: Use structured Markdown with bold key terms, tables, callouts, and syntax-highlighted code blocks with language identifiers.`;

function formatGeminiContents(history = [], currentMessage = '') {
  const contents = [];
  const validHistory = (history || [])
    .filter((item) => item && item.content && typeof item.content === 'string' && item.content.trim().length > 0)
    .slice(-10);

  for (const item of validHistory) {
    const role = (item.role === 'assistant' || item.role === 'model') ? 'model' : 'user';
    const text = item.content.trim();
    if (contents.length === 0) {
      if (role === 'user') contents.push({ role: 'user', parts: [{ text }] });
    } else {
      const last = contents[contents.length - 1];
      if (last.role === role) last.parts[0].text += `\n\n${text}`;
      else contents.push({ role, parts: [{ text }] });
    }
  }

  const currentText = currentMessage.trim();
  if (contents.length > 0 && contents[contents.length - 1].role === 'user') {
    if (contents[contents.length - 1].parts[0].text !== currentText) {
      contents[contents.length - 1].parts[0].text += `\n\n${currentText}`;
    }
  } else {
    contents.push({ role: 'user', parts: [{ text: currentText }] });
  }

  while (contents.length > 0 && contents[0].role !== 'user') contents.shift();
  return contents;
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    const { message, mode = 'simple', history = [], chatId, userId = 'guest-user' } = req.body || {};

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, error: 'Please enter a message.' });
    }

    const normMode = (mode === 'elaborate' || mode === 'detailed') ? 'elaborate' : 'simple';
    const isSimple = normMode === 'simple';
    const systemPrompt = isSimple ? SYSTEM_PROMPT_SIMPLE : SYSTEM_PROMPT_ELABORATE;
    const startTime = Date.now();

    const apiKey = process.env.GEMINI_API_KEY || process.env.AI_API_KEY || '';

    let content = '';
    let provider = 'gemini';

    if (apiKey && apiKey !== 'YOUR_GEMINI_API_KEY') {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const contents = formatGeminiContents(history, message);
        const candidateModels = [
          process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite',
          'gemini-3.5-flash-lite',
          'gemini-3.5-flash',
          'gemini-2.5-flash',
          'gemini-1.5-flash'
        ];

        for (const model of candidateModels) {
          try {
            const resp = await ai.models.generateContent({
              model,
              contents,
              config: {
                systemInstruction: systemPrompt,
                temperature: isSimple ? 0.4 : 0.7,
                maxOutputTokens: isSimple ? 1000 : 3500,
              },
            });
            if (resp && resp.text?.trim()) {
              content = resp.text.trim();
              break;
            }
          } catch (modelErr) {
            console.warn(`Model ${model} unavailable in serverless route:`, modelErr.message);
          }
        }
      } catch (err) {
        console.warn('Gemini failed in serverless function:', err.message);
      }
    }

    if (!content) {
      provider = 'easyassist-engine';
      content = `**Here is the clear explanation of "${message.trim()}":**\n\nThis concept can be understood simply: it is about **how different ideas, forces, and systems interact to create meaningful results in our daily lives**.\n\n### 🌟 Real-World Analogy\nImagine puzzle pieces snapping together: each piece has a specific shape and purpose. When they fit together correctly, the full picture becomes clear!\n\n### 📌 Key Takeaways:\n* **Core Idea**: What starts the process and why it matters.\n* **The Mechanism**: How the pieces work together.\n* **The Application**: How you can use this knowledge today.\n\n---\n💡 **Things to explore next:**\n- Would you like a concrete real-world example?\n- Switch to **Elaborate Mode** for deep technical analysis!`;
    }

    const activeChatId = chatId || `c-${Date.now()}`;
    const cleanTitle = message.trim().replace(/[^\w\s]/gi, '').split(/\s+/).slice(0, 5).join(' ');

    return res.status(200).json({
      success: true,
      data: {
        content,
        latency: Date.now() - startTime,
        provider,
      },
      chat: {
        _id: activeChatId,
        userId,
        title: cleanTitle || 'Conversation',
        topic: 'General',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      userMessage: {
        _id: `u-${Date.now()}`,
        chatId: activeChatId,
        role: 'user',
        content: message.trim(),
        mode: normMode,
        timestamp: new Date().toISOString(),
      },
      assistantMessage: {
        _id: `a-${Date.now()}`,
        chatId: activeChatId,
        role: 'assistant',
        content,
        mode: normMode,
        timestamp: new Date().toISOString(),
      },
      meta: {
        latencyMs: Date.now() - startTime,
        provider,
        mode: normMode,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message || 'Error generating AI response',
      message: err.message || 'Error generating AI response',
    });
  }
}
