# 🔍 Google Search Replica

A near-exact visual replica of the Google homepage and search results page with interactive features.

## 🚀 Quick Start

```bash
cd google-search-app
npm install
npm start
```

Open **http://localhost:3000**

---

## ✨ Features

### Homepage
- Google-style logo and layout
- Search bar with + icon, voice, Lens, AI Mode buttons
- "Google Search" + "I'm Feeling Lucky" buttons
- Header with About, Store, Gmail, Images, Labs, Apps, Avatar
- Suggestions dropdown from recent searches

### Results Page
- Tabs: All / Images / News / Videos / More
- Clickable results (open in new tab)
- Knowledge Card sidebar

### Special Query Cards

| Query Type | Example | Card Shown |
|------------|---------|------------|
| **Weather** | `weather chicago` | Live weather from Open-Meteo API |
| **Calculator** | `25*4` or `100/4` | Calculator card + popup button |
| **Time** | `time in london` | Time display |
| **Define** | `define algorithm` | Definition card |
| **Knowledge** | `tesla` or `python` | Knowledge sidebar |
| **Greeting** | `hello` or `how are you` | Friendly reply + suggestions |

### Images Tab
- Image grid using Picsum placeholders
- Responsive layout
- Click to open full image

### Calculator Popup
- Full calculator UI (0-9, +, -, ×, ÷, =, C, ⌫)
- Safe expression evaluation (no eval injection)
- Keyboard: Enter = calculate, Esc = close

### Offline Support
- Banner when offline
- Weather uses cached data with message

---

## 📋 Testing Checklist

Click the **🧪** button in the footer:

- [ ] Click every button
- [ ] Test normal input
- [ ] Test edge cases (empty, long, special chars)
- [ ] Resize screen (mobile/tablet/desktop)
- [ ] Test offline mode (DevTools → Network → Offline)
- [ ] Keyboard navigation (Tab, Enter, Esc, Arrows)
- [ ] Weather query: `weather new york`
- [ ] Calculator query: `12*7`
- [ ] Calculator popup opens/closes
- [ ] Suggestions dropdown
- [ ] I'm Feeling Lucky
- [ ] Click result link opens new tab
- [ ] Images tab grid loads
- [ ] Greeting query: `hello`
- [ ] Offline weather fallback

---

## 🛠️ Where to Edit

### Mock Results
`src/utils/mockResults.js`
- `DOMAINS`, `SNIPPETS` - result templates
- `KNOWLEDGE_DATA` - topic info
- `DEFINITIONS` - word definitions

### Special Query Detection
`src/utils/queryParser.js`
- `isWeatherQuery()`, `isMathQuery()`, `isGreetingQuery()`
- `getGreetingResponse()` - customize greeting replies

### Image Grid
`src/components/ImageGrid.jsx`
- Uses Picsum for placeholder images
- Adjust count, sizing

---

## 📁 Project Structure

```
src/
├── pages/
│   ├── HomePage.jsx        # Main search page
│   └── ResultsPage.jsx     # Search results
├── components/
│   ├── Header.jsx          # Top navigation
│   ├── Footer.jsx          # Bottom + testing panel
│   ├── SearchBar.jsx       # Search input
│   ├── Tabs.jsx            # Result tabs
│   ├── ResultsList.jsx     # Results container
│   ├── ResultItem.jsx      # Single result (clickable)
│   ├── WeatherCard.jsx     # Weather display
│   ├── CalculatorCard.jsx  # Math result
│   ├── CalculatorModal.jsx # Full calculator popup
│   ├── GreetingCard.jsx    # Greeting response
│   ├── ImageGrid.jsx       # Images tab grid
│   ├── QuickAnswerCard.jsx # Time/definitions
│   ├── KnowledgeCard.jsx   # Sidebar info
│   ├── Toast.jsx           # Notifications
│   └── OfflineBanner.jsx   # Offline indicator
├── utils/
│   ├── queryParser.js      # Query detection
│   ├── mockResults.js      # Fake results
│   ├── safeText.js         # XSS protection
│   └── weatherApi.js       # Open-Meteo
├── hooks/
│   ├── useLocalStorage.js
│   └── useDebounce.js
└── styles/
    └── global.css
```

---

## 🔒 Security

- ✅ No API keys (Open-Meteo is free/keyless)
- ✅ All user input sanitized
- ✅ Safe math evaluation (no `eval()`)
- ✅ Safe URL opening with validation
- ✅ ARIA labels for accessibility
