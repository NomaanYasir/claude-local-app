import React, { useState, useEffect, useCallback, useRef } from 'react';
import TopBar from './components/TopBar';
import SearchBox from './components/SearchBox';
import ButtonsRow from './components/ButtonsRow';
import ResultsCards from './components/ResultsCards';
import ControlPanel from './components/ControlPanel';
import Toast from './components/Toast';
import OfflineBanner from './components/OfflineBanner';
import TestingChecklist from './components/TestingChecklist';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useWindowSize } from './hooks/useWindowSize';
import { useLocalStorage } from './hooks/useLocalStorage';
import { randomRange } from './utils/randomSeed';
import './styles/global.css';
import './App.css';

// Number of physics elements
const NUM_ELEMENTS = 10; // logo + search + buttons + 6 cards + buffer

function App() {
  // Physics state
  const [gravityOn, setGravityOn] = useLocalStorage('gravity-on', false);
  const [antigravityOn, setAntigravityOn] = useLocalStorage('antigravity-on', false);
  const [gravityStrength, setGravityStrength] = useLocalStorage('gravity-strength', 50);
  const [bounceStrength, setBounceStrength] = useLocalStorage('bounce-strength', 70);

  // UI state
  const [isShaking, setIsShaking] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isChecklistOpen, setIsChecklistOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // Physics positions and velocities
  const [positions, setPositions] = useState(() =>
    Array(NUM_ELEMENTS).fill(null).map(() => ({ x: 0, y: 0 }))
  );
  const [velocities, setVelocities] = useState(() =>
    Array(NUM_ELEMENTS).fill(null).map(() => ({ x: 0, y: 0 }))
  );
  const [isResetting, setIsResetting] = useState(false);

  const animationRef = useRef(null);
  const { height: windowHeight, width: windowWidth } = useWindowSize();

  // Show toast notification
  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);

  // Remove toast
  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Online/offline detection
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      showToast('Back online!', 'success');
    };
    const handleOffline = () => {
      setIsOffline(true);
      showToast('You are offline', 'warning');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [showToast]);

  // Physics animation loop
  useEffect(() => {
    if (!gravityOn && !antigravityOn) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const animate = () => {
      setPositions(prevPositions => {
        return prevPositions.map((pos, i) => {
          let newVelX = velocities[i]?.x || 0;
          let newVelY = velocities[i]?.y || 0;

          // Apply gravity
          if (gravityOn) {
            newVelY += (gravityStrength / 100) * 0.8;
          }

          // Apply antigravity
          if (antigravityOn) {
            newVelY -= (gravityStrength / 100) * 0.6;
            newVelX += randomRange(-0.5, 0.5); // Drift
          }

          // Apply friction
          newVelX *= 0.99;
          newVelY *= 0.99;

          let newX = pos.x + newVelX;
          let newY = pos.y + newVelY;

          // Bounce off bottom
          const maxY = windowHeight - 200;
          if (newY > maxY && gravityOn) {
            newY = maxY;
            newVelY = -Math.abs(newVelY) * (bounceStrength / 100);
          }

          // Bounce off top
          if (newY < -200 && antigravityOn) {
            newY = -200;
            newVelY = Math.abs(newVelY) * 0.5;
          }

          // Bounce off sides
          const maxX = windowWidth / 2 - 100;
          if (Math.abs(newX) > maxX) {
            newX = Math.sign(newX) * maxX;
            newVelX = -newVelX * 0.8;
          }

          // Update velocity state
          setVelocities(prevVel => {
            const newVel = [...prevVel];
            newVel[i] = { x: newVelX, y: newVelY };
            return newVel;
          });

          return { x: newX, y: newY };
        });
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gravityOn, antigravityOn, gravityStrength, bounceStrength, windowHeight, windowWidth, velocities]);

  // Toggle gravity
  const handleToggleGravity = useCallback(() => {
    setGravityOn(prev => {
      const newValue = !prev;
      showToast(newValue ? 'Gravity ON ⬇️' : 'Gravity OFF', newValue ? 'info' : 'warning');
      if (newValue) setAntigravityOn(false);
      return newValue;
    });
  }, [setGravityOn, setAntigravityOn, showToast]);

  // Toggle antigravity
  const handleToggleAntigravity = useCallback(() => {
    setAntigravityOn(prev => {
      const newValue = !prev;
      showToast(newValue ? 'Antigravity ON ⬆️' : 'Antigravity OFF', newValue ? 'info' : 'warning');
      if (newValue) setGravityOn(false);
      return newValue;
    });
  }, [setAntigravityOn, setGravityOn, showToast]);

  // Shake effect
  const handleShake = useCallback(() => {
    setIsShaking(true);
    showToast('Shake! 🫨', 'warning');

    // Add random velocity to all elements
    setVelocities(prev => prev.map(() => ({
      x: randomRange(-20, 20),
      y: randomRange(-20, 20),
    })));

    setTimeout(() => setIsShaking(false), 500);
  }, [showToast]);

  // Reset
  const handleReset = useCallback(() => {
    setIsResetting(true);
    setGravityOn(false);
    setAntigravityOn(false);

    // Animate back to original positions
    setPositions(Array(NUM_ELEMENTS).fill(null).map(() => ({ x: 0, y: 0 })));
    setVelocities(Array(NUM_ELEMENTS).fill(null).map(() => ({ x: 0, y: 0 })));

    showToast('Reset! 🔄', 'success');

    setTimeout(() => setIsResetting(false), 500);
  }, [setGravityOn, setAntigravityOn, showToast]);

  // Close panel
  const handleClosePanel = useCallback(() => {
    setIsPanelOpen(false);
  }, []);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    g: handleToggleGravity,
    a: handleToggleAntigravity,
    r: handleReset,
    escape: handleClosePanel,
  });

  // Get transform style for physics elements
  const getPhysicsStyle = (index) => ({
    transform: `translate(${positions[index]?.x || 0}px, ${positions[index]?.y || 0}px)`,
  });

  return (
    <div className={`app ${isShaking ? 'shaking' : ''}`}>
      <OfflineBanner isOffline={isOffline} />

      <main className="main-content">
        <div
          className={`physics-element ${isResetting ? 'resetting' : ''}`}
          style={getPhysicsStyle(0)}
        >
          <TopBar />
        </div>

        <div
          className={`physics-element ${isResetting ? 'resetting' : ''}`}
          style={getPhysicsStyle(1)}
        >
          <SearchBox onToast={showToast} />
        </div>

        <div
          className={`physics-element ${isResetting ? 'resetting' : ''}`}
          style={getPhysicsStyle(2)}
        >
          <ButtonsRow onToast={showToast} />
        </div>

        <div
          className={`physics-element ${isResetting ? 'resetting' : ''}`}
          style={getPhysicsStyle(3)}
        >
          <ResultsCards />
        </div>
      </main>

      <ControlPanel
        gravityOn={gravityOn}
        antigravityOn={antigravityOn}
        gravityStrength={gravityStrength}
        bounceStrength={bounceStrength}
        onToggleGravity={handleToggleGravity}
        onToggleAntigravity={handleToggleAntigravity}
        onGravityStrengthChange={setGravityStrength}
        onBounceStrengthChange={setBounceStrength}
        onReset={handleReset}
        onShake={handleShake}
        isOpen={isPanelOpen}
        onTogglePanel={() => setIsPanelOpen(prev => !prev)}
      />

      <TestingChecklist
        isOpen={isChecklistOpen}
        onToggle={() => setIsChecklistOpen(prev => !prev)}
        onTriggerGravity={handleToggleGravity}
        onTriggerAntigravity={handleToggleAntigravity}
        onTriggerShake={handleShake}
        onTriggerReset={handleReset}
      />

      <div className="toasts-container">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
