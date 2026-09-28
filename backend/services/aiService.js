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

const SYSTEM_PROMPT_DETAILED = SYSTEM_PROMPT_ELABORATE;

// Intelligent knowledge base for zero-config offline/demo fallback
const KNOWLEDGE_BASE = [
  {
    triggers: ['machine learning', 'what is ml', 'explain ml'],
    topic: 'Technology',
    simple: `**Machine learning is a way of teaching computers to learn from examples instead of giving them every single rule manually.**

### 🌟 Real-World Example
Think of how a child learns what a dog looks like. You don't describe every tooth and hair; you just point to dogs and say "Dog!" Over time, their brain figures out the pattern. Machine learning does the exact same thing with data!

### 📌 How It Works in 3 Steps:
* **Step 1: Collect Examples** — Feed the computer thousands of photos (e.g., cats and dogs).
* **Step 2: Spot Patterns** — The computer notices features (pointy ears, whisker shapes).
* **Step 3: Make Predictions** — When given a brand new photo, it accurately says: "That's a cat!"

*No complicated code rules needed — just learning from experience!*`,
    detailed: `### Executive Summary
Machine Learning (ML) is a subset of Artificial Intelligence (AI) that enables computational systems to automatically learn and improve from empirical data without being explicitly hardcoded for every scenario.

---

### Core Learning Paradigms
1. **Supervised Learning**: Models are trained on labeled datasets (inputs mapped to known ground-truth targets).
   * *Algorithms*: Linear Regression, Random Forests, Support Vector Machines (SVM), Neural Networks.
2. **Unsupervised Learning**: Discovering hidden patterns or latent representations in unlabeled data.
   * *Algorithms*: K-Means Clustering, PCA, Autoencoders.
3. **Reinforcement Learning**: Agents learn through environment interaction by maximizing cumulative reward signals.
   * *Algorithms*: Q-Learning, PPO, Deep Q-Networks.

---

### End-to-End Pipeline
\`\`\`text
Raw Data ➔ Preprocessing & Cleaning ➔ Feature Engineering ➔ Model Training ➔ Validation & Tuning ➔ Production Inference
\`\`\`

### Common Challenges & Best Practices
* **Overfitting vs Underfitting**: Balance bias and variance using regularization (L1/L2), cross-validation, and dropout.
* **Data Drift**: Continuously monitor distribution shifts between training data and real-time inference.`,
  },
  {
    triggers: ['artificial intelligence', 'explain ai', 'what is ai', 'school student'],
    topic: 'Education',
    simple: `**Artificial Intelligence (AI) is computer software that can think, learn, and solve problems similar to how human brains do.**

### 🌟 Real-World Example
When you use a phone with face unlock, voice assistants like Siri, or video recommendations on YouTube, AI is working behind the scenes to recognize your face, understand your voice, and predict what you enjoy watching!

### 📌 Key Things AI Can Do:
* **See and Recognize**: Identify objects, animals, and faces in pictures.
* **Understand Language**: Read questions and reply in natural human sentences.
* **Make Decisions**: Help doctors detect illnesses faster or help self-driving cars stop at red lights.

*In short: AI gives computers the ability to learn and assist humans with everyday tasks!*`,
    detailed: `### Executive Summary
Artificial Intelligence (AI) refers to computer science systems engineered to execute cognitive tasks historically requiring human intelligence—including reasoning, problem solving, visual perception, and linguistic communication.

---

### Hierarchical Landscape
* **Artificial Narrow Intelligence (ANI)**: Specialized in a specific domain (e.g., Chess engines, Large Language Models like EasyAssist AI, autonomous vision). This is where all existing AI operates today.
* **Artificial General Intelligence (AGI)**: Theoretical intelligence possessing adaptive learning across any intellectual task at human parity.
* **Artificial Superintelligence (ASI)**: Speculative future systems exceeding collective human cognitive capability.

---

### Core Branches
1. **Natural Language Processing (NLP)**: Tokenization, Transformers, Sentiment Analysis.
2. **Computer Vision**: Convolutional Neural Networks (CNNs), Object Detection, Segmentation.
3. **Robotics & Control Systems**: Kinematics, sensor fusion, spatial navigation.`,
  },
  {
    triggers: ['quantum computing', 'quantum computer', 'quantum'],
    topic: 'Science',
    simple: `**Quantum computing is a new kind of computer that uses the mysterious rules of physics to solve ultra-complex problems millions of times faster than standard laptops.**

### 🌟 Real-World Example
Imagine trying to escape a giant maze:
* A **normal computer** tests one pathway at a time until it finds the exit.
* A **quantum computer** tests **all pathways at the exact same time**!

### 📌 Why It Is Special:
* **Normal computers use bits**: They are either \`0\` or \`1\` (like a light switch: OFF or ON).
* **Quantum computers use qubits**: They can be \`0\`, \`1\`, or **both at the same time** (like a spinning coin).
* **Superpowers**: They help scientists discover life-saving medicines and create unbreakable security codes.`,
    detailed: `### Executive Summary
Quantum Computing leverages quantum mechanical phenomena—specifically **superposition**, **entanglement**, and **interference**—to process exponentially large state spaces simultaneously.

---

### Foundational Principles
1. **Qubits & Superposition**: Unlike classical binary bits ($0$ or $1$), a qubit is represented as a state vector $|\psi\rangle = \alpha|0\rangle + \beta|1\rangle$, where $|\alpha|^2 + |\beta|^2 = 1$.
2. **Quantum Entanglement**: Qubits can become correlated such that the quantum state of one instantaneously dictates the state of another, regardless of physical distance.
3. **Quantum Interference**: Quantum algorithms (like Shor's or Grover's) choreograph probabilities so destructive interference cancels incorrect paths while constructive interference amplifies correct solutions.

---

### Key Applications & Milestones
* **Cryptography**: Threatens classical RSA through Shor's polynomial-time factoring; spurs Post-Quantum Cryptography (PQC).
* **Molecular Simulation**: Exact simulation of complex protein folding and battery chemistry catalysts.`,
  },
  {
    triggers: ['java error', 'nullpointerexception', 'null pointer', 'java code not working'],
    topic: 'Programming',
    simple: `**A \`NullPointerException\` in Java happens when your program tries to use an object variable that is currently empty (pointing to \`null\`).**

### 🌟 Real-World Example
Imagine having a TV remote, but someone forgot to put batteries inside. If you press the "Power" button, nothing happens because there is nothing inside to respond. In Java, pressing a button on an empty object crashes your program!

### 🛠️ How to Fix It:
Always check if your variable has a real value before using it:

\`\`\`java
// ❌ WRONG: Can crash if name is null
String name = null;
System.out.println(name.length()); // Throws NullPointerException!

// ✅ CORRECT: Safe check first
if (name != null) {
    System.out.println(name.length());
} else {
    System.out.println("Name has not been set yet!");
}
\`\`\`

### 💡 Golden Rule:
Before calling \`.method()\` on any variable, make sure it is not \`null\`!`,
    detailed: `### Root Cause Analysis: \`java.lang.NullPointerException\` (NPE)
An NPE occurs at runtime when the Java Virtual Machine (JVM) attempts to dereference a reference variable that points to \`null\` in heap memory.

---

### Frequent Trigger Scenarios
1. Invoking an instance method on an uninitialized reference.
2. Accessing or modifying a field of a \`null\` reference.
3. Calculating array length when the array reference is \`null\`.
4. Auto-unboxing a wrapper object (\`Integer\`, \`Boolean\`) that evaluates to \`null\`.

---

### Modern Prevention Strategies

#### 1. Modern \`Optional<T>\` Pattern (Java 8+)
\`\`\`java
public Optional<String> findUserName(String userId) {
    return Optional.ofNullable(userRepository.getName(userId));
}

// Usage:
findUserName("u102")
    .map(String::toUpperCase)
    .ifPresentOrElse(
        System.out::println,
        () -> System.out.println("User not found")
    );
\`\`\`

#### 2. \`Objects.requireNonNull\` Guardrails
\`\`\`java
public void processOrder(Order order) {
    this.order = Objects.requireNonNull(order, "Order reference cannot be null");
}
\`\`\`

#### 3. Yoda Conditions for Safe String Comparison
\`\`\`java
// Safe from NPE even if status is null:
if ("ACTIVE".equals(status)) {
    // Proceed safely
}
\`\`\``,
  },
  {
    triggers: ['math problem', 'solve math', 'mathematical', 'quadratic', 'calculus'],
    topic: 'Mathematics',
    simple: `**Here is the step-by-step simple guide to solving math problems:**

### 🎯 3-Step Strategy
1. **Identify the Given Information**: Write down what numbers you have.
2. **Find What is Missing**: Write down the exact variable you are solving for ($x$, area, velocity).
3. **Apply the Right Formula**: Plug in the numbers and simplify one step at a time!

### 🌟 Quick Example: $2x + 6 = 14$
* **Step 1**: Subtract $6$ from both sides:
  $$2x = 14 - 6 \implies 2x = 8$$
* **Step 2**: Divide both sides by $2$:
  $$x = \frac{8}{2} \implies \mathbf{x = 4}$$

*Share your exact math question and I will break it down into simple, easy steps!*`,
    detailed: `### Systematic Mathematical Problem-Solving Framework
To solve formal mathematical and algebraic equations reliably:

1. **Domain & Constraints Analysis**:
   Determine valid values (e.g., ensure denominators $\neq 0$, radicands $\ge 0$ for real numbers, logarithmic arguments $> 0$).

2. **Standard Form Representation**:
   For quadratic relations: $ax^2 + bx + c = 0$.
   Discriminant $\Delta = b^2 - 4ac$:
   * $\Delta > 0$: Two distinct real roots.
   * $\Delta = 0$: Single repeated real root.
   * $\Delta < 0$: Complex conjugate roots.

3. **Quadratic Formula Solution**:
   $$x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$$

4. **Verification Step**:
   Substitute obtained solutions back into the original unsimplified equation to detect any extraneous solutions introduced by exponentiation or cross-multiplication.`,
  },
  {
    triggers: ['study plan', 'exam preparation', 'prepare for exam', 'how to study'],
    topic: 'Education',
    simple: `**Here is a simple, stress-free 5-day study plan to ace your exam:**

### 📅 The 5-Day Blueprint
* **Day 1 (Understand)**: Skim the syllabus. List topics from hardest to easiest.
* **Day 2 (Core Concepts)**: Focus on the hardest 3 topics using simple notes and YouTube summaries.
* **Day 3 (Practice)**: Solve previous year question papers or textbook problems.
* **Day 4 (Revision)**: Teach the concepts to an imaginary friend or explain them out loud (Feynman Technique).
* **Day 5 (Final Polish)**: Light review of formulas and sleep for at least 8 hours.

### ⏱️ The 25/5 Pomodoro Rule:
Study with high focus for **25 minutes**, then take a **5-minute break**. Repeat 4 times!`,
    detailed: `### Cognitive Science-Backed Academic Preparation Framework

#### 1. Spaced Repetition & Active Recall
Passive rereading generates an "illusion of competence." Instead, construct flashcards or prompt-based recall sheets adhering to the Ebbinghaus Forgetting Curve intervals (Day 1, Day 3, Day 7).

#### 2. Weighted Topic Prioritization (Pareto 80/20 Rule)
* Categorize syllabus topics into high-yield vs low-yield historical weight.
* Allocate 70% of study blocks to topics with the highest scoring distribution.

#### 3. Daily Execution Schedule
| Block | Duration | Focus |
|---|---|---|
| Deep Focus 1 | 90 mins | High-complexity problem solving / proofs |
| Rest / Buffer | 30 mins | Physical hydration and cognitive recovery |
| Deep Focus 2 | 90 mins | Timed mock test simulations |
| Synthesis | 45 mins | Error logging: analyze *why* mistakes occurred |`,
  },
  {
    triggers: ['interview', 'prepare for interview', 'job interview'],
    topic: 'Career',
    simple: `**Here is how to prepare for an interview with confidence:**

### 🌟 The STAR Method (For Any Question)
When they ask: *"Tell me about a time you solved a problem..."*, use **S-T-A-R**:
* **S (Situation)**: Set the scene in 1 sentence (*"In our college group project..."*)
* **T (Task)**: What was your responsibility? (*"I needed to build the database..."*)
* **A (Action)**: What did you actually do? (*"I researched MongoDB and created the models..."*)
* **R (Result)**: What was the happy ending? (*"Our project submitted on time and scored an A!"*)

### 📌 Top 3 Tips Before You Enter:
1. Know the company and what their product does.
2. Have 2 smart questions ready to ask the interviewer at the end.
3. Be honest: If you don't know something, say: *"I haven't worked with that yet, but I am excited to learn!"*`,
    detailed: `### Comprehensive Career Interview Preparation Matrix

#### 1. Behavioral Competency (STAR Framework)
Construct a story repository covering the 5 core corporate behavioral themes:
* Leadership & Ownership
* Conflict Resolution & Stakeholder Alignment
* Handling Failure & Resilience
* Ambiguity & Rapid Adaptation
* Technical Architecture & Tradeoff Justification

#### 2. Technical / Domain Readiness
* **System Design**: Functional vs Non-Functional requirements, scaling bottlenecks, database choices (SQL vs NoSQL), caching (Redis), latency trade-offs.
* **Code Execution**: Clarify boundary conditions, articulate time/space complexity ($O(N)$), test edge cases explicitly before finishing.

#### 3. High-Impact Closing Questions for the Panel
* *"What differentiates an engineer who is merely good in this role from someone who is truly exceptional over their first 90 days?"*
* *"What is the most pressing technical challenge your team aims to solve this quarter?"*`,
  },
  {
    triggers: ['email', 'professional email', 'write email'],
    topic: 'Writing',
    simple: `**Here is a clean, professional email template ready to copy and send:**

\`\`\`text
Subject: Meeting Request: [Topic / Project Name]

Dear [Name],

I hope you are having a great week.

I am writing to briefly discuss [Main Purpose/Question]. 

Could we arrange a short 15-minute call sometime this week? I am available on [Day] between [Time] or [Alternative Day/Time].

Thank you for your time and assistance.

Best regards,
[Your Name]
[Your Role / Phone Number]
\`\`\`

### 💡 Quick Tips:
* Keep the subject line clear and short.
* State your goal in the very first paragraph.
* Always double-check names and dates before hitting send!`,
    detailed: `### Professional Business Communication Protocols

#### Structural Architecture of Modern Correspondence
1. **Action-Oriented Subject Line**: Format as \`[Action Required / Status] Project Name - Context\` (e.g., \`[Action Required] EasyAssist Architecture Review - March 24\`).
2. **Salutation**: Context-sensitive (\`Dear Dr. [Lastname]\` for academic, \`Hi [Firstname]\` for modern engineering teams).
4. **Scannable Body**: Bullet points for deliverables or questions.
5. **Clear Call-to-Action (CTA)**: Specific dates, times, and ownership.`,
  },
];

