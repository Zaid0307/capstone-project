import { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import PageLayout from '../components/layout/PageLayout';
import { ErrorText, Field, FormCard, Input, Label } from '../components/planEditor/formStyles';
import Button from '../components/ui/Button';
import PageTitle from '../components/ui/PageTitle';
import { MIN_PASSWORD_LENGTH, isGoogleSignInEnabled, useAuth } from '../auth/AuthContext';
import { useTranslation } from '../i18n/LanguageContext';
import ExportDataButton from '../storage/ExportDataButton';
import { countPendingChanges } from '../storage/accountCopies';
import { usePlanStore } from '../storage/PlanStoreContext';
import { useWorkoutStore } from '../storage/WorkoutStoreContext';
import { routes } from '../routes';
import { colors, fontSizes, radii, space } from '../styles/tokens';

// Sign in, create an account, reset the password; when signed in: sign out
// and delete the account. After the link from the reset e-mail: set a new password.
export default function AccountPage() {
  const { t } = useTranslation();
  const auth = useAuth();
  const [passwordChanged, setPasswordChanged] = useState(false);

  return (
    <PageLayout>
      <PageTitle>{t('account.title')}</PageTitle>
      <Muted>{t('account.testVersion')}</Muted>
      {!auth.isConfigured ? (
        <FormCard>
          <p>{t('account.notConfigured')}</p>
        </FormCard>
      ) : auth.isRecovering ? (
        <NewPasswordForm auth={auth} onDone={() => setPasswordChanged(true)} />
      ) : auth.user ? (
        <>
          {passwordChanged && <Notice role="status">{t('account.passwordChanged')}</Notice>}
          <SignedIn auth={auth} />
        </>
      ) : (
        <SignInForms auth={auth} />
      )}
    </PageLayout>
  );
}

export function SignInForms({ auth, showGoogle = isGoogleSignInEnabled }) {
  const { t } = useTranslation();
  const [mode, setMode] = useState('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [consent, setConsent] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [isBusy, setIsBusy] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setIsBusy(true);
    try {
      if (mode === 'signIn') await auth.signIn(email.trim(), password);
      if (mode === 'signUp') {
        const mustConfirm = await auth.signUp(email.trim(), password);
        if (mustConfirm) {
          setMessage(t('account.confirmEmail'));
          setMode('signIn');
        }
      }
      if (mode === 'reset') {
        await auth.resetPassword(email.trim());
        setMessage(t('account.resetSent'));
      }
    } catch (submitError) {
      setError(t('account.error', { message: submitError.message }));
    } finally {
      setIsBusy(false);
    }
  }

  const switchTo = next => {
    setMode(next);
    setError(null);
  };

  return (
    <FormCard as="form" onSubmit={handleSubmit} aria-labelledby="accountFormTitle">
      <h2 id="accountFormTitle">{t(`account.${mode}Title`)}</h2>
      <p>{t('account.freeVersion')}</p>
      {message && <Notice role="status">{message}</Notice>}
      <Field>
        <Label htmlFor="accountEmail">{t('account.email')}</Label>
        <Input
          id="accountEmail"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={event => setEmail(event.target.value)}
        />
      </Field>
      {mode !== 'reset' && (
        <Field>
          <Label htmlFor="accountPassword">{t('account.password')}</Label>
          <Input
            id="accountPassword"
            type="password"
            autoComplete={mode === 'signUp' ? 'new-password' : 'current-password'}
            minLength={8}
            required
            aria-describedby={mode === 'signUp' ? 'passwordHint' : undefined}
            value={password}
            onChange={event => setPassword(event.target.value)}
          />
          {mode === 'signUp' && <Muted id="passwordHint">{t('account.passwordHint')}</Muted>}
        </Field>
      )}
      {mode === 'signUp' && (
        <Consent>
          <input type="checkbox" required checked={consent} onChange={event => setConsent(event.target.checked)} />
          <span>
            {t('account.consent')} <Link to={routes.privacy}>{t('account.privacyLink')}</Link>
          </span>
        </Consent>
      )}
      {error && <ErrorText role="alert">{error}</ErrorText>}
      <Actions>
        <Button type="submit" disabled={isBusy || (mode === 'signUp' && !consent)}>
          {t(mode === 'signIn' ? 'account.signIn' : mode === 'signUp' ? 'account.signUp' : 'account.sendReset')}
        </Button>
      </Actions>
      {showGoogle && mode !== 'reset' && <GoogleSignIn auth={auth} />}
      <Links>
        {mode !== 'signUp' && (
          <TextButton type="button" onClick={() => switchTo('signUp')}>
            {t('account.toSignUp')}
          </TextButton>
        )}
        {mode !== 'signIn' && (
          <TextButton type="button" onClick={() => switchTo('signIn')}>
            {t('account.toSignIn')}
          </TextButton>
        )}
        {mode === 'signIn' && (
          <TextButton type="button" onClick={() => switchTo('reset')}>
            {t('account.toReset')}
          </TextButton>
        )}
      </Links>
    </FormCard>
  );
}

// Sign-in with Google. A Google sign-in can create a new account, so the
// privacy consent is asked here as well.
function GoogleSignIn({ auth }) {
  const { t } = useTranslation();
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState(null);

  async function handleClick() {
    setError(null);
    try {
      await auth.signInWithGoogle();
    } catch (googleError) {
      setError(t('account.error', { message: googleError.message }));
    }
  }

  return (
    <GoogleBox aria-labelledby="googleTitle">
      <p id="googleTitle">{t('account.orGoogle')}</p>
      <Consent>
        <input type="checkbox" checked={consent} onChange={event => setConsent(event.target.checked)} />
        <span>
          {t('account.googleConsent')} <Link to={routes.privacy}>{t('account.privacyLink')}</Link>
        </span>
      </Consent>
      {error && <ErrorText role="alert">{error}</ErrorText>}
      <Button type="button" $variant="secondary" disabled={!consent} onClick={handleClick}>
        {t('account.google')}
      </Button>
    </GoogleBox>
  );
}

// Shown after the link from the "reset password" e-mail.
function NewPasswordForm({ auth, onDone }) {
  const { t } = useTranslation();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isBusy, setIsBusy] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(t('account.passwordTooShort'));
      return;
    }
    setIsBusy(true);
    try {
      await auth.updatePassword(password);
      onDone();
    } catch (submitError) {
      setError(t('account.error', { message: submitError.message }));
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <FormCard as="form" onSubmit={handleSubmit} aria-labelledby="newPasswordTitle" noValidate>
      <h2 id="newPasswordTitle">{t('account.newPasswordTitle')}</h2>
      <p>{t('account.newPasswordIntro')}</p>
      <Field>
        <Label htmlFor="newPassword">{t('account.newPassword')}</Label>
        <Input
          id="newPassword"
          type="password"
          autoComplete="new-password"
          minLength={MIN_PASSWORD_LENGTH}
          required
          aria-describedby="newPasswordHint"
          aria-invalid={Boolean(error)}
          value={password}
          onChange={event => setPassword(event.target.value)}
        />
        <Muted id="newPasswordHint">{t('account.passwordHint')}</Muted>
      </Field>
      {error && <ErrorText role="alert">{error}</ErrorText>}
      <Actions>
        <Button type="submit" disabled={isBusy}>
          {t('account.savePassword')}
        </Button>
      </Actions>
    </FormCard>
  );
}

