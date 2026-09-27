# Contributing to EasyAssist AI

Thank you for your interest in contributing to **EasyAssist AI**! We welcome contributions from developers, designers, and educators of all skill levels.

---

## 📌 Getting Started

1. **Fork the repository** on GitHub.
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/<your-username>/easyassist-ai.git
   cd easyassist-ai
   ```
3. **Install dependencies**:
   ```bash
   npm run install:all
   ```
4. **Configure your environment**:
   Copy `.env.example` to `backend/.env` and add your `GEMINI_API_KEY`.

---

## 🌿 Development Workflow

1. Create a dedicated branch for your work:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Start the development environment:
   ```bash
   npm run dev
   ```
3. Test your changes:
   - Ensure the backend boots cleanly with no syntax errors.
   - Run `npm run build` in the `frontend` folder to guarantee the Vite bundle compiles with zero errors.

---

## 📝 Commit Guidelines

We use conventional commit messages:
- `feat:` A new user-facing feature
- `fix:` A bug fix
- `docs:` Documentation updates
- `style:` Code style or CSS changes (no functional alterations)
- `refactor:` Code improvements that don't affect behavior
- `chore:` Maintenance, Docker, or build configuration tasks

---

## 🚀 Submitting a Pull Request

1. Push your branch to GitHub:
   ```bash
   git push origin feature/your-feature-name
   ```
2. Open a Pull Request against the `main` branch.
3. Describe what your changes do and reference any related issues.

Thank you for helping make AI simple and accessible for everyone!