// Fallback dynamic generator for arbitrary questions when offline
function generateDynamicFallback(message, mode) {
  const cleanMsg = message.trim();
  const lower = cleanMsg.toLowerCase();
  const isSimple = mode === 'simple';
  const topic = detectTopic(cleanMsg);

  // Coding & Technology
  if (topic === 'Programming' || topic === 'Technology') {
    if (isSimple) {
      return `**Here is the simple, practical guide to "${cleanMsg}":**

In computing and software, this concept revolves around **giving clear instructions to machines using well-defined rules and modular parts**.

### 🌟 Real-World Analogy
Think of this like building with LEGO bricks: each function or component is an individual brick designed to snap cleanly into place. When you connect them systematically, you build a stable structure without creating a tangled mess.

### 📌 Key Takeaways:
* **Input ➔ Process ➔ Output**: Break the problem down into what goes in, what happens to it, and what comes out.
* **Keep It Modular**: Write small, self-contained pieces of logic that do one thing reliably.
* **Inspect & Test**: Test with small inputs first to catch edge cases before scaling up.

---
💡 **Things to explore next:**
- Would you like a runnable code example in Python, JavaScript, or Java?
- Would you like to see how to debug the most common errors for this?
- Switch to **Elaborate Mode** above to see the full architectural breakdown!`;
    }

    return `### Architectural Deep-Dive: ${cleanMsg.replace(/\?$/, '')}

---

### 1. Executive Summary & Core Mechanics
This engineering problem centers on predictable state transitions, modular decoupling, and robust algorithmic complexity. Designing for this domain requires balancing runtime performance ($O(N)$ space/time tradeoffs) with maintainability and fault tolerance.

### 2. Foundational Architecture & Best Practices
* **State Isolation**: Maintain pure functions and immutable data flows where possible to eliminate unintended side-effects.
* **Defensive Boundary Validation**: Always validate and sanitize external parameters at API and function boundaries.
* **Graceful Degradation**: Structure error handling with explicit catch boundaries, retries, and fallback behaviors.

### 3. Implementation Blueprint
\`\`\`javascript
// Production-grade resilient implementation pattern
async function executeOperation(payload, options = {}) {
  const { timeout = 5000, maxRetries = 3 } = options;
  let attempts = 0;

  while (attempts < maxRetries) {
    try {
      attempts++;
      // Validate inputs
      if (!payload) throw new TypeError('Payload is required');
      
      // Execute core deterministic workflow
      const result = await processLogic(payload);
      return { success: true, data: result, attempts };
    } catch (err) {
      if (attempts >= maxRetries) {
        throw new Error(\`Operation failed after \${attempts} attempts: \${err.message}\`);
      }
      // Exponential backoff
      await new Promise(res => setTimeout(res, 2 ** attempts * 100));
    }
  }
}
\`\`\`

### 4. Edge Cases & Considerations
* **Concurrency & Race Conditions**: Ensure synchronization primitives or atomic operations if shared state is mutated across async boundaries.
* **Memory Leaks**: Dereference stale closures, unregister event listeners, and avoid unbounded caching structures.

---
💡 **Next-Level Inquiries:**
- Would you like to evaluate performance profiling and stress-testing strategies?
- Should we map out database schema optimizations or distributed caching?`;
  }

  // Mathematics & Science
  if (topic === 'Mathematics' || topic === 'Science') {
    if (isSimple) {
      return `**Here is the simple, intuitive explanation of "${cleanMsg}":**

At its heart, this scientific concept is about **understanding the hidden patterns and universal rules that govern how things interact in our world**.

### 🌟 Real-World Analogy
Think of the universe like a giant game of dominoes: every single piece moves only because of the force from the piece before it. Science and math are simply our tools for measuring the distance between each domino and predicting which one will fall next!

### 📌 Core Principles in 3 Steps:
* **Observe the Phenomenon**: Look closely at what is happening and measure what changes.
* **Apply the Natural Law**: Use formulas or physical rules that describe how energy, mass, or numbers behave.
* **Predict the Result**: Use the relationship to calculate what will happen under new conditions.

---
💡 **Things to explore next:**
- Would you like a step-by-step numerical example?
- Would you like to discover the historical discovery behind this?
- Switch to **Elaborate Mode** for mathematical derivations and formulas!`;
    }

    return `### Scientific & Mathematical Analysis: ${cleanMsg.replace(/\?$/, '')}

---

### 1. Theoretical Foundations
This inquiry touches upon fundamental physical and mathematical principles governing equilibrium, rate of change, and deterministic conservation laws.

### 2. Mathematical Formalism
Consider the underlying governing relation expressed in generalized terms:
$$\\frac{d\\Phi}{dt} = -\\nabla \\cdot \\mathbf{J} + \\sigma$$

Where:
* $\\Phi$ represents the conserved state variable or field density.
* $\\mathbf{J}$ denotes the flux vector across the control surface.
* $\\sigma$ models source/sink generation within the volume.

### 3. Step-by-Step Analytical Breakdown
1. **Identify Coordinate Frame & Boundary Conditions**: Restrict the domain to valid physical parameters ($t \\ge 0$, real solutions).
2. **Linearize or Decouple Perturbations**: Disregard higher-order nonlinear terms for small-amplitude regimes.
3. **Solve for Eigenstates / Roots**: Apply spectral decomposition or boundary value problem solvers.
4. **Conservation Verification**: Verify that the solution respects mass, energy, or probability conservation.

---
💡 **Next-Level Inquiries:**
- Would you like to explore computational simulations (e.g., Runge-Kutta integration in Python)?
- Should we examine quantum or relativistic corrections to this model?`;
  }

  // General World Knowledge & Humanities
  if (isSimple) {
    return `**Here is the clear, direct answer to "${cleanMsg}":**

This topic can be understood very simply: it is all about **how people, ideas, and natural forces interact to shape the world around us**.

### 🌟 Real-World Example
Imagine a bustling town square: every building, road, and tradition exists because of decisions made in the past. When you learn about this topic, you are simply seeing why the buildings were built that way and how they affect the people living there today!

### 📌 3 Key Things to Remember:
* **The Background (Why it started)**: What sparked this event, idea, or reality.
* **The Turning Point (What changed)**: The pivotal moment that reshaped the situation.
* **The Modern Impact (Why it matters now)**: How this influences our daily lives and thoughts today.

---
💡 **Things to explore next:**
- What specific era, person, or detail would you like to explore further?
- Would you like a quick timeline of the most important milestones?
- Toggle to **Elaborate Mode** to read an in-depth historical breakdown!`;
  }

  return `### Comprehensive Breakdown: ${cleanMsg.replace(/\?$/, '')}

---

### 1. Executive Summary & Context
This subject reflects a multifaceted historical, cultural, and conceptual evolution. Comprehending its full significance requires tracing the confluence of economic pressures, intellectual movements, and systemic shifts that precipitated its modern manifestation.

### 2. Historical Arc & Core Dynamics
* **Genesis & Antecedents**: The foundational drivers and societal conditions that enabled this development.
* **Catalytic Milestones**: Key inflection points, seminal treaties, or breakthroughs that solidified the standard.
* **Systemic Ripple Effects**: Structural transformations across institutional hierarchies and cultural paradigms.

### 3. Critical Perspectives & Synthesis
* **Primary School of Thought**: Emphasizes structural determinism and material resource distribution.
* **Alternative Interpretations**: Focuses on individual agency, philosophical discourse, and technological disruption.
* **Contemporary Relevance**: How these lessons inform current policy, global relations, and future trajectories.

---
💡 **Next-Level Inquiries:**
- Would you like to explore primary source documents and historical debate controversies?
- Should we compare how different global regions approached this phenomenon?`;
}

