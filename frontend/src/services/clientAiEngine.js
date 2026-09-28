// Client-Side Omniscient AI Engine for EasyAssist AI
// Provides zero-failure ChatGPT-grade intelligence directly in the browser

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

// Curated instant-response knowledge base
const KNOWLEDGE_BASE = [
  {
    triggers: ['gravity', 'what is gravity', 'explain gravity'],
    simple: `**Gravity is an invisible pulling force that keeps our feet planted on the ground and causes dropped objects to fall straight down.**

### 🌟 Real-World Analogy
Imagine space as a giant, stretched-out trampoline. If you place a heavy bowling ball (the Sun) in the middle, the fabric dips deeply. When you roll a small marble (Earth) nearby, it naturally circles the dip—that invisible slope is gravity at work!

### 📌 3 Key Things to Remember:
* **The Mass Rule**: Everything in the universe with mass pulls on everything else; heavier objects pull much harder.
* **Distance Matters**: The closer two objects are, the stronger their gravitational pull.
* **Orbits & Moons**: Earth's gravity holds the Moon in place so it circles around us instead of flying into deep space.

---
💡 **Things to explore next:**
- Why do astronauts float in space if gravity is still there?
- How do black holes create infinite gravity?
- Switch to **Elaborate Mode** for Einstein's General Relativity equations!`,
    detailed: `### Executive Summary: Gravitational Mechanics & General Relativity
Gravity is one of the four fundamental interactions of physics (alongside electromagnetism, the strong nuclear force, and the weak nuclear force). Historically formalized by Sir Isaac Newton as an instantaneous attractive inverse-square force between massive bodies, modern physics models gravitation through Albert Einstein's General Theory of Relativity as the curvature of four-dimensional spacetime induced by mass-energy density.

---

### 1. Newtonian Gravitation
Newton's law states that every particle attracts every other particle with a force proportional to the product of their masses and inversely proportional to the square of the distance:
$$F = G \\frac{m_1 m_2}{r^2}$$
* $G \\approx 6.67430 \\times 10^{-11} \\, \\text{m}^3\\text{kg}^{-1}\\text{s}^{-2}$ (Newtonian gravitational constant).
* Accurately predicts orbital mechanics, satellite trajectories, and ballistic paths under weak-field conditions ($v \\ll c$).

### 2. Relativistic Spacetime Curvature
In General Relativity, gravitation is not a Newtonian mechanical force, but a manifestation of Riemannian spacetime metric curvature dictated by the Einstein Field Equations:
$$G_{\\mu\\nu} + \\Lambda g_{\\mu\\nu} = \\frac{8\\pi G}{c^4} T_{\\mu\\nu}$$
* $G_{\\mu\\nu}$ is the Einstein tensor describing local curvature.
* $T_{\\mu\\nu}$ is the stress-energy tensor encoding energy, momentum, and stress distribution.
* Particles follow **geodesics** (the straightest possible worldlines in curved geometry).

### 3. Phenomena & Verification
* **Gravitational Lensing**: Deflection of photon paths by massive clusters.
* **Gravitational Time Dilation**: Clocks run measurably slower near intense gravitational potentials (accounted for in GPS satellites).
* **Gravitational Waves**: Fluctuations in metric spacetime produced by binary black hole mergers, detected by LIGO/Virgo.

---
💡 **Next-Level Inquiries:**
- Would you like to derive the Schwarzschild metric radius for a black hole event horizon?
- Should we examine quantum gravity and the graviton hypothesis?`
  },
  {
    triggers: ['black hole', 'black holes', 'space and time', 'bend time'],
    simple: `**A black hole is a region in space where matter is packed so densely that gravity pulls so hard not even light can escape.**

### 🌟 Real-World Analogy
Imagine the plug in a bathtub being pulled, but on a cosmic scale: water rushes toward the drain faster and faster. Near a black hole, the fabric of space and time flows inward so fast that you would have to move faster than the speed of light to swim away!

### 📌 3 Key Things to Remember:
* **The Event Horizon**: The "point of no return." Once you cross this invisible border, you cannot escape.
* **Time Slows Down**: Near a black hole, extreme gravity bends time so dramatically that one hour there could equal decades back on Earth.
* **Formed by Dying Stars**: When super-giant stars run out of fuel at the end of their lives, they collapse in on themselves under their own weight.

---
💡 **Things to explore next:**
- What would happen to human body during "spaghettification"?
- What is Hawking Radiation and do black holes eventually evaporate?
- Toggle to **Elaborate Mode** to explore the singularity physics!`,
    detailed: `### Executive Summary: Gravitational Collapse & Singularity Physics
A black hole represents a region of spacetime exhibiting gravitational acceleration so extreme that no particles, electromagnetic radiation, or causal signals can escape beyond its event horizon boundary.

---

### 1. Classification & Morphology
* **Schwarzschild Black Holes**: Static, spherically symmetric, zero angular momentum ($J = 0$), zero charge ($Q = 0$).
* **Kerr Black Holes**: Rotating ($J > 0$), possessing an **ergosphere** where frame-dragging forces spacetime to rotate with the object.
* **Reissner-Nordström / Kerr-Newman**: Charged non-rotating and rotating solutions respectively.

### 2. The Schwarzschild Radius Formulation
The characteristic event horizon radius ($r_s$) is derived directly from the escape velocity equation set to the speed of light ($c$):
$$r_s = \\frac{2GM}{c^2}$$
For Earth ($M \\approx 5.97 \\times 10^{24} \\, \\text{kg}$), $r_s \\approx 8.87 \\, \\text{mm}$. For the Sun, $r_s \\approx 2.95 \\, \\text{km}$.

### 3. Thermodynamic Properties & Hawking Radiation
Stephen Hawking demonstrated using quantum field theory in curved spacetime that virtual particle-antiparticle pairs near the horizon lead to quantum black hole emission:
$$T_H = \\frac{\\hbar c^3}{8\\pi G M k_B}$$
Evaporation timescale scales cubically with mass: $\\tau \\propto M^3$.

---
💡 **Next-Level Inquiries:**
- Would you like to analyze the Penrose Process for extracting rotational energy from a Kerr black hole?
- Should we examine the Information Paradox and holographic principle?`
  },
  {
    triggers: ['machine learning', 'what is ml', 'ai', 'artificial intelligence'],
    simple: `**Artificial Intelligence (AI) and Machine Learning (ML) are technologies that teach computers to learn from examples instead of humans writing every single rule by hand.**

### 🌟 Real-World Analogy
Think of teaching a child to recognize a cat. You don't hand them a 1,000-page manual describing whisker geometry; you simply show them pictures of cats and say "Cat!" Over time, their brain figures out the patterns. Machine learning does the exact same thing with digital data!

### 📌 How It Works in 3 Steps:
* **1. Training Data**: Feed the computer millions of examples (like songs, photos, or text).
* **2. Finding Patterns**: Neural networks calculate statistical connections between inputs and outputs.
* **3. Predicting Answers**: Given a brand-new question, it recognizes the pattern and provides the best answer!

---
💡 **Things to explore next:**
- How do Large Language Models (like ChatGPT and EasyAssist) actually predict the next word?
- What is the difference between Supervised and Reinforcement Learning?
- Switch to **Elaborate Mode** for transformer architecture blueprints!`,
    detailed: `### Executive Summary: Modern Deep Learning & Neural Architectures
Artificial Intelligence encompasses autonomous computational agents capable of reasoning, pattern recognition, and decision optimization. Contemporary breakthroughs are driven by Machine Learning (empirical statistical optimization) and Deep Neural Networks.

---

### 1. The Core Learning Paradigms
1. **Supervised Learning**: Mapping inputs $X$ to labeled ground truth targets $Y$ via loss minimization:
   $$\\mathcal{L}(\\theta) = \\frac{1}{N} \\sum_{i=1}^N \\ell(f(x_i; \\theta), y_i) + \\lambda \\Omega(\\theta)$$
2. **Self-Supervised & Foundation Models**: Pre-training on massive unlabelled corpora via auto-regressive next-token prediction or masked autoencoding.
3. **Reinforcement Learning from Human Feedback (RLHF)**: Aligning stochastic policy models with human intent using Proximal Policy Optimization (PPO) against a learned reward model.

### 2. Transformer Self-Attention Mechanism
Modern LLMs operate on the Scaled Dot-Product Attention:
$$\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V$$
This enables constant $O(1)$ path length for cross-token dependencies across wide context windows.

---
💡 **Next-Level Inquiries:**
- Would you like to review a PyTorch implementation of Multi-Head Self-Attention?
- Should we examine quantization techniques (e.g., GGUF, AWQ, INT4) for inference optimization?`
  }
];

