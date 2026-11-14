import { useEffect, useId, useRef, useState } from 'react';
import styled from 'styled-components';
import { MdArrowBack, MdMoreVert } from 'react-icons/md';
import IconButton from '../ui/IconButton';
import { colors, fontWeights, radii, shadows, sizes, space } from '../../styles/tokens';
import { useTranslation } from '../../i18n/LanguageContext';

// A ⋮ disclosure button with a list of actions (same pattern as the plan card).
// `items`: { key, icon, label (visible), name (accessible name), onSelect,
// disabled, isDanger, dividerBefore, submenu: { items } }. An item with a
// submenu swaps the list for its items plus a "Back" button.
// Closes with Escape (focus back to ⋮), a tap outside and when focus leaves it.
export default function ActionMenu({ label, items }) {
  const { t } = useTranslation();
  const id = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [submenuKey, setSubmenuKey] = useState(null);
  const wrapperRef = useRef(null);
  const buttonRef = useRef(null);
  const menuRef = useRef(null);
  const shouldFocusFirst = useRef(false);

  function close({ focusButton = false } = {}) {
    setIsOpen(false);
    setSubmenuKey(null);
    if (focusButton) buttonRef.current?.focus();
  }

  useEffect(() => {
    if (!isOpen) return undefined;
    function handleKey(event) {
      if (event.key === 'Escape') {
        setIsOpen(false);
        setSubmenuKey(null);
        buttonRef.current?.focus();
      }
    }
    function handlePointer(event) {
      if (!wrapperRef.current?.contains(event.target)) {
        setIsOpen(false);
        setSubmenuKey(null);
      }
    }
    document.addEventListener('keydown', handleKey);
    document.addEventListener('pointerdown', handlePointer);
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.removeEventListener('pointerdown', handlePointer);
    };
  }, [isOpen]);

  // Switching to or from a submenu removes the pressed button: focus the first
  // action (not "Back").
  useEffect(() => {
    if (!shouldFocusFirst.current) return;
    shouldFocusFirst.current = false;
    menuRef.current?.querySelector('[data-menu-item]:not(:disabled)')?.focus();
  }, [submenuKey]);

  function openSubmenu(key) {
    shouldFocusFirst.current = true;
    setSubmenuKey(key);
  }

  function handleBlur(event) {
    if (isOpen && event.relatedTarget && !wrapperRef.current?.contains(event.relatedTarget)) {
      close();
    }
  }

  function select(item) {
    if (item.submenu) {
      openSubmenu(item.key);
      return;
    }
    close({ focusButton: true });
    item.onSelect();
  }

  const submenu = items.find(item => item.key === submenuKey)?.submenu;
  const shownItems = submenu ? submenu.items : items;

  return (
    <Wrapper ref={wrapperRef} onBlur={handleBlur}>
      <IconButton
        ref={buttonRef}
        aria-label={label}
        title={label}
        aria-expanded={isOpen}
        aria-controls={`${id}-menu`}
        onClick={() => (isOpen ? close() : setIsOpen(true))}
      >
        <MdMoreVert />
      </IconButton>
      {isOpen && (
        <Menu id={`${id}-menu`} ref={menuRef}>
          {submenu && (
            <>
              <li>
                <MenuItem type="button" onClick={() => openSubmenu(null)}>
                  <MdArrowBack aria-hidden="true" />
                  {t('planEditor.menu.back')}
                </MenuItem>
              </li>
              <Divider aria-hidden="true" />
            </>
          )}
          {shownItems.map(item => (
            <MenuEntry key={item.key} item={item} onSelect={() => select(item)} />
          ))}
        </Menu>
      )}
    </Wrapper>
  );
}

function MenuEntry({ item, onSelect }) {
  const Icon = item.icon;
  return (
    <>
      {item.dividerBefore && <Divider aria-hidden="true" />}
      <li>
        <MenuItem
          type="button"
          data-menu-item
          aria-label={item.name ?? item.label}
          disabled={item.disabled}
          $isDanger={item.isDanger}
          onClick={onSelect}
        >
          {Icon && <Icon aria-hidden="true" />}
          <ItemLabel>{item.label}</ItemLabel>
        </MenuItem>
      </li>
    </>
  );
}

const Wrapper = styled.div`
  position: relative;
  flex-shrink: 0;
`;

const Menu = styled.ul`
  position: absolute;
  top: calc(${sizes.touchTarget} + ${space.xs});
  right: 0;
  z-index: 3;
  width: max-content;
  min-width: 12rem;
  max-width: min(18rem, calc(100vw - 2 * ${space.md}));
  padding: ${space.xs} 0;
  border: 1px solid ${colors.border};
  border-radius: ${radii.small};
  background-color: ${colors.surface};
  box-shadow: ${shadows.card};
  list-style: none;
`;

const MenuItem = styled.button`
  display: flex;
  align-items: center;
  gap: ${space.sm};
  width: 100%;
  min-height: ${sizes.touchTarget};
  padding: 0 ${space.md};
  border: none;
  background: none;
  color: ${props => (props.$isDanger ? colors.error : colors.text)};
  font-weight: ${fontWeights.medium};
  text-align: left;
  svg {
    flex-shrink: 0;
    font-size: 1.25rem;
  }
  &:hover:not(:disabled) {
    background-color: ${colors.surfaceMuted};
  }
  &:disabled {
    opacity: 0.4;
  }
`;

const ItemLabel = styled.span`
  min-width: 0;
  overflow-wrap: anywhere;
`;

const Divider = styled.li`
  margin: ${space.xs} 0;
  border-top: 1px solid ${colors.surfaceMuted};
`;