function SignedIn({ auth }) {
  const { t } = useTranslation();
  const [isConfirming, setIsConfirming] = useState(false);
  const [isConfirmingSignOut, setIsConfirmingSignOut] = useState(false);
  const [error, setError] = useState(null);
  const planStore = usePlanStore();
  const workoutStore = useWorkoutStore();

  async function run(action) {
    setError(null);
    try {
      await action();
    } catch (actionError) {
      setError(t('account.error', { message: actionError.message }));
    }
  }

  // Changes made offline that were not sent yet are lost on sign-out: try to
  // send them first, and ask if some still wait.
  async function handleSignOut() {
    setError(null);
    await Promise.all([planStore.flush?.(), workoutStore.flush?.()]).catch(() => {});
    if (countPendingChanges(auth.user.id) > 0) setIsConfirmingSignOut(true);
    else run(auth.signOut);
  }

  return (
    <FormCard>
      <p>
        <strong>{t('account.signedInAs', { email: auth.user.email })}</strong>
      </p>
      <p>{t('account.savedOnline')}</p>
      {error && <ErrorText role="alert">{error}</ErrorText>}
      <Actions>
        <ExportDataButton />
        <Button $variant="secondary" onClick={handleSignOut}>
          {t('account.signOut')}
        </Button>
        {!isConfirming && (
          <Button $variant="secondary" onClick={() => setIsConfirming(true)}>
            {t('account.delete')}
          </Button>
        )}
      </Actions>
      {isConfirmingSignOut && (
        <Confirm role="alertdialog" aria-labelledby="pendingTitle" aria-describedby="pendingText">
          <p id="pendingTitle">
            <strong>{t('account.pendingTitle')}</strong>
          </p>
          <p id="pendingText">{t('account.pendingText')}</p>
          <Actions>
            <Button onClick={() => run(auth.signOut)}>{t('account.signOutAnyway')}</Button>
            <Button $variant="secondary" onClick={() => setIsConfirmingSignOut(false)}>
              {t('account.cancel')}
            </Button>
          </Actions>
        </Confirm>
      )}
      {isConfirming && (
        <Confirm role="alertdialog" aria-labelledby="deleteAccountTitle" aria-describedby="deleteAccountText">
          <p id="deleteAccountTitle">
            <strong>{t('account.deleteTitle')}</strong>
          </p>
          <p id="deleteAccountText">{t('account.deleteText')}</p>
          <Actions>
            <Button onClick={() => run(auth.deleteAccount)}>{t('account.deleteConfirm')}</Button>
            <Button $variant="secondary" onClick={() => setIsConfirming(false)}>
              {t('account.keep')}
            </Button>
          </Actions>
        </Confirm>
      )}
    </FormCard>
  );
}

const Muted = styled.p`
  color: ${colors.textMuted};
  font-size: ${fontSizes.caption};
`;

const GoogleBox = styled.section`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${space.sm};
  padding-top: ${space.md};
  border-top: 1px solid ${colors.border};
`;

const Notice = styled.p`
  padding: ${space.md};
  border-radius: ${radii.small};
  background-color: ${colors.highlight};
`;

const Consent = styled.label`
  display: flex;
  align-items: flex-start;
  gap: ${space.sm};
  input {
    flex-shrink: 0;
    width: 1.25rem;
    height: 1.25rem;
    margin-top: 2px;
    accent-color: ${colors.primary};
  }
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${space.sm};
`;

const Links = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${space.xs};
`;

const TextButton = styled.button`
  min-height: 44px;
  padding: 0;
  border: none;
  background: none;
  color: ${colors.primary};
  text-decoration: underline;
`;

const Confirm = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${space.sm};
  padding: ${space.md};
  border: 2px solid ${colors.error};
  border-radius: ${radii.small};
  background-color: ${colors.errorSurface};
`;
