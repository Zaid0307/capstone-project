import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import {
  colors,
  fontWeights,
  navigationOffset,
  radii,
  shadows,
  sizes,
  space,
} from '../../styles/tokens';
import { useTranslation } from '../../i18n/LanguageContext';

// How long the undo message stays. Paused while the pointer or focus is on it.
const VISIBLE_MS = 8000;

const UndoContext = createContext(() => {});

// Deleting happens right away; a message offers to undo it instead of asking
// first ("Bench press removed – Undo"). A new message replaces the old one.
export function UndoProvider({ children }) {
  const { t } = useTranslation();
  const [notice, setNotice] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const timer = useRef(null);

  const showUndo = useCallback((message, onUndo) => {
    setNotice({ id: Date.now(), message, onUndo });
  }, []);

  useEffect(() => {
    if (!notice || isPaused) return undefined;
    timer.current = setTimeout(() => setNotice(null), VISIBLE_MS);
    return () => clearTimeout(timer.current);
  }, [notice, isPaused]);

  function handleUndo() {
    notice.onUndo();
    setNotice(null);
  }

  return (
    <UndoContext.Provider value={showUndo}>
      {children}
      <Region role="status" aria-live="polite">
        {notice && (
          <Toast
            key={notice.id}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onFocus={() => setIsPaused(true)}
            onBlur={() => setIsPaused(false)}
          >
            <span>{notice.message}</span>
            <UndoButton type="button" onClick={handleUndo}>
              {t('common.undo')}
            </UndoButton>
          </Toast>
        )}
      </Region>
    </UndoContext.Provider>
  );
}

export const useUndo = () => useContext(UndoContext);

const Region = styled.div`
  position: fixed;
  right: ${space.lg};
  bottom: calc(${navigationOffset} + ${space.lg});
  left: ${space.lg};
  z-index: 5;
  display: flex;
  justify-content: center;
  pointer-events: none;
`;

const Toast = styled.div`
  display: flex;
  align-items: center;
  gap: ${space.md};
  max-width: 32rem;
  padding: ${space.sm} ${space.sm} ${space.sm} ${space.lg};
  border-radius: ${radii.small};
  background-color: ${colors.dark};
  color: ${colors.hoverText};
  box-shadow: ${shadows.card};
  pointer-events: auto;
  span {
    flex: 1 1 auto;
    min-width: 0;
  }
`;

const UndoButton = styled.button`
  flex-shrink: 0;
  min-height: ${sizes.touchTarget};
  padding: 0 ${space.md};
  border: 1px solid ${colors.hoverText};
  border-radius: ${radii.small};
  background: transparent;
  color: ${colors.hoverText};
  font-weight: ${fontWeights.bold};
`;
