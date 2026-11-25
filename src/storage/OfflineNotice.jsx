import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { BiCloudUpload } from 'react-icons/bi';
import { useTranslation } from '../i18n/LanguageContext';
import { colors, fontSizes, radii, space } from '../styles/tokens';

// A small hint while changes made without a connection still wait to be sent.
export default function OfflineNotice({ stores }) {
  const { t } = useTranslation();
  const count = () => stores.reduce((sum, store) => sum + (store.pendingCount?.() ?? 0), 0);
  const [pending, setPending] = useState(count);

  useEffect(() => {
    const update = () => setPending(stores.reduce((sum, store) => sum + (store.pendingCount?.() ?? 0), 0));
    const unsubscribers = stores.map(store => store.subscribe?.(update));
    update();
    return () => unsubscribers.forEach(unsubscribe => unsubscribe?.());
  }, [stores]);

  return (
    <Hint role="status" hidden={pending === 0}>
      {pending > 0 && (
        <>
          <BiCloudUpload aria-hidden="true" /> {t('sync.pending')}
        </>
      )}
    </Hint>
  );
}

const Hint = styled.p`
  position: sticky;
  top: 0;
  z-index: 4;
  display: flex;
  align-items: center;
  gap: ${space.xs};
  margin: ${space.sm};
  padding: ${space.sm} ${space.md};
  border-radius: ${radii.small};
  background-color: ${colors.highlight};
  color: ${colors.text};
  font-size: ${fontSizes.caption};
  &[hidden] {
    display: none;
  }
`;
