import { useEffect, useState } from 'react';
import { BiArrowToTop } from 'react-icons/bi';
import styled from 'styled-components';
import { colors } from '../../styles/colors';
import { useTranslation } from '../../i18n/LanguageContext';

const SCROLL_THRESHOLD = 500;

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
      type="button"
      aria-label={t('common.backToTop')}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      <BiArrowToTop size={30} />
    </Button>
  );
}

const Button = styled.button`
  position: fixed;
  bottom: 60px;
  right: 10px;
  display: inline-flex;
  width: 30px;
  height: 30px;
  border: 2px solid ${colors.text};
  border-radius: 50%;
  background-color: ${colors.primary};
  color: white;
`;
