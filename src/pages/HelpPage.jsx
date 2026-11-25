import { Link } from 'react-router-dom';
import styled from 'styled-components';
import PageLayout from '../components/layout/PageLayout';
import { FormCard } from '../components/planEditor/formStyles';
import PageTitle from '../components/ui/PageTitle';
import { useTranslation } from '../i18n/LanguageContext';
import { routes } from '../routes';
import { colors, space } from '../styles/tokens';

// "Help for testers": how to open the app, create an account, install it on a
// phone, what works without an account, data export and deletion, privacy.
// The route is added by the app lead.
export default function HelpPage() {
  const { t } = useTranslation();

  return (
    <PageLayout>
      <PageTitle>{t('help.title')}</PageTitle>
      <Intro>{t('help.intro')}</Intro>
      <FormCard as="article">
        <section aria-labelledby="helpOpen">
          <h2 id="helpOpen">{t('help.open.title')}</h2>
          <p>{t('help.open.text')}</p>
        </section>
        <section aria-labelledby="helpAccount">
          <h2 id="helpAccount">{t('help.account.title')}</h2>
          <p>{t('help.account.text')}</p>
        </section>
        <section aria-labelledby="helpInstall">
          <h2 id="helpInstall">{t('help.install.title')}</h2>
          <List>
            <li>{t('help.install.iphone')}</li>
            <li>{t('help.install.android')}</li>
          </List>
          <p>{t('help.install.text')}</p>
        </section>
        <section aria-labelledby="helpGuest">
          <h2 id="helpGuest">{t('help.guest.title')}</h2>
          <p>{t('help.guest.text')}</p>
        </section>
        <section aria-labelledby="helpData">
          <h2 id="helpData">{t('help.data.title')}</h2>
          <p>{t('help.data.text')}</p>
          <p>
            <Link to={routes.settings}>{t('settings.title')}</Link> · <Link to={routes.account}>{t('account.title')}</Link>
          </p>
        </section>
        <section aria-labelledby="helpPrivacy">
          <h2 id="helpPrivacy">{t('help.privacy.title')}</h2>
          <p>{t('help.privacy.text')}</p>
          <p>
            <Link to={routes.privacy}>{t('help.privacyLink')}</Link>
          </p>
        </section>
        <Feedback>{t('help.feedback')}</Feedback>
      </FormCard>
    </PageLayout>
  );
}

const Intro = styled.p`
  margin-bottom: ${space.sm};
  color: ${colors.textMuted};
`;

const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${space.xs};
  padding-left: ${space.lg};
  list-style: disc;
`;

const Feedback = styled.p`
  padding-top: ${space.md};
  border-top: 1px solid ${colors.border};
`;
