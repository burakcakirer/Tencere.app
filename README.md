# 🍲 Tencere.app — Dinner Menu Wheel

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-animations-0055FF?logo=framer&logoColor=white)

**Tencere.app** ("Akşam Yemeği Çarkı") answers the daily question *"What's for dinner?"*. It spins a
slot-machine style wheel and builds a complete Turkish home-cooking menu, then lets you tweak it course by course.
The UI is in Turkish and optimized for mobile.

## Features

- **Full-menu spin:** one tap picks a soup, main dish, side dish and dessert/complement from a built-in
  database of **198 Turkish dishes** (29 soups, 94 mains, 31 sides, 44 complements), each with a calorie value.
- **Per-course re-roll:** spin a single slot without touching the others.
- **Slot locking:** lock the courses you like; only unlocked slots change on the next spin.
- **3- or 4-course mode:** drop the side dish for a lighter menu.
- **Vegetarian filter:** limit the pool to vegetarian dishes.
- **Calorie cap:** a slider sets a maximum total calorie target for the menu.
- **No repetitions:** recently picked dishes are skipped, so consecutive spins stay varied.
- **Recipe archive:** browse and search the whole database by category, with per-category statistics.
- **Custom dishes:** add your own dishes (name, category, calories, vegetarian) and delete them later.
- **Share:** copy the menu with its total calories to the clipboard in a ready-to-send format.
- **Comfort settings:** light/dark theme (follows the system by default), sound effects (Web Audio)
  and haptic feedback (Vibration API), each with an on/off toggle.
- **Persistent state:** settings, locks, the current menu and custom dishes are saved in `localStorage`.
  There is no backend, and no account is needed.

## Tech stack

| Layer | Technology |
|---|---|
| UI | React 19 + TypeScript |
| Build tool | Vite 8 |
| Styling | Tailwind CSS 4 (`@tailwindcss/vite`) |
| Animation | Framer Motion |
| Icons | lucide-react |
| Linting | Oxlint |

## Getting started

Requirements: **Node.js 20+** and npm.

```bash
git clone https://github.com/burakcakirer/Tencere.app.git
cd Tencere.app
npm install
npm run dev        # start the dev server at http://localhost:5173
```

| Script | Description |
|---|---|
| `npm run dev` | Start the Vite dev server with hot reload |
| `npm run build` | Type-check (`tsc -b`) and build a production bundle into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run Oxlint |

## Project structure

```text
src/
├── App.tsx          # UI, spin logic, locking, filters, archive and settings
├── data.ts          # MenuItem type and the built-in dish database
├── useSound.ts      # Web Audio tick and success sounds
├── useCountUp.ts    # Animated calorie counter hook
├── main.tsx         # React entry point
├── index.css        # Tailwind setup and theme tokens
└── App.css
```

### Adding dishes to the built-in database

Append an entry to `MENU_DATABASE` in `src/data.ts`:

```ts
{ id: 'a95', name: 'Fırın Makarna', calories: 420, isVegetarian: true, category: 'ana_yemek' }
```

`category` is one of `corba`, `ana_yemek`, `yardimci`, `tamamlayici`. Keep `id` values unique. The `custom_` prefix
is reserved for dishes added from inside the app.

> Calorie values are approximate per-serving estimates and are not intended as nutritional advice.