// Helper to determine topic
export function detectTopic(message) {
  const lower = message.toLowerCase();
  if (lower.includes('code') || lower.includes('java') || lower.includes('python') || lower.includes('bug') || lower.includes('error') || lower.includes('function') || lower.includes('react') || lower.includes('api') || lower.includes('sql') || lower.includes('git') || lower.includes('css') || lower.includes('html')) {
    return 'Programming';
  }
  if (lower.includes('math') || lower.includes('equation') || lower.includes('solve') || lower.includes('calculate') || lower.includes('algebra') || lower.includes('integral') || lower.includes('geometry') || lower.includes('probability')) {
    return 'Mathematics';
  }
  if (lower.includes('study') || lower.includes('exam') || lower.includes('school') || lower.includes('college') || lower.includes('learn') || lower.includes('assignment')) {
    return 'Education';
  }
  if (lower.includes('job') || lower.includes('interview') || lower.includes('career') || lower.includes('resume') || lower.includes('salary')) {
    return 'Career';
  }
  if (lower.includes('quantum') || lower.includes('physics') || lower.includes('chemistry') || lower.includes('biology') || lower.includes('science') || lower.includes('space') || lower.includes('planet') || lower.includes('solar') || lower.includes('universe') || lower.includes('relativity') || lower.includes('gravity')) {
    return 'Science';
  }
  if (lower.includes('history') || lower.includes('war') || lower.includes('empire') || lower.includes('ancient') || lower.includes('revolution') || lower.includes('century') || lower.includes('president') || lower.includes('king') || lower.includes('rome') || lower.includes('greece')) {
    return 'History';
  }
  if (lower.includes('email') || lower.includes('write') || lower.includes('essay') || lower.includes('grammar') || lower.includes('poem') || lower.includes('story')) {
    return 'Writing';
  }
  if (lower.includes('ai') || lower.includes('machine learning') || lower.includes('computer') || lower.includes('software') || lower.includes('robot')) {
    return 'Technology';
  }
  return 'General';
}

