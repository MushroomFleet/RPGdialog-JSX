/**
 * RPGDialogue.jsx
 * A versatile React component for RPG-style dialogue systems
 * 
 * Supports two modes:
 * 1. Toast Mode - Small overlay portrait + text bubble (StarFox style)
 * 2. Fullscreen Mode - Full character image + narrative text box (JRPG style)
 * 
 * @author RPG Dialogue System
 * @version 1.0.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';

// ============================================================================
// STYLES
// ============================================================================

const styles = {
  // Container that wraps everything
  container: {
    position: 'fixed',
    zIndex: 9999,
    fontFamily: '"Press Start 2P", "Courier New", monospace',
    pointerEvents: 'none',
  },
  
  // Toast mode container (bottom-left corner by default)
  toastContainer: {
    bottom: '20px',
    left: '20px',
    display: 'flex',
    alignItems: 'flex-end',
    gap: '12px',
    maxWidth: '420px',
  },
  
  // Fullscreen mode container
  fullscreenContainer: {
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)',
  },
  
  // Portrait frame for toast mode
  portraitFrame: {
    width: '80px',
    height: '80px',
    border: '4px solid #ffd700',
    borderRadius: '8px',
    background: 'linear-gradient(145deg, #1a1a2e 0%, #0f0f1a 100%)',
    boxShadow: '0 0 20px rgba(255, 215, 0, 0.3), inset 0 0 10px rgba(0,0,0,0.5)',
    overflow: 'hidden',
    flexShrink: 0,
    position: 'relative',
  },
  
  // Portrait image styling
  portraitImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    imageRendering: 'pixelated',
  },
  
  // Animated frame border effect
  portraitGlow: {
    position: 'absolute',
    inset: '-4px',
    border: '4px solid transparent',
    borderRadius: '12px',
    background: 'linear-gradient(45deg, #ffd700, #ff6b35, #ffd700) border-box',
    mask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
    maskComposite: 'exclude',
    animation: 'borderGlow 2s linear infinite',
  },
  
  // Toast text bubble
  toastBubble: {
    background: 'linear-gradient(145deg, #1a1a2e 0%, #0f0f1a 100%)',
    border: '3px solid #4a9eff',
    borderRadius: '12px',
    padding: '16px 20px',
    color: '#fff',
    fontSize: '11px',
    lineHeight: '1.6',
    boxShadow: '0 4px 20px rgba(74, 158, 255, 0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
    position: 'relative',
    maxWidth: '300px',
    pointerEvents: 'auto',
  },
  
  // Speech bubble arrow
  bubbleArrow: {
    position: 'absolute',
    left: '-12px',
    bottom: '20px',
    width: 0,
    height: 0,
    borderTop: '10px solid transparent',
    borderBottom: '10px solid transparent',
    borderRight: '12px solid #4a9eff',
  },
  
  bubbleArrowInner: {
    position: 'absolute',
    left: '-8px',
    bottom: '22px',
    width: 0,
    height: 0,
    borderTop: '8px solid transparent',
    borderBottom: '8px solid transparent',
    borderRight: '10px solid #1a1a2e',
  },
  
  // Character name tag
  nameTag: {
    position: 'absolute',
    top: '-14px',
    left: '12px',
    background: 'linear-gradient(145deg, #ff6b35, #e55a2b)',
    padding: '4px 12px',
    borderRadius: '4px',
    fontSize: '9px',
    fontWeight: 'bold',
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    boxShadow: '0 2px 8px rgba(255, 107, 53, 0.4)',
  },
  
  // Fullscreen character image container
  characterContainer: {
    position: 'absolute',
    bottom: '180px',
    left: '5%',
    maxWidth: '40%',
    maxHeight: '70%',
    pointerEvents: 'none',
  },
  
  // Fullscreen character image
  characterImage: {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain',
    filter: 'drop-shadow(0 0 30px rgba(0,0,0,0.8))',
  },
  
  // Fullscreen dialogue box
  dialogueBox: {
    margin: '20px',
    marginLeft: 'auto',
    width: '60%',
    maxWidth: '800px',
    background: 'linear-gradient(145deg, rgba(15, 15, 30, 0.95) 0%, rgba(10, 10, 20, 0.98) 100%)',
    border: '4px solid #ffd700',
    borderRadius: '16px',
    padding: '24px 32px',
    color: '#fff',
    fontSize: '14px',
    lineHeight: '1.8',
    boxShadow: '0 8px 40px rgba(0,0,0,0.6), 0 0 30px rgba(255, 215, 0, 0.2), inset 0 1px 0 rgba(255,255,255,0.1)',
    position: 'relative',
    pointerEvents: 'auto',
  },
  
  // Fullscreen name tag
  fullscreenNameTag: {
    position: 'absolute',
    top: '-18px',
    left: '24px',
    background: 'linear-gradient(145deg, #ffd700, #ffaa00)',
    padding: '8px 20px',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: 'bold',
    color: '#1a1a2e',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    boxShadow: '0 4px 15px rgba(255, 215, 0, 0.5)',
  },
  
  // Text content area
  textContent: {
    minHeight: '60px',
  },
  
  // Continue indicator
  continueIndicator: {
    position: 'absolute',
    bottom: '12px',
    right: '20px',
    fontSize: '10px',
    color: '#4a9eff',
    animation: 'bounce 1s ease-in-out infinite',
  },
  
  // Skip hint
  skipHint: {
    position: 'absolute',
    bottom: '12px',
    left: '20px',
    fontSize: '8px',
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: '1px',
  },
};

// ============================================================================
// KEYFRAME ANIMATIONS (injected into document)
// ============================================================================

const injectStyles = () => {
  if (typeof document === 'undefined') return;
  if (document.getElementById('rpg-dialogue-styles')) return;
  
  const styleSheet = document.createElement('style');
  styleSheet.id = 'rpg-dialogue-styles';
  styleSheet.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
    
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-5px); }
    }
    
    @keyframes borderGlow {
      0% { filter: hue-rotate(0deg); }
      100% { filter: hue-rotate(360deg); }
    }
    
    @keyframes slideInToast {
      from {
        opacity: 0;
        transform: translateX(-30px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
    
    @keyframes slideOutToast {
      from {
        opacity: 1;
        transform: translateX(0);
      }
      to {
        opacity: 0;
        transform: translateX(-30px);
      }
    }
    
    @keyframes slideInCharacter {
      from {
        opacity: 0;
        transform: translateX(-100px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
    
    @keyframes slideInDialogue {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
    
    @keyframes textCursor {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }
    
    .rpg-dialogue-cursor::after {
      content: '▌';
      animation: textCursor 0.8s ease-in-out infinite;
      color: #4a9eff;
    }
  `;
  document.head.appendChild(styleSheet);
};

// ============================================================================
// TYPEWRITER HOOK
// ============================================================================

const useTypewriter = (text, speed = 30, enabled = true) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const indexRef = useRef(0);
  
  useEffect(() => {
    if (!enabled) {
      setDisplayedText(text);
      setIsComplete(true);
      return;
    }
    
    setDisplayedText('');
    setIsComplete(false);
    indexRef.current = 0;
    
    const timer = setInterval(() => {
      if (indexRef.current < text.length) {
        setDisplayedText(text.slice(0, indexRef.current + 1));
        indexRef.current++;
      } else {
        setIsComplete(true);
        clearInterval(timer);
      }
    }, speed);
    
    return () => clearInterval(timer);
  }, [text, speed, enabled]);
  
  const skip = useCallback(() => {
    setDisplayedText(text);
    setIsComplete(true);
  }, [text]);
  
  return { displayedText, isComplete, skip };
};

// ============================================================================
// PORTRAIT ANIMATION HOOK
// ============================================================================

const usePortraitAnimation = (frames, frameRate = 150, enabled = true) => {
  const [currentFrame, setCurrentFrame] = useState(0);
  
  useEffect(() => {
    if (!enabled || !frames || frames.length <= 1) return;
    
    const timer = setInterval(() => {
      setCurrentFrame(prev => (prev + 1) % frames.length);
    }, frameRate);
    
    return () => clearInterval(timer);
  }, [frames, frameRate, enabled]);
  
  return frames && frames.length > 0 ? frames[currentFrame] : null;
};

// ============================================================================
// TOAST MODE COMPONENT
// ============================================================================

const ToastDialogue = ({
  character,
  text,
  portraitFrames,
  onComplete,
  onSkip,
  typewriterSpeed,
  autoAdvance,
  autoAdvanceDelay,
  showSkipHint,
  position,
}) => {
  const { displayedText, isComplete, skip } = useTypewriter(text, typewriterSpeed);
  const currentPortrait = usePortraitAnimation(portraitFrames, 150, !isComplete);
  const [isExiting, setIsExiting] = useState(false);
  
  useEffect(() => {
    if (isComplete && autoAdvance) {
      const timer = setTimeout(() => {
        setIsExiting(true);
        setTimeout(() => onComplete?.(), 300);
      }, autoAdvanceDelay);
      return () => clearTimeout(timer);
    }
  }, [isComplete, autoAdvance, autoAdvanceDelay, onComplete]);
  
  const handleClick = () => {
    if (!isComplete) {
      skip();
    } else {
      setIsExiting(true);
      setTimeout(() => onComplete?.(), 300);
    }
  };
  
  const positionStyles = {
    'bottom-left': { bottom: '20px', left: '20px' },
    'bottom-right': { bottom: '20px', right: '20px', flexDirection: 'row-reverse' },
    'top-left': { top: '20px', left: '20px' },
    'top-right': { top: '20px', right: '20px', flexDirection: 'row-reverse' },
  };
  
  return (
    <div
      style={{
        ...styles.container,
        ...styles.toastContainer,
        ...positionStyles[position],
        animation: isExiting ? 'slideOutToast 0.3s ease-out forwards' : 'slideInToast 0.4s ease-out',
      }}
      onClick={handleClick}
    >
      {/* Portrait */}
      <div style={styles.portraitFrame}>
        <div style={styles.portraitGlow} />
        {currentPortrait && (
          <img
            src={currentPortrait}
            alt={character}
            style={styles.portraitImage}
          />
        )}
      </div>
      
      {/* Text Bubble */}
      <div style={styles.toastBubble}>
        {position.includes('left') && (
          <>
            <div style={styles.bubbleArrow} />
            <div style={styles.bubbleArrowInner} />
          </>
        )}
        {position.includes('right') && (
          <>
            <div style={{ ...styles.bubbleArrow, left: 'auto', right: '-12px', borderRight: 'none', borderLeft: '12px solid #4a9eff' }} />
            <div style={{ ...styles.bubbleArrowInner, left: 'auto', right: '-8px', borderRight: 'none', borderLeft: '10px solid #1a1a2e' }} />
          </>
        )}
        
        <div style={styles.nameTag}>{character}</div>
        
        <div className={!isComplete ? 'rpg-dialogue-cursor' : ''}>
          {displayedText}
        </div>
        
        {isComplete && (
          <div style={styles.continueIndicator}>▼</div>
        )}
        
        {showSkipHint && !isComplete && (
          <div style={styles.skipHint}>CLICK TO SKIP</div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// FULLSCREEN MODE COMPONENT
// ============================================================================

const FullscreenDialogue = ({
  character,
  text,
  characterImage,
  pose,
  onComplete,
  onSkip,
  typewriterSpeed,
  showSkipHint,
}) => {
  const { displayedText, isComplete, skip } = useTypewriter(text, typewriterSpeed);
  const [isExiting, setIsExiting] = useState(false);
  
  const handleClick = () => {
    if (!isComplete) {
      skip();
    } else {
      setIsExiting(true);
      setTimeout(() => onComplete?.(), 400);
    }
  };
  
  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        handleClick();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isComplete]);
  
  return (
    <div
      style={{
        ...styles.container,
        ...styles.fullscreenContainer,
        animation: isExiting ? 'fadeOut 0.4s ease-out forwards' : 'fadeIn 0.3s ease-out',
      }}
      onClick={handleClick}
    >
      {/* Character Image */}
      {characterImage && (
        <div
          style={{
            ...styles.characterContainer,
            animation: 'slideInCharacter 0.5s ease-out',
          }}
        >
          <img
            src={characterImage}
            alt={character}
            style={styles.characterImage}
            data-pose={pose}
          />
        </div>
      )}
      
      {/* Dialogue Box */}
      <div
        style={{
          ...styles.dialogueBox,
          animation: 'slideInDialogue 0.4s ease-out 0.1s both',
        }}
      >
        <div style={styles.fullscreenNameTag}>{character}</div>
        
        <div style={styles.textContent} className={!isComplete ? 'rpg-dialogue-cursor' : ''}>
          {displayedText}
        </div>
        
        {isComplete && (
          <div style={styles.continueIndicator}>▼ CONTINUE</div>
        )}
        
        {showSkipHint && (
          <div style={styles.skipHint}>
            {isComplete ? 'CLICK OR PRESS SPACE' : 'CLICK TO SKIP'}
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * RPGDialogue - Main component for RPG-style dialogue systems
 * 
 * @param {Object} props
 * @param {'toast' | 'fullscreen'} props.mode - Display mode
 * @param {string} props.character - Character name
 * @param {string} props.text - Dialogue text to display
 * @param {string[]} props.portraitFrames - Array of image URLs for animated portrait (toast mode)
 * @param {string} props.characterImage - Full character image URL (fullscreen mode)
 * @param {string} props.pose - Current pose identifier (fullscreen mode)
 * @param {boolean} props.visible - Whether dialogue is visible
 * @param {Function} props.onComplete - Callback when dialogue is dismissed
 * @param {Function} props.onSkip - Callback when text is skipped
 * @param {number} props.typewriterSpeed - Milliseconds per character (default: 30)
 * @param {boolean} props.autoAdvance - Auto-advance after text completes (toast mode)
 * @param {number} props.autoAdvanceDelay - Delay before auto-advance in ms (default: 2000)
 * @param {boolean} props.showSkipHint - Show skip/continue hints
 * @param {string} props.position - Toast position: 'bottom-left', 'bottom-right', 'top-left', 'top-right'
 */
const RPGDialogue = ({
  mode = 'toast',
  character = 'Unknown',
  text = '',
  portraitFrames = [],
  characterImage = null,
  pose = 'default',
  visible = true,
  onComplete = () => {},
  onSkip = () => {},
  typewriterSpeed = 30,
  autoAdvance = false,
  autoAdvanceDelay = 2000,
  showSkipHint = true,
  position = 'bottom-left',
}) => {
  useEffect(() => {
    injectStyles();
  }, []);
  
  if (!visible) return null;
  
  if (mode === 'fullscreen') {
    return (
      <FullscreenDialogue
        character={character}
        text={text}
        characterImage={characterImage}
        pose={pose}
        onComplete={onComplete}
        onSkip={onSkip}
        typewriterSpeed={typewriterSpeed}
        showSkipHint={showSkipHint}
      />
    );
  }
  
  return (
    <ToastDialogue
      character={character}
      text={text}
      portraitFrames={portraitFrames}
      onComplete={onComplete}
      onSkip={onSkip}
      typewriterSpeed={typewriterSpeed}
      autoAdvance={autoAdvance}
      autoAdvanceDelay={autoAdvanceDelay}
      showSkipHint={showSkipHint}
      position={position}
    />
  );
};

// ============================================================================
// DIALOGUE SEQUENCE MANAGER
// ============================================================================

/**
 * useDialogueSequence - Hook for managing a sequence of dialogues
 * 
 * @param {Array} dialogues - Array of dialogue objects
 * @returns {Object} Sequence controls and current state
 */
export const useDialogueSequence = (dialogues = []) => {
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isActive, setIsActive] = useState(false);
  
  const start = useCallback(() => {
    if (dialogues.length > 0) {
      setCurrentIndex(0);
      setIsActive(true);
    }
  }, [dialogues.length]);
  
  const next = useCallback(() => {
    if (currentIndex < dialogues.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(-1);
      setIsActive(false);
    }
  }, [currentIndex, dialogues.length]);
  
  const skip = useCallback(() => {
    setCurrentIndex(-1);
    setIsActive(false);
  }, []);
  
  const reset = useCallback(() => {
    setCurrentIndex(-1);
    setIsActive(false);
  }, []);
  
  const currentDialogue = isActive && currentIndex >= 0 ? dialogues[currentIndex] : null;
  
  return {
    currentDialogue,
    currentIndex,
    isActive,
    isComplete: currentIndex >= dialogues.length - 1,
    start,
    next,
    skip,
    reset,
    totalCount: dialogues.length,
  };
};

// ============================================================================
// EXPORTS
// ============================================================================

export default RPGDialogue;
export { ToastDialogue, FullscreenDialogue };
