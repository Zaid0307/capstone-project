import { BiHide, BiShow } from 'react-icons/bi';
import IconButton from './IconButton';
import { useTranslation } from '../../i18n/LanguageContext';

export default function ToggleButton({ isExpanded, onToggle, name }) {
  const { t } = useTranslation();

  return (
    <IconButton
      aria-label={t(isExpanded ? 'common.hide' : 'common.show', { name })}
      aria-expanded={isExpanded}
      onClick={onToggle}
    >
      {isExpanded ? <BiHide /> : <BiShow />}
    </IconButton>
  );
}
