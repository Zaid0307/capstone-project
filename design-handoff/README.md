# Design-Übergabe: GetFit!

Stand: 27.10.2026, Code-Stand: Commit `c4ed677` plus Umstellung auf Vite und React 19 (Branch `ueberarbeitung`).

Dieses Paket beschreibt die Fitness-App **GetFit!** so, dass das gesamte UI/UX-Design, die Grafiken und die Farbpalette gestaltet werden können, ohne Funktionen oder Seitenstruktur erraten zu müssen.

## Aufgabenteilung

| Wer | Zuständig für |
|---|---|
| **Designer-Agent** (Empfänger dieses Pakets) | UI/UX-Design aller Seiten und Komponenten, Farbpalette, Typografie, Icons, Illustrationen, Zustände, Responsive-Verhalten |
| **Grafik-Agent** (separat) | männliche und weibliche Fitnessfiguren, Muskelkarten, Übungsanimationen |
| **Entwicklung** (Verfasser dieses Pakets) | Umsetzung im Code, Funktionen, Datenmodell, Tests |

In diesem Paket werden **keine finalen Farben, Schriften oder visuellen Entscheidungen** festgelegt. Wo der heutige Stand Farben oder Schriften enthält, ist das nur der Ist-Zustand und darf vollständig ersetzt werden.

## Status-Kennzeichnung

Jede Funktion ist mit einem Status versehen:

| Status | Bedeutung |
|---|---|
| `implementiert` | Im Code vorhanden und getestet |
| `geplant` | Vom Nutzer ausdrücklich gewünscht, noch nicht umgesetzt |
| `vorgeschlagen` | Angeregt, aber vom Nutzer **nicht bestätigt**. Nicht gestalten, ohne Rückfrage. |

## Inhalt

| Datei | Inhalt |
|---|---|
| [handoff.json](handoff.json) | Zentrale, maschinenlesbare Fassung aller Angaben |
| [01-seiten-und-navigation.md](01-seiten-und-navigation.md) | Alle Seiten, Routen, Navigation und Funktionen |
| [02-komponenten.md](02-komponenten.md) | Alle Komponenten mit ihren Zuständen |
| [03-inhalte-und-daten.md](03-inhalte-und-daten.md) | Welche Daten und Texte wo angezeigt werden |
| [04-grafikbedarf.md](04-grafikbedarf.md) | Icons, Illustrationen, Animationen, Formate und Größen |
| [05-technik.md](05-technik.md) | Framework, Grafikformate, Geräte, Einschränkungen |
| [06-user-flows.md](06-user-flows.md) | Wege durch die App |
| [07-offene-punkte.md](07-offene-punkte.md) | Offene Fragen und Abhängigkeiten |
| [screenshots/](screenshots/) | Ist-Zustand auf einem 390 px breiten Handy |

## Die App in einem Satz

Nutzer stöbern in einer Übungsdatenbank, die nach sechs Muskelgruppen sortiert ist, und erstellen und bearbeiten eigene Trainingspläne mit Trainingstagen und Übungen. Alles ist auf Deutsch und Englisch verfügbar, und die Pläne werden lokal im Browser gespeichert.
