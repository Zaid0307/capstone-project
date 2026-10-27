import { useEffect, useState } from 'react';
import { BiArrowToTop } from 'react-icons/bi';
import styled from 'styled-components';
import IconButton from '../ui/IconButton';
import { colors, navigationOffset, shadows, space } from '../../styles/tokens';
import { useTranslation } from '../../i18n/LanguageContext';

const SCROLL_THRESHOLD = 500;

const prefersReducedMotion = () =>
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

export default function BackToTopButton() {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setIsVisible(window.scrollY > SCROLL_THRESHOLD);
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <Button
      aria-label={t('common.backToTop')}
      onClick={() =>
        window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
      }
    >
      <BiArrowToTop />
    </Button>
  );
}

// Floats over the content, so it needs its own surface to stay readable.
const Button = styled(IconButton)`
  position: fixed;
  right: ${space.lg};
  bottom: calc(${navigationOffset} + ${space.lg});
  z-index: 2;
  border: 1px solid ${colors.border};
  background-color: ${colors.surface};
  box-shadow: ${shadows.card};
`;
