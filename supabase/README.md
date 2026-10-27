# Backend (Supabase) – vorbereitet, noch nicht eingerichtet

Stand: 27.10.2026. Die Wahl des Backends ist noch offen (Vorschlag: Supabase, siehe `docs/gesamtkonzept.md`). Alles hier ist vorbereitet, aber **noch nicht gegen eine echte Datenbank getestet**.

## Was vorbereitet ist

| Datei | Inhalt |
|---|---|
| `migrations/0001_accounts_and_plans.sql` | Tabellen für Profil, Einwilligungen und Pläne, Zugriffsregeln (jeder Nutzer sieht nur seine eigenen Daten), automatisches Anlegen des Profils, Löschen des eigenen Kontos |
| `src/storage/remotePlanStore.js` | Plan-Speicher für das Backend, mit derselben Schnittstelle wie der lokale Speicher. Dazu `copyMissingPlans`, um lokale Pläne beim ersten Anmelden ins Konto zu übernehmen. |
| `src/storage/remotePlanStore.test.js` | Tests gegen ein nachgebautes Supabase, inklusive Zugriffsregeln |

Tabellen für Tracking, Dashboards und Ziele fehlen bewusst. Ihre Inhalte sind noch nicht entschieden (offene Frage O12).

## Einrichtung, sobald Supabase beschlossen ist

1. **Konto anlegen** auf supabase.com. Der kostenlose Tarif reicht für die Entwicklung, das Projekt pausiert aber nach 7 Tagen ohne Nutzung.
2. **Neues Projekt** mit der Region **Central EU (Frankfurt)**. Das Datenbank-Passwort sicher aufbewahren.
3. Im **SQL-Editor** den Inhalt von `migrations/0001_accounts_and_plans.sql` ausführen.
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
