# 🎮 RPG Dialogue System

A versatile React component for RPG-style dialogue systems, supporting both in-game toast notifications (StarFox style) and full-screen narrative dialogues (JRPG style).

![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react)
![License](https://img.shields.io/badge/License-MIT-green)
![TypeScript Ready](https://img.shields.io/badge/TypeScript-Ready-3178C6?logo=typescript)

[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?logo=github)](https://github.com/MushroomFleet/RPGdialog-JSX)

---

## ✨ Features

### 🔔 Toast Mode (StarFox Style)
- Compact portrait + speech bubble overlay
- **Animated portrait** with configurable frame rate
- Auto-advance option with customizable delay
- Configurable screen position (corners)
- Non-intrusive game overlay

### 📖 Fullscreen Mode (JRPG Style)  
- Full character artwork display
- Character enters from left with slide animation
- Text box aligned to bottom-right
- Support for **pose/expression changes**
- Keyboard support (Space/Enter to advance)

### 🎨 Both Modes Include
- **Typewriter text effect** with configurable speed
- Click-to-skip text animation
- Continue indicator when text completes
- Smooth enter/exit animations
- Fully customizable styling
- Zero external dependencies (besides React)

---

## 🚀 Quick Start

### Demo Preview

Open `demo.html` in your browser for an interactive demonstration featuring:
- 4 sample characters with generated artwork
- Toggle between Toast and Fullscreen modes
- Multiple dialogue sequences per character

```bash
# Just open in browser
open demo.html
# or
xdg-open demo.html  # Linux
start demo.html     # Windows
```

### Basic Usage

```jsx
import RPGDialogue from './RPGDialogue';

function Game() {
  const [showDialogue, setShowDialogue] = useState(true);
  
  return (
    <RPGDialogue
      mode="toast"
      visible={showDialogue}
      character="Peppy"
      text="Do a barrel roll!"
      portraitFrames={[
        '/characters/peppy/frame1.png',
        '/characters/peppy/frame2.png',
        '/characters/peppy/frame3.png',
      ]}
      onComplete={() => setShowDialogue(false)}
    />
  );
}
```

---

## 📁 Package Contents

```
rpg-dialogue/
├── RPGDialogue.jsx          # Main React component
├── demo.html                # Interactive demo (standalone)
├── RPG-chat-integration.md  # Integration guide
└── README.md                # This file
```

---

## 🎯 Usage Modes

### Toast Mode

Perfect for in-game notifications, wingman callouts, and quick character commentary.

```jsx
<RPGDialogue
  mode="toast"
  character="Falco"
  text="Enemy squadron incoming!"
  portraitFrames={falcoPortraits}
  position="bottom-left"      // or: bottom-right, top-left, top-right
  autoAdvance={true}          // Auto-dismiss after reading
  autoAdvanceDelay={3000}     // 3 seconds
  typewriterSpeed={25}        // Faster typing
  onComplete={handleNext}
/>
```

### Fullscreen Mode

Perfect for story sequences, cutscenes, and important narrative moments.

```jsx
<RPGDialogue
  mode="fullscreen"
  character="Mysterious Sage"
  text="The prophecy speaks of one who would come from beyond the mountains..."
  characterImage="/characters/sage/full_thinking.png"
  pose="thinking"
  typewriterSpeed={35}        // Slower for dramatic effect
  showSkipHint={true}
  onComplete={handleNext}
/>
```

---

## 🔗 Dialogue Sequences

Use the included hook for managing multi-dialogue sequences:

```jsx
import RPGDialogue, { useDialogueSequence } from './RPGDialogue';

const storyDialogues = [
  { character: 'Hero', text: 'We made it...', pose: 'tired' },
  { character: 'Hero', text: 'But at what cost?', pose: 'sad' },
  { character: 'Companion', text: 'The village is safe now.', pose: 'hopeful' },
];

function Cutscene() {
  const { currentDialogue, isActive, start, next } = useDialogueSequence(storyDialogues);
  
  useEffect(() => { start(); }, []);
  
  if (!isActive) return <GameResumes />;
  
  return (
    <RPGDialogue
      mode="fullscreen"
      {...currentDialogue}
      onComplete={next}
    />
  );
}
```

---

## 🎨 Asset Requirements

### Portrait Images (Toast Mode)

| Property | Requirement |
|----------|-------------|
| Dimensions | Square (128×128 or 256×256 recommended) |
| Format | PNG (transparency optional) |
| Frames | 3+ frames for talk animation |
| Style | Consistent positioning across frames |

**Animation Pattern:**
```
Frame 1: Mouth closed
Frame 2: Mouth slightly open
Frame 3: Mouth fully open
```

### Character Images (Fullscreen Mode)

| Property | Requirement |
|----------|-------------|
| Dimensions | Tall aspect ratio (600×1000 recommended) |
| Format | PNG with **transparent background** |
| Poses | Multiple files for different expressions |
| Position | Character artwork positioned for left-side display |

---

## ⚙️ Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `mode` | `'toast' \| 'fullscreen'` | `'toast'` | Display mode |
| `visible` | `boolean` | `true` | Show/hide the dialogue |
| `character` | `string` | `'Unknown'` | Character name displayed |
| `text` | `string` | `''` | Dialogue text content |
| `portraitFrames` | `string[]` | `[]` | Array of portrait image URLs |
| `characterImage` | `string` | `null` | Full character image URL |
| `pose` | `string` | `'default'` | Pose identifier (data attribute) |
| `onComplete` | `function` | `() => {}` | Called when dialogue dismissed |
| `typewriterSpeed` | `number` | `30` | Milliseconds per character |
| `autoAdvance` | `boolean` | `false` | Auto-dismiss (toast only) |
| `autoAdvanceDelay` | `number` | `2000` | Delay before auto-dismiss (ms) |
| `showSkipHint` | `boolean` | `true` | Show skip/continue hints |
| `position` | `string` | `'bottom-left'` | Toast position on screen |

---

## 🔧 Integration

For detailed integration instructions including:
- Codebase assessment checklist
- Framework-specific setup (Next.js, Gatsby, Vite)
- Custom theming and styling
- Advanced patterns (branching dialogues, audio)
- Troubleshooting guide

**See: [RPG-chat-integration.md](./RPG-chat-integration.md)**

---

## 🎮 Inspiration

This component is inspired by classic dialogue systems from:

- **StarFox 64** - Wingman portrait callouts during gameplay
- **Final Fantasy** series - Full-screen character dialogues
- **Fire Emblem** - Character portraits with expressions
- **Persona** series - Stylized dialogue boxes
- **Undertale** - Character-specific text behaviors

---

## 📝 License

MIT License - Feel free to use in personal and commercial projects.

---

## 🤝 Contributing

Contributions welcome! Please submit issues and pull requests to the [GitHub repository](https://github.com/MushroomFleet/RPGdialog-JSX).

Areas for improvement:
- TypeScript type definitions
- Additional animation presets
- Voice/audio integration examples
- Mobile touch optimization
- Accessibility improvements (ARIA)

---

<div align="center">

**Made with ❤️ for game developers**

*"Do a barrel roll!"* - Peppy Hare

</div>

---

## 📚 Citation

### Academic Citation

If you use this codebase in your research or project, please cite:

```bibtex
@software{rpgdialog_jsx,
  title = {RPGdialog-JSX: A versatile React component for RPG-style dialogue systems},
  author = {Drift Johnson},
  year = {2025},
  url = {https://github.com/MushroomFleet/RPGdialog-JSX},
  version = {1.0.0}
}
```

### Donate:

[![Ko-Fi](https://cdn.ko-fi.com/cdn/kofi3.png?v=3)](https://ko-fi.com/driftjohnson)