// Format multi-turn conversation into proper Gemini API contents array
function formatGeminiContents(history = [], currentMessage = '') {
  const contents = [];

  const validHistory = (history || [])
    .filter((item) => item && item.content && typeof item.content === 'string' && item.content.trim().length > 0)
    .slice(-12);

  for (const item of validHistory) {
    const role = (item.role === 'assistant' || item.role === 'model') ? 'model' : 'user';
    const text = item.content.trim();

    if (contents.length === 0) {
      if (role === 'user') {
        contents.push({ role: 'user', parts: [{ text }] });
      }
    } else {
      const last = contents[contents.length - 1];
      if (last.role === role) {
        last.parts[0].text += `\n\n${text}`;
      } else {
        contents.push({ role, parts: [{ text }] });
      }
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

  // Ensure first element is user
  while (contents.length > 0 && contents[0].role !== 'user') {
    contents.shift();
  }

  return contents;
}

export const aiService = {
  async generateResponse({ message, mode = "simple", history = [] }) {
    const rawGeminiKey = process.env.GEMINI_API_KEY?.trim();
    const rawAiKey = process.env.AI_API_KEY?.trim();
    const apiKey = (rawGeminiKey && rawGeminiKey !== "YOUR_GEMINI_API_KEY")
      ? rawGeminiKey
      : (rawAiKey && rawAiKey !== "your_api_key_here" ? rawAiKey : null);

    const isSimple = mode === "simple";
    const systemPrompt = isSimple
      ? SYSTEM_PROMPT_SIMPLE
      : SYSTEM_PROMPT_ELABORATE;

    const startTime = Date.now();

    // Use Gemini when API key is available
    if (apiKey) {
      try {
        const ai = new GoogleGenAI({
          apiKey: apiKey,
        });

        const contents = formatGeminiContents(history, message);
        const primaryModel = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";
        const candidateModels = [
          primaryModel,
          "gemini-3.5-flash-lite",
          "gemini-3.5-flash",
          "gemini-2.5-flash",
          "gemini-2.0-flash",
          "gemini-1.5-flash",
          "gemini-3.1-flash-lite",
          "gemini-3.8-flash",
        ].filter((val, idx, arr) => arr.indexOf(val) === idx);

        let response = null;
        let activeModel = primaryModel;
        let lastErr = null;

        for (const model of candidateModels) {
          try {
            response = await ai.models.generateContent({
              model,
              contents,
              config: {
                systemInstruction: systemPrompt,
                temperature: isSimple ? 0.4 : 0.7,
                maxOutputTokens: isSimple ? 1000 : 3500,
              },
            });
            if (response && response.text?.trim()) {
              activeModel = model;
              break;
            }
          } catch (tryErr) {
            lastErr = tryErr;
            console.warn(`Model ${model} unavailable (${tryErr.message?.slice(0, 80)}), trying next candidate...`);
          }
        }

        const text = response?.text?.trim();

        if (text) {
          const latency = Date.now() - startTime;
          return {
            content: text,
            latency,
            provider: "gemini",
          };
        }

        if (lastErr) {
          throw lastErr;
        }
      } catch (err) {
        console.error("Gemini API error:", err.message);
        console.warn("Falling back to EasyAssist built-in knowledge engine.");
      }
    } else {
      console.warn("GEMINI_API_KEY is missing or unconfigured.");
    }

    // ---------------------------------------
    // EASYASSIST KNOWLEDGE ENGINE FALLBACK
    // ---------------------------------------
    await new Promise((resolve) => setTimeout(resolve, 350));

    const lower = message.toLowerCase();
    const matched = KNOWLEDGE_BASE.find((entry) =>
      entry.triggers.some((trigger) => lower.includes(trigger))
    );

    let content = "";
    if (matched) {
      content = isSimple ? matched.simple : matched.detailed;
    } else {
      content = generateDynamicFallback(
        message,
        isSimple ? "simple" : "elaborate"
      );
    }

    const latency = Date.now() - startTime;

    return {
      content,
      latency,
      provider: "easyassist-engine",
    };
  },
};

