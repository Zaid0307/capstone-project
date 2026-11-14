# Backend (Supabase) – eingerichtet

Stand: 14.11.2026. **Entscheidung des Nutzers (14.11.2026):** Supabase als Backend (kostenloser Tarif, Region Frankfurt), Vercel als Hosting (kostenloser Hobby-Tarif, verbunden mit dem GitHub-Repository), und in der Testphase darf sich **jeder mit dem Link** registrieren. Alles hier ist vorbereitet, aber **noch nicht gegen eine echte Datenbank getestet**.

## Was vorbereitet ist

| Datei | Inhalt |
|---|---|
| `migrations/0001_accounts_and_plans.sql` | Tabellen für Profil, Einwilligungen und Pläne, Zugriffsregeln (jeder Nutzer sieht nur seine eigenen Daten), automatisches Anlegen des Profils, Löschen des eigenen Kontos |
| `src/storage/remotePlanStore.js` | Plan-Speicher für das Backend, mit derselben Schnittstelle wie der lokale Speicher. Dazu `copyMissingPlans`, um lokale Pläne beim ersten Anmelden ins Konto zu übernehmen. |
| `src/storage/remotePlanStore.test.js` | Tests gegen ein nachgebautes Supabase, inklusive Zugriffsregeln |
| `migrations/0002_workouts.sql` | Tabelle für das Trainingstagebuch (ein Dokument pro Training, Datum und Status als Spalten), gleiche Zugriffsregeln |
| `src/storage/remoteWorkoutStore.js` | Tagebuch-Speicher für das Backend mit derselben Schnittstelle wie der lokale, dazu `copyMissingWorkouts` |
| `../vercel.json` | Build und Weiterleitung aller Pfade auf `index.html` für Vercel |

Tabellen für eigene Dashboards und Ziele fehlen bewusst. Ihre Inhalte sind noch nicht entschieden (offene Frage O12).

## Einrichtung

1. **Konto anlegen** auf supabase.com. Der kostenlose Tarif reicht für die Entwicklung, das Projekt pausiert aber nach 7 Tagen ohne Nutzung.
2. **Neues Projekt** mit der Region **Central EU (Frankfurt)**. Das Datenbank-Passwort sicher aufbewahren.
3. Im **SQL-Editor** nacheinander `migrations/0001_accounts_and_plans.sql` und `migrations/0002_workouts.sql` ausführen (oder die Entwicklung macht das mit der Supabase-CLI, siehe unten).
4. **Anmeldung einrichten** (Authentication → Providers):
   - **E-Mail:** aktivieren, mit Bestätigung der E-Mail-Adresse
   - **Google:** braucht einen kostenlosen OAuth-Client in der Google Cloud Console. Die Weiterleitungsadresse zeigt Supabase an.
   - **Apple:** zurückgestellt, weil kostenpflichtig (Apple-Entwicklerprogramm)
5. Unter Authentication → URL Configuration die Adressen der App eintragen: `http://localhost:3000` und die Vercel-Adresse.
6. **Projekt-URL und anon key** (Project Settings → API) in eine Datei `.env.local` im Projekt eintragen. Die Datei wird nicht committet.
   ```
   VITE_SUPABASE_URL=https://<projekt>.supabase.co
   VITE_SUPABASE_ANON_KEY=<anon key>
   ```
   Der anon key ist für den Browser gedacht. Die Zugriffsregeln in der Datenbank schützen die Daten. Den **service_role key niemals** in die App oder ins Repository geben.
7. Dann folgt die Entwicklung von Phase 1: das Paket `@supabase/supabase-js` installieren, Anmeldeseiten bauen, nach dem Anmelden den Backend-Speicher statt des lokalen nutzen und lokale Pläne übernehmen.

## Datenschutz

- Supabase bietet einen Auftragsverarbeitungsvertrag (DPA) an. Vor echten Nutzerdaten abschließen.
- Gesundheitsdaten kommen erst in einer späteren Phase dazu. Dafür ist die Tabelle `consents` vorbereitet (ausdrückliche Einwilligung, widerrufbar, mit Verlauf).

## Testphase: Hosting und Verbindung (Stand 14.11.2026)

- **Vercel:** kostenloses Konto mit GitHub anmelden, das Repository importieren, als Umgebungsvariablen `VITE_SUPABASE_URL` und `VITE_SUPABASE_ANON_KEY` eintragen. Jede Änderung auf dem gewählten Branch wird automatisch veröffentlicht, jeder andere Branch bekommt einen Vorschau-Link.
- **Verbindung für die Entwicklung (kostenlos, ohne Installation):** Der Nutzer meldet sich einmal im Terminal an: `npx supabase login` und `npx vercel login` (öffnen jeweils den Browser). Danach kann die Entwicklung Migrationen einspielen (`npx supabase link`, `npx supabase db push`) und Deployments prüfen. Zugangsdaten landen nie im Repository.
- **Registrierung offen** (Nutzerentscheidung): Damit die kostenlose E-Mail-Grenze von Supabase nicht stört, später einen kostenlosen SMTP-Dienst eintragen, falls viele Tester gleichzeitig kommen.
- **Vor dem ersten Tester:** Datenschutzerklärung und Einwilligung in der App (Tabelle `consents` ist da), DPA mit Supabase, Hinweis „Testversion“ in der App, Konto löschen und Daten exportieren.

## Stand 14.11.2026, eingerichtet

- Supabase-Projekt `getfit` (Region eu-central-1, Frankfurt, kostenloser Tarif), Migrationen 0001 und 0002 eingespielt, E-Mail-Bestätigung an, Passwort mindestens 8 Zeichen, Weiterleitungen auf die Vercel-Adresse und localhost.
- Vercel-Projekt `getfit`, Produktionsadresse **https://getfit-rosy.vercel.app**, Umgebungsvariablen `VITE_SUPABASE_URL` und `VITE_SUPABASE_ANON_KEY` (öffentlich, Typ „config“) für Production und Preview. `.vercelignore` lädt nur die App hoch.
- Auth-Einstellungen stehen in `supabase/config.toml`; ändern, `npx supabase config diff` prüfen, dann `npx supabase config push`.
- Offen: GitHub-Verbindung in Vercel (automatische Veröffentlichung), Name/Kontakt des Verantwortlichen in der Datenschutzerklärung, Google-Anmeldung, eigener SMTP-Dienst bei vielen Testern (Supabase-Grenze: wenige E-Mails pro Stunde).
