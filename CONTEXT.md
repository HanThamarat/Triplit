# Triplit System Architecture & Context Guide

Welcome to the **Triplit** codebase context, detailing the system flow, mathematical models, UI styling guides, and developer workflows. Triplit is a modern, collaborative group travel portal designed to manage rich schedules, leverage conversational AI travel assistants, and optimally split bills using transactional network simplification.

---

## ⚡ Tech Stack & Design Tokens

Triplit is built on a premium, production-grade frontend architecture leveraging:
- **Core Framework**: [Next.js App Router (v16.2)](https://nextjs.org/) + [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (CSS-first configuration and fluid layout variables)
- **Typography System**: Google Fonts `Outfit` (for futuristic, modern displays/headings) and `Plus Jakarta Sans` (highly readable body prose)
- **Icons**: `react-icons/fi` (featherweight outline variants)
- **Data Persistence**: React state coordinated with `localStorage` for responsive offline support

### 🎨 Refined Solar-Carbon Theme Color Palettes

Theme configurations are synchronized using document class-list mappings. Transitions are eased across a 300ms curve to ensure fluidity.

| Token / Layer | Light Mode | Dark Mode |
| :--- | :--- | :--- |
| **Backdrop Page** | Alabaster Clean (`#f8f9fa`) | Carbon Black (`#0c0d12`) |
| **Card Surface** | White Paper (`#ffffff`) | Carbon Surface (`#14161f`) |
| **Border Liners** | Slate Gray Tint (`#e2e8f0`) | Carbon Outlines (`#232737`) |
| **Primary Accent** | Neon Teal (`#00f2fe`) | Cyan Glow (`#06b6d4`) |
| **Secondary Accent** | Cyber Coral (`#ff5722`) | Cyber Coral Dark (`#e64a19`) |

---

## 📐 Mathematical Settlement Engine (Greedy Debt Minimizer)

The most complex core module is the **Debt Simplification Solver** inside `ExpenseView.tsx`. In typical split-bill applications, if 5 friends split multiple items, a complex web of redundant peer-to-peer debts forms. Triplit simplifies this into a minimal transaction set.

### 1. Calculation of Net Balances
For each friend $i$, we compute their net travel ledger balance:

$$\text{Net Balance}_i = \text{Total Paid By}_i - \sum_{e \in E} \text{Share}_{e, i}$$

Where:
- $E$ is the set of all expenses.
- $\text{Share}_{e, i}$ is the split allocation of expense $e$ attributed to friend $i$. If split equally among $S_e$ friends:
  $$\text{Share}_{e, i} = \frac{\text{Amount}_e}{\|S_e\|}$$

### 2. Debt Simplification Algorithm (Pseudocode)
Once balances are computed:
1. Divide friends into two sets:
   - **Debtors** ($D$): Friends with $\text{Net Balance} < -0.05$
   - **Creditors** ($C$): Friends with $\text{Net Balance} > 0.05$
2. Sort both sets in descending order of absolute balance magnitudes.
3. While both $D$ and $C$ are non-empty, match the largest debtor $d \in D$ with the largest creditor $c \in C$:
   - Calculate settlement amount: $A = \min(|B_d|, B_c)$
   - Record transaction: **"Friend $d$ pays Friend $c$ amount $A$"**
   - Update outstanding balances:
     - $B_d \leftarrow B_d + A$
     - $B_c \leftarrow B_c - A$
   - Remove fully settled members from active matching lists.
4. This yields an optimal bipartite matching path, capping maximum transactional overhead at $N-1$ settlement paths for $N$ travel buddies.

---

## 📂 Codebase Directory Layout

```bash
triplit/
├── .agents/                    # Specialized AI styling and guidelines
├── public/                     # Static elements and icons
├── CONTEXT.md                  # System design reference (This File)
└── src/
    └── app/
        ├── globals.css         # Tailwind v4 theme variables, glassmorphic styles, custom scrollbars
        ├── layout.tsx          # Google fonts loader, hydration script to prevent flash
        ├── page.tsx            # Main router shell coordinating Landing and Dashboard views
        └── components/
            ├── ThemeToggle.tsx   # Smooth animated dark/light SVG transition controller
            ├── LandingView.tsx   # Product landing page with hero, interactive sandbox peek
            ├── DashboardView.tsx # Dashboard shell coordinating trips lists and imported items
            ├── AIChatView.tsx    # Travel Assistant simulator compiling itinerary logs
            └── ExpenseView.tsx   # Bill ledger, SVG category analysis, settlement engine
```

---

## 🌟 Visual & Aesthetic Guidelines

As defined by the `frontend-design` skill in `.agents/skills/frontend-design/SKILL.md`:
1. **Dynamic Spatial Asymmetry**: Overlapping gradient mesh grids (`radial-mesh`) combined with keyframe animations (`animate-float`) provide visual depth.
2. **Glassmorphism Panels**: UI cards utilize light-translucent backing coupled with backdrop blurring filters (`glass-panel`) to feel premium and professional.
3. **Responsive Visualizations**: Category breakdowns render custom vector graphs (`svg` paths) reacting to real-time adjustments.

---

## 🛠️ Developer Commands & Workflows

### Setup Dependencies
Install packages using `pnpm`:
```bash
pnpm install
```

### Local Dev Run
Start the Next.js fast-refresh server:
```bash
pnpm run dev
```
Open [http://localhost:3000](http://localhost:3000) to inspect.

### Build Compilation Check
Confirm TypeScript typings, styling rules, and production bundle formats build correctly:
```bash
pnpm run build
```
