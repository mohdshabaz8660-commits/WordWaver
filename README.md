# WordWeaver 🎮

A modern, interactive word puzzle game built with HTML5, Tailwind CSS, and vanilla JavaScript. Find hidden words by rearranging letters with AI-powered hints!

## Features ✨

- **8 Challenging Levels** - Progressive difficulty from 3-letter words to complex 6-letter combinations
- **AI Weaver Hints** - Get clever, poetic clues using Google's Gemini API
- **Confetti Celebrations** - Particle effects burst when you complete a level
- **Mobile Optimized** - Fully responsive design works on phones, tablets, and desktops
- **Smooth Animations** - Pop animations, shake effects, and transitions for polished UX
- **Keyboard Support** - Use keyboard to input letters or mouse/touch to tap buttons
- **Score Tracking** - Points increase based on word length (Length × 10)

## How to Play 🎯

1. Click or tap letter buttons to select letters
2. Arrange them to form words from the word list
3. Click "SUBMIT" to check your answer
4. Use "SHUFFLE" to rearrange available letters
5. Use "CLEAR" (or Backspace) to undo selections
6. Get stuck? Use one of your 3 AI hints!

## Game Levels

| Level | Letters | Words | Difficulty |
|-------|---------|-------|--------------|
| 1 | A, T, E | ATE, EAT, TEA | Beginner |
| 2 | O, W, L | OWL, LOW | Easy |
| 3 | P, O, S, T | POST, POTS, SPOT, STOP, TOP, POT | Intermediate |
| 4 | R, A, T, E | RATE, TEAR, ART, TAR, RAT, EAT, ARE | Intermediate |
| 5 | B, L, E, N, D | BLEND, LEND, BEND, BED, LED, DEN, END | Advanced |
| 6 | S, P, A, R, K | SPARK, PARK, SPAR, RAP, PAR, SAP, SPA | Advanced |
| 7 | C, H, A, R, M | CHARM, MARCH, HARM, RAM, ARM, MAC, ARC, CAR | Expert |
| 8 | M, A, S, T, E, R | MASTER, STREAM, SMART, TEAM, MEAT, STAR, ARTS, REST, EARS | Expert |

## Project Structure 📁

```
WordWaver/
├── index.html          # Main HTML file with UI layout
├── js/
│   └── game.js         # Game logic and interactivity
├── README.md           # This file
└── .gitignore          # Git configuration
```

## Installation 🚀

1. Clone the repository:
```bash
git clone https://github.com/mohdshabaz8660-commits/WordWaver.git
cd WordWaver
```

2. Open `index.html` in a web browser (no build process needed!)

3. Start playing!

## AI Hints Feature 🤖

The game includes integration with Google's Gemini API for AI-powered hints:

- **3 hints per level** - Hints reset with each new level
- **Poetic clues** - AI generates creative riddles without spoiling the answer
- **Loading indicator** - Spinner shows while fetching hint

To enable hints, add your Gemini API key to the `fetchGeminiHint()` function in `js/game.js`:

```javascript
const apiKey = "your-api-key-here";
```

Get a free API key at [Google AI Studio](https://aistudio.google.com/)

## Technologies Used 🛠️

- **HTML5** - Semantic markup
- **Tailwind CSS** - Utility-first CSS framework for styling
- **Vanilla JavaScript** - Pure JS, no frameworks
- **Canvas API** - For confetti particle effects
- **Google Gemini API** - AI-powered hints (optional)

## Scoring System 📊

- **Points per word** = Word length × 10
- **Example:** Finding "MASTER" (6 letters) = 60 points
- **Level completion** - All words must be found to advance
- **Final score** - Total points after all 8 levels

## Keyboard Shortcuts ⌨️

| Key | Action |
|-----|--------|
| A-Z | Select letter |
| Enter | Submit word |
| Backspace | Clear last letter |
| Click buttons | Touch/mouse selection |

## Browser Support 🌐

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Game Features Deep Dive 🔍

### Letter Management
- Unique IDs track individual letters even when duplicates exist
- Letters are shuffled on level start
- Visual feedback shows selected vs. available letters

### Word Validation
- Real-time word checking against level word list
- Prevention of duplicate submissions
- Toast notifications for feedback

### Animations
- **Pop animation** - Letters expand when selected
- **Shake animation** - Input shakes on invalid submission
- **Confetti burst** - Particle effects on level completion

### Responsive Design
- Mobile-first approach
- Tailwind CSS breakpoints (sm:, md:, lg:)
- Touch-friendly button sizes
- Prevents pull-to-refresh on mobile

## Future Enhancements 💡

- [ ] Local storage for high scores
- [ ] Additional word lists
- [ ] Difficulty settings (Easy, Normal, Hard)
- [ ] Daily challenge mode
- [ ] Leaderboard with cloud sync
- [ ] Sound effects and background music
- [ ] Dark/light theme toggle
- [ ] Multiplayer support

## License 📄

MIT License - Feel free to use this project for learning or as a base for your own game!

## Contributing 🤝

Want to improve WordWeaver? Feel free to submit issues and pull requests!

## Support ❤️

If you enjoy WordWeaver, please consider giving it a star ⭐

---

**Happy Word Weaving!** 🧵✨