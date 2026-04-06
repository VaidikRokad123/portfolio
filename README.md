# 🐾 React Dog — 3D Interactive Portfolio

> A stunning, scroll-driven 3D portfolio built with React, Three.js, React Three Fiber, and GSAP. Inspired by the [Dogstudio](https://dogstudio.co) creative agency website.

---

## 🎯 What This Project Does

This is a **3D interactive portfolio** featuring:

- A **fully animated 3D dog model** that moves and rotates as you scroll
- **Matcap material transitions** triggered on hover — the dog's surface changes color/texture in real-time
- **Scroll-driven animations** via GSAP ScrollTrigger synchronizing 3D scene with page scroll
- **Background image reveals** on project hover using CSS `:has()` selectors
- Custom **GLSL shader injection** into Three.js materials for smooth matcap blending

---

## 🧠 Tech Stack

| Technology | Role |
|---|---|
| **React 19** | UI framework |
| **Vite 7** | Build tool & dev server |
| **Three.js** | 3D rendering engine |
| **@react-three/fiber** | React renderer for Three.js |
| **@react-three/drei** | Three.js helpers (GLTF loader, textures, controls) |
| **GSAP + ScrollTrigger** | Scroll-driven 3D animations |
| **@gsap/react** | React-native GSAP integration |
| **MeshMatcapMaterial** | Lighting-free metallic/artistic surface rendering |
| **Custom GLSL Shaders** | Per-fragment matcap blending with smooth transition |

---

## 📁 Project Structure

```
react-dog-main/
├── public/
│   ├── models/
│   │   └── dog.drc.glb          # Draco-compressed 3D dog model
│   ├── matcap/
│   │   ├── mat-1.png            # 20 matcap textures for color variation
│   │   ├── mat-2.png
│   │   └── ... mat-20.png
│   ├── dog_normals.jpg          # Normal map for the dog mesh
│   ├── branches_diffuse.jpeg    # Branch/foliage diffuse texture
│   ├── branches_normals.jpeg    # Branch normal map
│   ├── background-l.png         # Default dark background
│   ├── tomorrowland.png         # Project artwork images
│   ├── navy-pier.png
│   ├── msi-chicago.png
│   ├── phone.png
│   ├── kikk.png
│   ├── kennedy.png
│   └── opera.png
├── src/
│   ├── components/
│   │   └── Dog.jsx              # Core 3D component (model + animations + shaders)
│   ├── App.jsx                  # Page layout, sections, nav
│   ├── App.css                  # All styles
│   └── main.jsx                 # React entry point
├── index.html
├── vite.config.js
└── package.json
```

---

## ⚙️ How It Works — Deep Dive

### 1. 🐕 3D Model Loading (`Dog.jsx`)
```jsx
const model = useGLTF("/models/dog.drc.glb")
```
- Loads a Draco-compressed `.glb` 3D model
- Plays the built-in animation `"Take 001"` on mount
- Traverses the mesh tree: `DOG` named nodes get the custom matcap material; everything else gets the branch material

### 2. 🎨 Custom Shader — Matcap Blending
The dog material uses `THREE.MeshMatcapMaterial` with a **custom GLSL shader injected via `onBeforeCompile`**:

```glsl
uniform sampler2D uMatcapTexture1;  // Target matcap
uniform sampler2D uMatcapTexture2;  // Current matcap
uniform float uProgress;            // 0.0 → 1.0 transition

// Smooth blend based on view position:
float progress = smoothstep(uProgress - 0.2, uProgress, (vViewPosition.x + vViewPosition.y) * 0.5 + 0.5);
vec4 matcapColor = mix(matcapColor2, matcapColor1, progress);
```

This creates a **wipe transition** effect across the surface when the matcap changes.

### 3. 🖱️ Hover Color Change
Each project title in Section 2 has a `mouseenter` listener:
```js
document.querySelector(`.title[img-title="tomorrowland"]`).addEventListener("mouseenter", () => {
    material.current.uMatcap1.value = mat19  // Set target matcap
    gsap.to(material.current.uProgress, {
        value: 0.0,                          // Animate progress to 0 (blend)
        duration: 0.3,
        onComplete: () => {
            material.current.uMatcap2.value = material.current.uMatcap1.value
            material.current.uProgress.value = 1.0  // Reset for next transition
        }
    })
})
```

### 4. 📜 Scroll Animation (`useGSAP + ScrollTrigger`)
```js
const tl = gsap.timeline({
    scrollTrigger: { trigger: "#section-1", endTrigger: "#section-3", scrub: true }
})
tl
  .to(dogModel.current.scene.position, { z: "-=0.75", y: "+=0.1" })
  .to(dogModel.current.scene.rotation, { x: `+=${Math.PI / 15}` })
  .to(dogModel.current.scene.rotation, { y: `-=${Math.PI}` }, "third")
  .to(dogModel.current.scene.position, { x: "-=0.5", z: "+=0.6" }, "third")
```
- The dog physically moves and rotates synchronized to scroll position

### 5. 🖼️ Background Image Reveal (Pure CSS `:has()`)
```css
main:has(#section-2 .title[img-title="tomorrowland"]:hover) .images #tomorrowland {
    opacity: 1;
}
```
- No JavaScript needed — CSS detects ancestor hover state via `:has()` and fades in the correct image

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repo
git clone <your-repo-url>
cd react-dog-main

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open `http://localhost:5173` in your browser.

### Build for Production
```bash
npm run build
npm run preview
```

---

## 🎨 Customizing for Your Own Portfolio

### Step 1 — Replace the 3D Model
1. Export your own `.glb` or use [Sketchfab](https://sketchfab.com) to download a free model
2. Compress it with [gltf-pipeline](https://github.com/CesiumGS/gltf-pipeline): `gltf-pipeline -i model.glb -o model.drc.glb --draco.compressMeshes`
3. Place it in `public/models/`
4. Update `useGLTF("/models/your-model.glb")` in `Dog.jsx`

### Step 2 — Swap Matcap Textures
- Download free matcaps from [github.com/nidorx/matcaps](https://github.com/nidorx/matcaps)
- Replace files in `public/matcap/mat-1.png` through `mat-20.png`
- Reference different matcap indexes in the hover events

### Step 3 — Update Project List
In `App.jsx`, add your projects to the `#section-2` titles block:
```jsx
<div img-title="your-project" className="title">
    <small>2024 - 2025</small>
    <h1>Your Project Name</h1>
</div>
```

In `App.css`, add:
```css
main:has(#section-2 .title[img-title="your-project"]:hover) .images #your-project {
    opacity: 1;
}
```

In `Dog.jsx`, add a `mouseenter` listener for your project.

Add your project image to `public/your-project.png` and its `<img>` tag in `.images`.

### Step 4 — Customize Colors & Fonts
Edit `App.css`:
- Background: `background-color: black;`
- Text: `color: whitesmoke;`
- Accent lines: `background-color: rgba(255, 0, 0, 0.396);`

---

## 🧪 Matcap Reference Table

| Variable | File | Appearance |
|---|---|---|
| `mat2` | mat-2.png | Default metallic silver |
| `mat8` | mat-8.png | Navy pier blue |
| `mat9` | mat-9.png | Museum teal |
| `mat10` | mat-10.png | Festival warm |
| `mat12` | mat-12.png | Phone cold gray |
| `mat13` | mat-13.png | Opera red |
| `mat19` | mat-19.png | Tomorrowland gold |

---

## ⚠️ Known Issues / Notes

- The `markers: true` in the ScrollTrigger config shows debug markers in dev — remove it for production
- CSS `:has()` requires a modern browser (Chrome 105+, Firefox 121+, Safari 15.4+)
- The model must have mesh names containing `"DOG"` to receive the custom matcap material

---

## 🌐 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel --prod
```

### Netlify
```bash
npm run build
# Drag the dist/ folder to netlify.com/drop
```

### GitHub Pages
```bash
# In vite.config.js, add: base: '/your-repo-name/'
npm run build
# Push dist/ to gh-pages branch
```

---

## 📚 Resources & Credits

- [Three.js Docs](https://threejs.org/docs/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- [Drei Helpers](https://github.com/pmndrs/drei)
- [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
- [Matcap Library](https://github.com/nidorx/matcaps)
- [Dogstudio](https://dogstudio.co) — Original design inspiration
- [Bruno Simon](https://threejs-journey.com/) — Three.js learning resource

---

## 📄 License

MIT — free to use and adapt for your own portfolio.
