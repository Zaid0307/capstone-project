import styled from 'styled-components';
import PageLayout from '../components/layout/PageLayout';
import { FormCard } from '../components/planEditor/formStyles';
import PageTitle from '../components/ui/PageTitle';
import { PRIVACY_VERSION } from '../auth/AuthContext';
import { useTranslation } from '../i18n/LanguageContext';
import { colors, fontSizes, space } from '../styles/tokens';

// Privacy notice for the test phase. DRAFT written by the development team, not
// legal advice: the owner fills in the controller and checks the text before the
// first tester signs up (board card E35). Bump PRIVACY_VERSION on every change.
const CONTROLLER_PLACEHOLDER = {
  de: '[Name und Kontakt-E-Mail des Verantwortlichen eintragen]',
  en: '[Enter the name and contact e-mail of the controller]',
};

const SECTIONS = {
  de: [
    ['Wer ist verantwortlich?', `Verantwortlich für diese Testversion von GetFit! ist: ${CONTROLLER_PLACEHOLDER.de}. An diese Adresse kannst du dich mit allen Fragen zum Datenschutz wenden.`],
    ['Welche Daten?', 'Ohne Konto bleiben alle Daten (Pläne, Trainingstagebuch, Einstellungen) nur in deinem Browser auf diesem Gerät. Mit Konto speichern wir: deine E-Mail-Adresse, dein Passwort (nur verschlüsselt als Hash beim Anbieter Supabase), deine Trainingspläne, deine Trainings mit Sätzen, Gewichten, Wiederholungen und Notizen, deine Einstellungen sowie den Zeitpunkt deiner Einwilligung.'],
    ['Wozu?', 'Nur damit du die App nutzen und auf mehreren Geräten weiterarbeiten kannst, und um die App in der Testphase zu verbessern. Keine Werbung, kein Verkauf, keine Weitergabe an Dritte außer den unten genannten Dienstleistern.'],
    ['Rechtsgrundlage', 'Deine Einwilligung (Art. 6 Abs. 1 lit. a DSGVO). Trainingsdaten können Rückschlüsse auf deine Gesundheit zulassen; dafür gilt deine ausdrückliche Einwilligung (Art. 9 Abs. 2 lit. a DSGVO), die du beim Erstellen des Kontos gibst.'],
    ['Wo werden die Daten gespeichert?', 'Datenbank und Anmeldung: Supabase, Rechenzentrum in Frankfurt am Main (EU). Auslieferung der App: Vercel; dabei fallen technische Zugriffsdaten (z. B. IP-Adresse) in Server-Logs an. Mit beiden Anbietern besteht bzw. wird ein Auftragsverarbeitungsvertrag geschlossen.'],
    ['Wie lange?', 'Bis du dein Konto löschst oder die Testphase endet. Mit „Konto löschen“ werden dein Konto und alle Trainingsdaten sofort endgültig gelöscht.'],
    ['Deine Rechte', 'Du kannst jederzeit Auskunft, Berichtigung, Löschung, Einschränkung und die Herausgabe deiner Daten verlangen (in der App: „Meine Daten exportieren“ und „Konto löschen“). Du kannst deine Einwilligung jederzeit widerrufen, indem du dein Konto löschst. Außerdem kannst du dich bei einer Datenschutz-Aufsichtsbehörde beschweren.'],
  ],
  en: [
    ['Who is responsible?', `The controller of this test version of GetFit! is: ${CONTROLLER_PLACEHOLDER.en}. Contact this address with any privacy question.`],
    ['Which data?', 'Without an account, all data (plans, training diary, settings) stays in your browser on this device. With an account we store: your e-mail address, your password (only encrypted as a hash at the provider Supabase), your workout plans, your workouts with sets, weights, repetitions and notes, your settings and the time of your consent.'],
    ['What for?', 'Only so that you can use the app and continue on several devices, and to improve the app during the test phase. No advertising, no selling, no sharing with third parties except the service providers named below.'],
    ['Legal basis', 'Your consent (Art. 6(1)(a) GDPR). Training data may allow conclusions about your health; for this your explicit consent applies (Art. 9(2)(a) GDPR), which you give when creating the account.'],
    ['Where is the data stored?', 'Database and sign-in: Supabase, data centre in Frankfurt am Main (EU). Delivery of the app: Vercel; technical access data (e.g. IP address) appears in server logs. A data processing agreement exists or will be concluded with both providers.'],
    ['How long?', 'Until you delete your account or the test phase ends. "Delete account" deletes your account and all training data immediately and for good.'],
    ['Your rights', 'You can ask for access, correction, deletion, restriction and a copy of your data at any time (in the app: "Export my data" and "Delete account"). You can withdraw your consent at any time by deleting your account. You can also complain to a data protection authority.'],
  ],
};

export default function PrivacyPage() {
  const { t, language } = useTranslation();
  const sections = SECTIONS[language] ?? SECTIONS.en;

  return (
    <PageLayout>
      <PageTitle>{t('privacy.title')}</PageTitle>
      <Muted>Version {PRIVACY_VERSION}</Muted>
      <FormCard as="article">
        {sections.map(([title, text]) => (
          <section key={title}>
            <h2>{title}</h2>
            <p>{text}</p>
          </section>
        ))}
      </FormCard>
    </PageLayout>
  );
}

const Muted = styled.p`
  margin-bottom: ${space.sm};
  color: ${colors.textMuted};
  font-size: ${fontSizes.caption};
`;