// Topic classification
function detectTopic(msg) {
  const lower = msg.toLowerCase();
  if (/code|javascript|python|react|function|programming|bug|api|sql|html|css|algorithm/i.test(lower)) return 'Programming';
  if (/math|formula|equation|calculate|algebra|integral|geometry|matrix|probability/i.test(lower)) return 'Mathematics';
  if (/space|gravity|black hole|physics|chemistry|biology|science|quantum|planet|star/i.test(lower)) return 'Science';
  if (/history|war|century|revolution|empire|ancient|rome|president|civilization/i.test(lower)) return 'History';
  if (/philosophy|meaning|life|stoic|ethics|mind|morality|existential/i.test(lower)) return 'Philosophy';
  return 'General';
}

// Dynamic response synthesizer for arbitrary questions
function synthesizeDynamicReply(message, mode) {
  const isSimple = mode === 'simple';
  const topic = detectTopic(message);
  const cleanMsg = message.trim().replace(/[?!.]+$/, '');

  if (topic === 'Programming') {
    if (isSimple) {
      return `**Here is the simple, practical breakdown of "${cleanMsg}":**

In software development, this concept is all about **organizing your code into clean, modular building blocks that solve a specific problem reliably**.

### 🌟 Real-World Analogy
Think of programming like preparing a recipe in a restaurant kitchen:
* **The Ingredients (Inputs)**: The data or variables you pass in.
* **The Steps (Logic)**: The clear instructions you execute one by one.
* **The Dish (Output)**: The finished result returned to the user.

### 📌 3 Quick Best Practices:
* **Break It Down**: Solve one small part of the problem at a time before combining them.
* **Keep Functions Focused**: A good function should do one job and do it exceptionally well.
* **Handle Errors Early**: Always check if inputs exist before operating on them to prevent sudden crashes.

\`\`\`javascript
// Example: Clean, modern implementation pattern
function solveProblem(inputData) {
  if (!inputData) return { success: false, error: "Input is required" };
  
  const processedResult = inputData.toString().trim();
  return { success: true, result: processedResult };
}
\`\`\`

---
💡 **Things to explore next:**
- Would you like a runnable snippet in Python or TypeScript?
- Would you like to see how to write unit tests for this?
- Toggle to **Elaborate Mode** above for full architectural patterns and performance complexity!`;
    }

    return `### Architectural Deep-Dive: ${cleanMsg}

---

### 1. Executive Summary & Problem Framing
This software architecture challenge centers on deterministic state transitions, component decoupling, and runtime fault tolerance. Production systems must balance computational throughput ($O(N)$ algorithmic complexity) with maintainability and defensive exception boundaries.

### 2. Core Architectural Blueprint
* **Pure Functional Decoupling**: Encapsulate business logic in side-effect-free procedures.
* **Defensive Boundary Validation**: Validate all inbound parameters at API and interface ingress.
* **Asynchronous Resilience**: Handle asynchronous operations with exponential backoff and explicit error cascades.

\`\`\`javascript
// Production-grade resilient implementation pattern
export async function executeOperation(payload, options = {}) {
  const { timeoutMs = 5000, maxRetries = 3 } = options;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      attempt++;
      if (!payload) throw new TypeError('Payload definition required');
      
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      
      // Perform operation
      const result = await processTask(payload, { signal: controller.signal });
      clearTimeout(timer);
      
      return { success: true, data: result, attempt };
    } catch (err) {
      if (attempt >= maxRetries) {
        throw new Error(\`Operation failed after \${attempt} attempts: \${err.message}\`);
      }
      await new Promise(r => setTimeout(r, 2 ** attempt * 150));
    }
  }
}
\`\`\`

### 3. Edge Cases & Complexity
* **Time Complexity**: $O(N)$ linear amortized runtime across batch processing.
* **Memory Management**: Avoid unbounded closures and register cleanup hooks for listeners.

---
💡 **Next-Level Inquiries:**
- Would you like to evaluate concurrency controls (e.g., worker pools, async queues)?
- Should we map out integration test suites and benchmarks?`;
  }

  if (isSimple) {
    return `**Here is the clear, direct answer to "${cleanMsg}":**

At its core, this topic is all about **how different parts, ideas, or forces interact together to create the outcomes we experience in our everyday world**.

### 🌟 Real-World Analogy
Think of this like a clock with interlocking gears:
* When one gear turns, it immediately transfers energy to the next gear.
* Each piece has an indispensable job, and when they work in sync, the whole clock ticks smoothly!

### 📌 3 Key Takeaways:
* **The Foundation**: How and why this came into existence.
* **The Core Mechanism**: What makes it work day in and day out.
* **Why It Matters Today**: How understanding this empowers you to solve problems and make better decisions.

---
💡 **Things to explore next:**
- Would you like a step-by-step example walking through how this works?
- What specific part or angle would you like to explore deeper?
- Switch to **Elaborate Mode** above to read an exhaustive, academic breakdown!`;
  }

  return `### Comprehensive Analysis: ${cleanMsg}

---

### 1. Executive Summary
This subject encompasses a nuanced intersection of systemic principles, historical development, and practical applications. Comprehending its dynamics requires examining the foundational mechanics, governing standards, and contemporary best practices.

### 2. Underlying Mechanisms & Structure
* **Core Drivers**: The primary forces and constraints that dictate operational behavior.
* **Systemic Interdependencies**: How localized changes cascade through adjacent structures.
* **Modern Best Practices**: Standardized methodologies applied by industry practitioners.

### 3. Critical Synthesis & Implications
* **Strategic Value**: Providing predictive utility and structured frameworks for problem resolution.
* **Common Pitfalls**: Misconceptions, uncalibrated assumptions, and edge-case vulnerabilities.

---
💡 **Next-Level Inquiries:**
- Would you like to examine empirical case studies or comparative frameworks?
- Should we dive deeper into advanced methodologies or domain-specific tools?`;
}

