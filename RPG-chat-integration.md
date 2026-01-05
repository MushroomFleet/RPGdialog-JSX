# RPG Chat Integration Guide

A comprehensive guide for integrating the RPGDialogue component into your existing React application.

---

## Table of Contents

1. [Pre-Integration Assessment](#pre-integration-assessment)
2. [Installation Methods](#installation-methods)
3. [Basic Integration](#basic-integration)
4. [Asset Preparation](#asset-preparation)
5. [Styling Customization](#styling-customization)
6. [Advanced Patterns](#advanced-patterns)
7. [Framework-Specific Notes](#framework-specific-notes)
8. [Troubleshooting](#troubleshooting)

---

## Pre-Integration Assessment

Before integrating, assess your target codebase:

### Checklist

```
□ React version >= 16.8 (requires Hooks)
□ CSS-in-JS or external CSS support
□ Asset pipeline for images
□ Z-index management strategy
□ Existing modal/overlay system (potential conflicts)
□ Animation library in use (if any)
```

### Compatibility Check

```javascript
// Run in your project to verify React version
console.log('React version:', React.version);
// Must be 16.8.0 or higher
```

### Identify Potential Conflicts

| Area | Check For | Solution |
|------|-----------|----------|
| Z-index | Existing overlays, modals, tooltips | Adjust `zIndex` in styles |
| Fonts | Custom font loading | Include Press Start 2P or substitute |
| Animations | CSS animation naming conflicts | Prefix animation names |
| Event handling | Global click handlers | Use event propagation control |

---

## Installation Methods

### Method 1: Direct File Copy (Recommended for customization)

```bash
# Copy the component to your project
cp RPGDialogue.jsx src/components/RPGDialogue.jsx
```

### Method 2: As a Local Package

```bash
# Create a local package structure
mkdir -p packages/rpg-dialogue
cp RPGDialogue.jsx packages/rpg-dialogue/index.jsx

# Add to package.json
{
  "dependencies": {
    "rpg-dialogue": "file:./packages/rpg-dialogue"
  }
}
```

### Method 3: Git Submodule

```bash
git submodule add https://github.com/MushroomFleet/RPGdialog-JSX.git src/vendor/rpg-dialogue
```

---

## Basic Integration

### Step 1: Import the Component

```jsx
import RPGDialogue, { useDialogueSequence } from './components/RPGDialogue';
```

### Step 2: Add to Your App

```jsx
function GameUI() {
  const [showDialogue, setShowDialogue] = useState(false);
  
  return (
    <div className="game-container">
      {/* Your game content */}
      <GameWorld />
      
      {/* Dialogue overlay */}
      <RPGDialogue
        mode="toast"
        visible={showDialogue}
        character="Aria"
        text="Watch out! Enemy approaching from the north!"
        portraitFrames={[
          '/assets/characters/aria/frame1.png',
          '/assets/characters/aria/frame2.png',
          '/assets/characters/aria/frame3.png',
        ]}
        onComplete={() => setShowDialogue(false)}
      />
    </div>
  );
}
```

### Step 3: Trigger Dialogues

```jsx
// Event-based trigger
const handleEnemySpotted = () => {
  setShowDialogue(true);
};

// Timer-based trigger
useEffect(() => {
  const timer = setTimeout(() => setShowDialogue(true), 5000);
  return () => clearTimeout(timer);
}, []);

// Game state trigger
useEffect(() => {
  if (gameState.phase === 'cutscene') {
    setShowDialogue(true);
  }
}, [gameState.phase]);
```

---

## Asset Preparation

### Portrait Images (Toast Mode)

**Requirements:**
- Square aspect ratio (recommended: 128x128 or 256x256)
- PNG with transparency OR solid background
- 3 frames minimum for animation (can repeat frames)
- Consistent character positioning across frames

**Frame Animation Pattern:**
```
Frame 1: Mouth closed
Frame 2: Mouth slightly open  
Frame 3: Mouth open
```

**Example file structure:**
```
assets/
└── characters/
    └── aria/
        ├── portrait_1.png  # Mouth closed
        ├── portrait_2.png  # Mouth half-open
        └── portrait_3.png  # Mouth open
```

**Optimization:**
```bash
# Compress portraits (requires imagemagick)
convert portrait_*.png -resize 128x128 -quality 85 optimized_%d.png
```

### Full Character Images (Fullscreen Mode)

**Requirements:**
- Transparent PNG (no background)
- Tall aspect ratio (recommended: 600x1000 or similar)
- Multiple poses as separate files
- Character positioned for left-side display

**Pose Naming Convention:**
```
assets/
└── characters/
    └── aria/
        ├── full_default.png
        ├── full_excited.png
        ├── full_thinking.png
        ├── full_angry.png
        └── full_sad.png
```

### Using Sprite Sheets

If you prefer sprite sheets over individual files:

```jsx
// Utility to extract frames from sprite sheet
const extractFrames = (sheetUrl, frameCount, frameWidth, frameHeight) => {
  return Array.from({ length: frameCount }, (_, i) => ({
    url: sheetUrl,
    offset: i * frameWidth,
  }));
};

// Custom portrait renderer for sprite sheets
const SpritePortrait = ({ sheet, frameIndex, frameWidth, frameHeight }) => (
  <div
    style={{
      width: frameWidth,
      height: frameHeight,
      backgroundImage: `url(${sheet})`,
      backgroundPosition: `-${frameIndex * frameWidth}px 0`,
    }}
  />
);
```

---

## Styling Customization

### Theme Variables

Create a theme configuration:

```jsx
// themes/rpgDialogue.js
export const defaultTheme = {
  colors: {
    primary: '#ffd700',      // Gold accents
    secondary: '#4a9eff',    // Blue highlights
    background: '#1a1a2e',   // Dark purple-blue
    text: '#ffffff',
    nameTagBg: '#ff6b35',    // Orange name tags
  },
  fonts: {
    display: '"Press Start 2P", monospace',
    body: '"Press Start 2P", monospace',
  },
  borders: {
    radius: '12px',
    width: '4px',
  },
  animations: {
    typewriterSpeed: 30,
    transitionDuration: '0.3s',
  },
};

export const retroTheme = {
  colors: {
    primary: '#00ff00',
    secondary: '#00ff00',
    background: '#000000',
    text: '#00ff00',
    nameTagBg: '#003300',
  },
  // ...
};
```

### Applying Custom Styles

```jsx
// Wrapper component with custom styling
const ThemedRPGDialogue = ({ theme = defaultTheme, ...props }) => {
  const customStyles = useMemo(() => ({
    '--rpg-primary': theme.colors.primary,
    '--rpg-secondary': theme.colors.secondary,
    '--rpg-bg': theme.colors.background,
    '--rpg-text': theme.colors.text,
  }), [theme]);
  
  return (
    <div style={customStyles}>
      <RPGDialogue {...props} />
    </div>
  );
};
```

### CSS Override Examples

```css
/* Override in your global CSS */

/* Custom toast bubble */
.rpg-dialogue-toast-bubble {
  background: linear-gradient(145deg, #2d1b4e, #1a1030) !important;
  border-color: #9b59b6 !important;
}

/* Custom portrait glow */
.rpg-dialogue-portrait-glow {
  background: linear-gradient(45deg, #9b59b6, #3498db, #9b59b6) border-box !important;
}

/* Disable pixel font for modern look */
.rpg-dialogue-container {
  font-family: 'Inter', sans-serif !important;
  font-size: 14px !important;
}
```

---

## Advanced Patterns

### Dialogue Sequences

```jsx
const cutsceneDialogues = [
  {
    character: 'Aria',
    text: 'The ancient temple lies ahead...',
    characterImage: '/assets/aria/full_default.png',
    pose: 'default',
  },
  {
    character: 'Aria',
    text: 'I sense a powerful presence within!',
    characterImage: '/assets/aria/full_excited.png',
    pose: 'excited',
  },
  {
    character: 'Rex',
    text: 'Stay alert. This could be a trap.',
    characterImage: '/assets/rex/full_serious.png',
    pose: 'serious',
  },
];

function Cutscene() {
  const {
    currentDialogue,
    isActive,
    start,
    next,
  } = useDialogueSequence(cutsceneDialogues);
  
  useEffect(() => {
    start();
  }, []);
  
  if (!isActive) return null;
  
  return (
    <RPGDialogue
      mode="fullscreen"
      visible={true}
      character={currentDialogue.character}
      text={currentDialogue.text}
      characterImage={currentDialogue.characterImage}
      pose={currentDialogue.pose}
      onComplete={next}
    />
  );
}
```

### Branching Dialogues

```jsx
const dialogueTree = {
  start: {
    character: 'Merchant',
    text: 'Welcome, traveler! What brings you to my shop?',
    choices: [
      { label: 'Buy items', next: 'buy' },
      { label: 'Sell items', next: 'sell' },
      { label: 'Just looking', next: 'browse' },
    ],
  },
  buy: {
    character: 'Merchant',
    text: 'Excellent! Take a look at my wares.',
    action: 'openShop',
  },
  // ...
};

function DialogueWithChoices() {
  const [currentNode, setCurrentNode] = useState('start');
  const [showChoices, setShowChoices] = useState(false);
  
  const node = dialogueTree[currentNode];
  
  const handleComplete = () => {
    if (node.choices) {
      setShowChoices(true);
    } else if (node.action) {
      handleAction(node.action);
    }
  };
  
  return (
    <>
      <RPGDialogue
        mode="fullscreen"
        visible={!showChoices}
        character={node.character}
        text={node.text}
        onComplete={handleComplete}
      />
      
      {showChoices && (
        <DialogueChoices
          choices={node.choices}
          onSelect={(choice) => {
            setCurrentNode(choice.next);
            setShowChoices(false);
          }}
        />
      )}
    </>
  );
}
```

### Integration with State Management

```jsx
// Redux integration example
import { useSelector, useDispatch } from 'react-redux';
import { advanceDialogue, closeDialogue } from './dialogueSlice';

function ConnectedDialogue() {
  const dispatch = useDispatch();
  const { 
    isVisible, 
    currentDialogue,
    mode,
  } = useSelector(state => state.dialogue);
  
  if (!isVisible || !currentDialogue) return null;
  
  return (
    <RPGDialogue
      mode={mode}
      visible={true}
      character={currentDialogue.character}
      text={currentDialogue.text}
      portraitFrames={currentDialogue.portraits}
      characterImage={currentDialogue.fullImage}
      onComplete={() => dispatch(advanceDialogue())}
    />
  );
}
```

### Audio Integration

```jsx
function DialogueWithAudio({ ...props }) {
  const audioRef = useRef(null);
  const [isTyping, setIsTyping] = useState(true);
  
  // Play typing sound
  useEffect(() => {
    if (isTyping) {
      audioRef.current = new Audio('/sounds/type.mp3');
      audioRef.current.loop = true;
      audioRef.current.volume = 0.3;
      audioRef.current.play();
    }
    
    return () => {
      audioRef.current?.pause();
    };
  }, [isTyping]);
  
  // Play voice clip
  useEffect(() => {
    if (props.voiceClip) {
      const voice = new Audio(props.voiceClip);
      voice.play();
    }
  }, [props.voiceClip]);
  
  return (
    <RPGDialogue
      {...props}
      onTypewriterComplete={() => setIsTyping(false)}
    />
  );
}
```

---

## Framework-Specific Notes

### Next.js

```jsx
// Use dynamic import for client-only component
import dynamic from 'next/dynamic';

const RPGDialogue = dynamic(
  () => import('../components/RPGDialogue'),
  { ssr: false }
);
```

### Gatsby

```jsx
// In gatsby-browser.js
import './src/styles/rpg-dialogue.css';

// Use React.lazy for code splitting
const RPGDialogue = React.lazy(() => import('./RPGDialogue'));
```

### Create React App

Works out of the box. Just copy the component and import.

### Vite

```jsx
// vite.config.js - ensure CSS is processed
export default {
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
  },
};
```

### React Native (Web)

The component is web-only due to DOM dependencies. For React Native, you'll need to:
1. Replace `div` with `View`
2. Replace inline styles with StyleSheet
3. Use React Native's Animated API
4. Handle touch events instead of click

---

## Troubleshooting

### Common Issues

**Dialogue appears behind other elements**
```jsx
// Increase z-index
<RPGDialogue style={{ zIndex: 99999 }} />

// Or in your CSS
.rpg-dialogue-container {
  z-index: 99999 !important;
}
```

**Font not loading**
```html
<!-- Add to your HTML head -->
<link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
```

**Animations not working**
```jsx
// Ensure keyframes are injected
useEffect(() => {
  // Component auto-injects styles, but you may need to call manually
  import('./RPGDialogue').then(m => m.injectStyles?.());
}, []);
```

**Portrait not animating**
```jsx
// Ensure you're passing an array of frames
portraitFrames={[frame1, frame2, frame3]} // ✓ Array
portraitFrames={frame1} // ✗ Single image
```

**Click events not registering**
```jsx
// Check pointer-events
// The container has pointerEvents: 'none' by default
// Only interactive elements have pointerEvents: 'auto'
```

### Debug Mode

```jsx
// Add debug overlay
const RPGDialogueDebug = (props) => (
  <>
    <RPGDialogue {...props} />
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      background: 'black',
      color: 'lime',
      padding: 10,
      fontSize: 10,
      zIndex: 100000,
    }}>
      <pre>{JSON.stringify(props, null, 2)}</pre>
    </div>
  </>
);
```

---

## Quick Reference

### Props API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `mode` | `'toast' \| 'fullscreen'` | `'toast'` | Display mode |
| `visible` | `boolean` | `true` | Show/hide dialogue |
| `character` | `string` | `'Unknown'` | Character name |
| `text` | `string` | `''` | Dialogue text |
| `portraitFrames` | `string[]` | `[]` | Portrait animation frames |
| `characterImage` | `string` | `null` | Full character image |
| `pose` | `string` | `'default'` | Current pose identifier |
| `onComplete` | `function` | `() => {}` | Callback on dismiss |
| `typewriterSpeed` | `number` | `30` | Ms per character |
| `autoAdvance` | `boolean` | `false` | Auto-advance (toast) |
| `autoAdvanceDelay` | `number` | `2000` | Auto-advance delay (ms) |
| `showSkipHint` | `boolean` | `true` | Show skip hint |
| `position` | `string` | `'bottom-left'` | Toast position |

### Hook API

```jsx
const {
  currentDialogue,  // Current dialogue object
  currentIndex,     // Index in sequence
  isActive,         // Whether sequence is playing
  isComplete,       // Whether on last dialogue
  start,            // Start the sequence
  next,             // Advance to next
  skip,             // Skip entire sequence
  reset,            // Reset to beginning
  totalCount,       // Total dialogues
} = useDialogueSequence(dialogues);
```

---

## Support

For issues and feature requests, please open an issue on the [GitHub repository](https://github.com/MushroomFleet/RPGdialog-JSX).

Happy integrating! 🎮
