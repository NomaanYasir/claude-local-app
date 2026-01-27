# 🌌 Antigravity - Physics UI Demo

A playful Google Antigravity replica built with React + Vite. Watch UI elements fall, bounce, and float!

![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?logo=vite)
![React](https://img.shields.io/badge/React-19.x-61DAFB?logo=react)

## 🚀 Quick Start

```bash
# Navigate to the project
cd antigravity-app

# Install dependencies
npm install

# Start development server
npm run dev
```

Open **http://localhost:5173** in your browser.

## ✨ Features

### Physics Effects
| Mode | Behavior | Shortcut |
|------|----------|----------|
| Gravity | Elements fall and bounce | `G` |
| Antigravity | Elements float upward and drift | `A` |
| Shake | Screen jitters for 1 second | Button |
| Reset | Smooth return to original layout | `R` |

### Controls
- **Toggle Gravity** (ON/OFF)
- **Toggle Antigravity** (ON/OFF)
- **Gravity Strength** slider (0-100)
- **Bounce** slider (0-100)
- **Reset** button

### Keyboard Shortcuts
- `G` - Toggle gravity
- `A` - Toggle antigravity
- `R` - Reset
- `Esc` - Close control panel

### Accessibility
- ✅ ARIA labels on all interactive elements
- ✅ Visible focus styles for keyboard navigation
- ✅ Mobile/tablet/desktop responsive
- ✅ Screen reader announcements for toasts

### Offline Support
- ✅ Works fully offline (no network dependency)
- ✅ Shows "Offline mode" banner when disconnected

## 📋 Testing Checklist

Use the in-app Testing Checklist (📋 button, bottom-left) to verify:

- [ ] Click every button
- [ ] Enter normal + weird inputs
- [ ] Toggle gravity/antigravity rapidly
- [ ] Resize screen (mobile/tablet/desktop)
- [ ] Turn offline mode on (DevTools → Network → Offline)
- [ ] Keyboard navigation (Tab, G/A/R)
- [ ] Test slider adjustments
- [ ] Trigger shake effect
- [ ] Reset and verify layout returns

## 🔒 Security Audit

✅ **No API keys or secrets** - App is fully client-side
✅ **No external network requests** - Works offline
✅ **Safe input handling** - Max 120 chars, no injection risks
✅ **No localStorage sensitive data** - Only UI preferences stored
✅ **No eval() or dangerouslySetInnerHTML** - Safe React patterns

## 📁 Project Structure

```
src/
├── components/
│   ├── TopBar.jsx          # Logo header
│   ├── SearchBox.jsx       # Search input with validation
│   ├── ButtonsRow.jsx      # Google Search / Lucky buttons
│   ├── ResultsCards.jsx    # Sample result cards
│   ├── ControlPanel.jsx    # Physics controls
│   ├── Toast.jsx           # Notifications
│   ├── OfflineBanner.jsx   # Offline indicator
│   └── TestingChecklist.jsx # In-app testing helper
├── hooks/
│   ├── useLocalStorage.js  # Persist state to localStorage
│   ├── useWindowSize.js    # Track viewport dimensions
│   └── useKeyboardShortcuts.js # Keyboard handler
├── utils/
│   ├── physicsHelpers.js   # Physics calculations
│   ├── clamp.js            # Utility function
│   └── randomSeed.js       # Seeded random generator
├── styles/
│   └── global.css          # Global styles
├── App.jsx                 # Main app component
├── App.css                 # App styles
└── main.jsx                # Entry point
```

## 🛠️ Scripts

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 📜 License

MIT
