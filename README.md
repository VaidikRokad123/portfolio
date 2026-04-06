# Vaidik Rokad — Developer Portfolio

A premium, interactive 3D portfolio website built with **React**, **Three.js (React Three Fiber)**, **GSAP**, and **Lenis** smooth scroll.

## ✨ Live Features

- **3D Dog Model** — Animated GLTF model with custom matcap shader blending, mouse-tracking parallax, idle floating, and smooth scroll-driven scale-down
- **Glassmorphism Design** — Dark theme with neon indigo/purple accents, semi-transparent cards with `backdrop-filter: blur`
- **Scroll Animations** — GSAP ScrollTrigger for staggered reveals, timeline animations, and section transitions
- **Active Nav Highlighting** — Navbar highlights the current section via IntersectionObserver as you scroll
- **Atmospheric Background** — Full-page background image (`background-l.png`) visible through transparent Three.js canvas with gradient overlay
- **Responsive** — Mobile hamburger menu, adaptive grids (3→2→1 column), and fluid typography

## 📂 Project Structure

```
src/
├── App.jsx               # Root layout — fixed Canvas + Navbar + sections
├── App.css               # Complete design system + all section styles
├── main.jsx              # Lenis smooth scroll + React entry
├── data/
│   └── portfolio.js      # All text content, projects, skills, achievements
├── components/
│   ├── Dog.jsx           # 3D model — shaders, mouse tracking, scroll animation
│   ├── ui/
│   │   └── Navbar.jsx    # Fixed navbar with active section tracking
│   └── sections/
│       ├── Hero.jsx      # Name, typing effect, CTAs
│       ├── About.jsx     # Education + Competitive Programming stats
│       ├── Projects.jsx  # 3-column project cards with modal detail view
│       ├── Skills.jsx    # 3-col grid: Languages, Tech Stack, Core CS
│       ├── Achievements.jsx  # Alternating timeline cards
│       └── Contact.jsx   # Contact form + social links + footer
```

## 🛠 Tech Stack

| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| Vite 7 | Build tool |
| Three.js + R3F + Drei | 3D rendering |
| GSAP + ScrollTrigger | Animations |
| Lenis | Smooth scrolling |

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## 📝 Customization

All portfolio content is in `src/data/portfolio.js`:
- Personal info, education, competitive programming stats
- Projects with descriptions, tags, and highlights
- Skills (languages, technologies, core CS)
- Achievements with icons and descriptions

## 🔗 Links

- **GitHub**: [VaidikRokad123](https://github.com/VaidikRokad123)
- **LinkedIn**: [vaidik-rokad](https://www.linkedin.com/in/vaidik-rokad-6bbb56303/)
- **LeetCode**: [harry0018](https://leetcode.com/u/harry0018/)
- **CodeChef**: [harry0018](https://www.codechef.com/users/harry0018)
- **Codeforces**: [harry0018](https://codeforces.com/profile/harry0018)