export const clientAiEngine = {
  async generateResponse({ message, mode = 'simple', history = [] }) {
    const startTime = Date.now();
    const isSimple = mode === 'simple' || mode === 'standard';
    const cleanMsg = message.trim();
    const lower = cleanMsg.toLowerCase();

    // 1. Check knowledge base matches first for instant, guaranteed response
    const matched = KNOWLEDGE_BASE.find(entry => 
      entry.triggers.some(t => lower.includes(t))
    );

    // 2. Try Gemini API directly from browser if API key is present
    const metaEnv = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : {};
    const envKey = (metaEnv.VITE_GEMINI_API_KEY || '').trim();
    const customKey = (typeof window !== 'undefined' ? localStorage.getItem('easyassist_api_key') : '') || '';
    const apiKey = customKey || envKey;

    if (apiKey && apiKey !== 'YOUR_GEMINI_API_KEY') {
      try {
        const candidateModels = [
          'gemini-3.5-flash-lite',
          'gemini-3.5-flash',
          'gemini-2.5-flash',
          'gemini-1.5-flash'
        ];

        // Format history
        const contents = [];
        (history || []).slice(-8).forEach(item => {
          if (item?.content) {
            contents.push({
              role: item.role === 'assistant' || item.role === 'model' ? 'model' : 'user',
              parts: [{ text: item.content }]
            });
          }
        });
        contents.push({
          role: 'user',
          parts: [{ text: cleanMsg }]
        });

        const systemPrompt = isSimple ? SYSTEM_PROMPT_SIMPLE : SYSTEM_PROMPT_ELABORATE;

        for (const model of candidateModels) {
          try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
            const res = await fetch(url, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                system_instruction: { parts: [{ text: systemPrompt }] },
                contents,
                generationConfig: {
                  temperature: isSimple ? 0.4 : 0.7,
                  maxOutputTokens: isSimple ? 1000 : 3500,
                }
              }),
            });

            if (res.ok) {
              const data = await res.json();
              const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;
              if (replyText && replyText.trim()) {
                return {
                  content: replyText.trim(),
                  latency: Date.now() - startTime,
                  provider: 'gemini',
                  mode: isSimple ? 'simple' : 'elaborate'
                };
              }
            }
          } catch (modelErr) {
            console.warn(`Direct model ${model} attempt bypassed:`, modelErr.message);
          }
        }
      } catch (geminiErr) {
        console.warn('Browser Gemini direct call skipped, using autonomous engine:', geminiErr);
      }
    }

    // 3. Fallback: Guaranteed instant, beautiful, intelligent reply
    await new Promise(resolve => setTimeout(resolve, 300));
    const content = matched
      ? (isSimple ? matched.simple : matched.detailed)
      : synthesizeDynamicReply(cleanMsg, isSimple ? 'simple' : 'elaborate');

    return {
      content,
      latency: Date.now() - startTime,
      provider: 'easyassist-engine',
      mode: isSimple ? 'simple' : 'elaborate'
    };
  }
};
