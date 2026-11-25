# Gemeinsames Projekt-Kanban

<!-- fortsetzung-2026-11-25 -->
**Verbindlich für alle Leitungen, Agenten und Kritiker.** Nach jedem Ticket und auch nach jeder Ticketanlage direkt weiterarbeiten. Nächstes bearbeitbares Ticket übernehmen oder ein notwendiges fehlendes Folgeticket mit Ziel und Abnahme erstellen und anschließend Aufgaben abarbeiten. Übernahme und nächste Aktion im Board festhalten, Doppelarbeit vermeiden. [Vollständige Arbeitsregel](projekt-board/weiterarbeiten.md).
<!-- /fortsetzung-2026-11-25 -->




14.11.2026. Dieses Board ist die gemeinsame Aufgaben- und Kommunikationsstelle des **Grafikteams einschließlich Grafik-Kritiker** und des **App-Teams einschließlich App-Kritiker**. Beide Teams pflegen dieselben Karten. Das Startpaket erfasst die bekannten Aufgaben. Die App-Leitung ergänzt ihren tatsächlichen Arbeitsstand unter E01.

| Ansicht | Inhalt |
|---|---|
| [Projektaufgaben](projekt-board/arbeitspakete.md) | Grafik, Redesign, App, Integration, Beta und Abnahme |
| [Übungskarten](projekt-board/uebungen.md) | 97 vereinbarte Übungen und zwei spätere Ergänzungen |
| [Icon-Karten](projekt-board/icons.md) | Alle 92 Icon-IDs |
| [Nachrichten und Entscheidungen](projekt-board/nachrichten/README.md) | Gemeinsame Rückfragen, Antworten, Übergaben und Prüfbefunde |
| [Startprompt für den App-Agenten](prompt-app-agent-kanban.md) | Einstieg für App-Leitung, deren Agenten und Kritiker |

## Arbeitsweise

1. Jede neue Aufgabe vor Beginn einmal eintragen. Karte mit stabiler ID, Team, verantwortlichem Agenten, Status, Abnahmekriterium und Beleg führen. Größere Aufgaben in kleine Karten aufteilen und vorhandene Karten verlinken.
2. Status sind **Offen**, **In Arbeit**, **Prüfung**, **Blockiert** und **Erledigt**. Bei Blockade Abhängigkeit und nächste Aktion nennen. Für Erledigt Datei oder Prüfbeleg verlinken. Abnahmen und offene Prüfgrenzen sichtbar festhalten.
3. Grafikleitung und App-Leitung vergeben und bündeln die Karten ihres Teams. Beide Kritiker prüfen unabhängig und hinterlegen Befunde unter der Karten-ID. Ein Befund mit Arbeitsbedarf erhält eine verlinkte Korrekturkarte.
4. Teamübergreifende Kommunikation läuft über die Karten und den verlinkten Nachrichtenordner. Historische Dateien bleiben als Quellen verlinkbar. Teamansichten dürfen auf dieselben Karten verweisen. Der Status gehört in die gemeinsame Karte.
5. Bei parallel laufender Arbeit ändert jeder nur seine Karten. Nachrichten in eigene Dateien schreiben. Vor einer Änderung den neuesten Stand lesen und bei Konflikten denselben Karteneintrag gemeinsam klären.

[Grafikvorgaben und Beta](../00-AKTUELL-AN-GRAFIK.md) · [B2-Bericht](app-analyse-grafik-2026-11-14.md) · [Redesign-Prototyp](redesign/index.html) · [Startnachricht](projekt-board/nachrichten/kick-01-grafik-an-app-leitung.md)

## Takt für Agentenarbeit und Prüfung

- Vor jedem Arbeitslauf prüft die Grafikleitung offene Karten und verfügbare Agenten. Sie zieht mehrere unabhängige, priorisierte Teilkarten in Arbeit, sofern Kapazität und Aufgaben da sind. Jede Teilkarte bekommt Ergebnis, Zuständigkeit, Abhängigkeiten, zu bearbeitende Dateien und ein überprüfbares Abnahmekriterium.
- Agenten bearbeiten getrennte Dateien oder klar getrennte Bereiche. Nach Abschluss melden sie Dateipfade, Prüfnachweis, konkrete Grenzen und den nächsten möglichen Schritt. Die Leitung prüft jedes Ergebnis selbst und bündelt passende Teile zur Vorlage für den unabhängigen Kritiker.
- Der Kritiker prüft an Referenz, Nutzerwunsch und Kartenkriterien. Die Leitung bewertet die Befunde, priorisiert sie und legt Korrektur- oder Folgeaufgaben an. Jede Korrektur mit relevantem Befund geht zurück in die Prüfung. Danach zieht das Team neue unabhängige Karten.
- Bei einem Nutzungslimit oder einem anderen Ausfall nennt die Karte den tatsächlichen Stand. Die Leitung übernimmt die Teilaufgabe selbst oder verteilt sie an einen verfügbaren Agenten. Aufgaben mit Abhängigkeiten bleiben sichtbar. Beide Teams führen Rückmeldungen und Übergaben über die Board-Nachrichten.
