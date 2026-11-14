# GetFit! mobil

Wireframes für 390 × 844 CSS-Pixel. Eine Hauptaktion je Ansicht, durchgehender Seitenfluss und feste Navigation auf den fünf Hauptseiten. Einstellungen sind eine Aktion in Heute. Training, Editor und Vollbilddetails haben einen eigenen Kopf mit Zurück- bzw. Schließen-Aktion. [App-Analyse B2](app-analyse-grafik-2026-11-14.md)

## Heute

```text
Heute                          Einstellungen
Mo, 16. November

Nächstes Training
Ganzkörper A · 6 Übungen
[ Training starten ]

Diese Woche
Mo  Di  Mi  Do  Fr  Sa  So
2 Trainings                      Zum Kalender

Letztes Training
Ganzkörper B                  Verlauf öffnen

Heute    Kalender    Pläne    Auswert.    Übungen
```

- Bei aktiver Sitzung steht „Training fortsetzen“ an derselben Stelle. Der Wiedereinstieg öffnet den zuvor bearbeiteten Satz. Bei Ruhetag führt „Pläne ansehen“ zur Planliste. Bei fehlendem Plan führt „Plan auswählen“ zu Vorlagen und eigenen Plänen.
- Der Wochenstreifen öffnet den Kalender am gewählten Tag. Erledigt, geplant und Ruhetag haben unterscheidbare Zeichen und Text für Vorlesesoftware. Einstellungen bieten Figurwahl mit Vorschau sowie Hell/Dunkel.

## Training

```text
Zurück            Ganzkörper A           Menü
Übung 2 von 6

Langhantel-Bankdrücken                 Info
Satz         Vorher          kg      Wdh.
  1          60 × 10        [60]     [10]  ✓
  2          60 ×  9        [60]     [ 9] [ ]
[ + Satz ]                     Überspringen

Pause 01:25                 Pause beenden
[ Satz 2 speichern ]
```

- Eingabefelder bleiben am Satz und tragen sichtbare Einheiten. Satz speichern wechselt zum nächsten offenen Satz. Letzte Aktion kann rückgängig gemacht werden. Browser-Zurück legt die Sitzung ab. „Training beenden“ öffnet eine Zusammenfassung und wahrt eingetragene Sätze.
- Übungsinfo öffnet das unten beschriebene Detail. Schließen erhält Eingaben und Pause. Beim Tippen auf Zahlen öffnet sich die numerische Tastatur. Die aktive Zeile und ihre Speicheraktion bleiben erreichbar. Bei 320 px oder großer Schrift bricht die Satzzeile auf zwei Zeilen um; kein horizontales Scrollen.
- Tippen, Tab und Eingabetaste reichen für den gesamten Ablauf. Ein laufender Timer ist sekundär zur Satzaktion, pausiert per eigener Aktion und verändert den Fokus nicht.

## Pläne und Editor

```text
Pläne                             + Neuer Plan

[ Eigene Pläne ]   [ Vorlagen ]
Ganzkörper · 3 Tage                          …
Mo · Mi · Fr
[ Heute trainieren ]             Plan öffnen

Heute    Kalender    Pläne    Auswert.    Übungen
```

```text
Zurück          Ganzkörper bearbeiten      …
[ Mo · A ] [ Mi · B ] [ Fr · C ]  [+ Tag]

Tag A                                        …
Bankdrücken                        3 × 8–12  >
Rudern                              3 × 10   >
[ + Übung hinzufügen ]

Plan-Monitor · Tag A
[ Tag ] [ Ganzer Plan ]       Muskelkarte öffnen

[ Plan speichern ]
```

- Vorlagen haben eine Vorschau mit Tagen, Übungen und vorhandenen Hinweisen. „Als eigenen Plan übernehmen“ erstellt den Entwurf im Editor. Die Tageswahl zeigt genau einen Tag und erhält alle anderen Eingaben. Tage und Übungen lassen sich über Menüaktionen verschieben; Drag-and-drop ist ergänzend.
- „Übung hinzufügen“ öffnet die Suche. Auswahl übernimmt Übung und Varianten-ID in den aktiven Tag. Ein getrenntes Info-Ziel zeigt Vorschau und Hinweise. Beim Zurückkehren bleiben Tag, Entwurf und Suche erhalten.
- Der Plan-Monitor zeigt im Editor zuerst die Zusammenfassung für Tag oder ganzen Plan. Antippen öffnet die gemeinsame Muskelkarte mit aktuellem Umfang. Schließen führt zur vorherigen Scrollposition. Fehler führen zur betroffenen Zeile. Bei ungespeicherten Änderungen führt Zurück zu „Weiter bearbeiten“ und „Entwurf verwerfen“.

## Übungen und Hinweise

```text
Übungen
[ Übung suchen                             ]
[ Muskelgruppe ] [ Gerät ] [ Filter öffnen ]

Brust                      Rücken
Bauch                      Schultern
Arme                       Beine

Bankdrücken                                 >
Langhantel · Brust

Heute    Kalender    Pläne    Auswert.    Übungen
```

```text
Zurück                 Bankdrücken
[ Langhantel ▾ ]       [ Figur wählen ▾ ]
┌───────────────────────────────────┐
│ Standbild / Loop · Gerät im Bild  │
│               [ Abspielen ]       │
└───────────────────────────────────┘
● Primär  ● Sekundär  ● Stabilisator
[ Ausführung ] [ Beteiligte Muskeln ]
✓ Ausgangsposition einnehmen …
[ Zum Plan hinzufügen ]  ← im Editor-Kontext
```

- Such- und Filterzustand bleibt beim Wechsel ins Detail erhalten. Das Filterblatt zeigt gewählte Werte und „Filter zurücksetzen“. Ohne Treffer führt „Filter anpassen“ zurück zur Auswahl. Gruppen und Filter funktionieren mit Text und Icon.
- Variantenwechsel aktualisiert Bild, Clip, Hinweise und Rollen in einem Schritt. Die Figurwahl gilt für die Vorschau und wird als Präferenz gespeichert. Die Infoansicht im laufenden Training hat die Aktion „Zum Training“ anstelle der Planaktion.
- B2 misst 300 × 225 px für die Vorschau. Der Entwurf reserviert quadratisch bis 320 × 320 px innerhalb der verfügbaren Breite und nutzt `contain`. Boden, Hände und Gerät müssen sichtbar bleiben. Das Standbild hält die Fläche bis zum Abspielen. Fehlende Medien zeigen einen kompakten Hinweis mit den vorhandenen Ausführungsschritten. Rollen stehen als benannte Farbfelder und in der Liste. [B2-Vorschau](app-analyse-screens/mobil-uebungsvorschau.png)

## Muskelkarte

```text
Schließen         Muskelkarte
Ganzer Plan · gültiger Zeitraum

[ Vorn ] [ Hinten ]            [ Mann ▾ ]
[ Oberfläche ▾ ]              [ Skelett ]

          +-------------------+
          |                   |
          |       Figur       |
          |    216 × 324      |
          |                   |
          +-------------------+

[ Muskeln suchen ]
Trizeps, langer Kopf            6 Sätze   >
[ Detailausschnitt öffnen ]
```

- Bei B2 füllten sich im Editor und in der Auswertung je 311 × 160 px. Eine 2:3-Figur ist darin nur 107 px breit. Im Detail ist eine Figur bis 216 × 324 px sichtbar. Bei schmalem Fenster skaliert sie gleichmäßig. Eine Ansicht ist gleichzeitig aktiv. Figur, Masken und Skelett benutzen denselben 2:3-Bezugsrahmen und dieselbe Kameraregistrierung.
- Tippen auf eine Region wählt denselben benannten Eintrag wie die Liste. Bei Überlappungen zeigt ein Blatt die betroffenen Muskel-IDs als beschriftete Treffer. Tap auf einen Listeneintrag öffnet eine vergrößerte Region, in der exakt dieses Segment markiert ist. Die Liste ist auch ohne Bild bedienbar. Sie erhält Namen und Auswahl beim Wechsel zwischen vorn und hinten. Wenn die Region in der aktuellen Ansicht verdeckt ist, zeigt die Liste die Aktion „Passende Ansicht öffnen“.
- Oberfläche, tiefe Muskeln und Skelett sind einzeln bedienbar. Ansichtswechsel setzt die gewählte Figur und den Datenumfang fort. Medien mit fehlender Registrierung werden im Detail durch die zugehörige Liste und eine Textangabe ersetzt. Im Editor und in der Auswertung lautet die Kennzahl „Sätze“ beziehungsweise die dort ausgewählte Messgröße. Die Rollenfarben aus einer konkreten Übung sind nur in deren Vorschau aktiv. [B2-Muskelmonitor](app-analyse-screens/mobil-muskelmonitor-plan.png)

## Auswertung

```text
Auswertung                       Filter
[ 7 Tage ] [ 4 Wochen ] [ Zeitraum ]

Trainingsumfang
12 Sätze                      Vergleich
[ Diagramm ] [ Tabelle ]
▁ ▄ █ ▃
Mo Mi Fr So

Muskelabdeckung             Muskelkarte öffnen
Brust  6 Sätze            Rücken  6 Sätze

Übungsentwicklung
Bankdrücken                               >

Heute    Kalender    Pläne    Auswert.    Übungen
```

- Zeitraum gilt für Karten, Muskelkarte und Liste. Bei Wechsel im Übungsdetail erhält Zurück den Zeitraum und die vorherige Position. Diagramm und Tabelle zeigen dieselben Daten. Die Tabelle hat kurze Spalten mit Einheiten und klappt bei Platzmangel auf eine beschriftete Zeile je Termin um.
- Die Muskelkarte öffnet mit dem aktuell gewählten Zeitraum. Leere Werte werden als „Keine Einträge im Zeitraum“ gezeigt, mit Aktion zum Ändern des Zeitraums.

## Abnahme im mobilen Prototyp

| Test | Erwartung |
| --- | --- |
| 390 × 844, 320 px, Textvergrößerung 200 % | Kein horizontaler Seitenlauf. Überschriften und lange Übungsnamen umbrechen. Navigation und primäre Aktionen überdecken keine fokussierten Elemente. |
| Fünf Navigationsziele, Safe Area | Sichtbare Kurztexte, aktiver Bereich mit Markierung und `aria-current`. Je Ziel mindestens 44 × 44 px. Inhalt behält unter letzter Zeile Abstand zur Leiste. |
| Dialog, Zurück und Tastatur | Fokus geht bei Öffnen in den Dialog und kehrt zum Auslöser zurück. Übersprungene Inhalte sind nach Schließen wieder bedienbar. Tastatur verdeckt weder aktives Feld noch Speicheraktion. |
| Training aus Heute | Plan starten, Satz ändern und speichern, Info öffnen, zurückkehren, Zeit und Eingaben behalten. Beim Wiederöffnen aus Heute steuert der CTA dieselbe Sitzung an. |
| Editor und Auswahl | Tagwechsel, Suchfilter, Übungsvorschau und Rückkehr verändern den restlichen Entwurf nicht. Speichern zeigt Ergebnis und führt zu einem nachvollziehbaren Zustand. |
| Kleine Muskelregionen | Brachialis, Teres minor und Trizepsköpfe lassen sich in beiden Figuren per Liste eindeutig anwählen. Detail und Liste melden identischen Muskel. Masken und Skelett liegen auf dem gemeinsamen Rahmen. |
| Medien und Dunkelmodus | Bei Figur- und Variantenwechsel passen Gerät, Figur und Rollenlegende zusammen. Hell- und Dunkelansicht zeigen erkennbare Innenkonturen. Rote, orange und graue Rollen sind auch per Text unterscheidbar. |
| Reduzierte Bewegung und leere Daten | Standbilder und textliche Anleitung bleiben zugänglich. Clip startet erst nach Aktion. Leere Pläne, Suchergebnisse und Auswertungen bieten je einen passenden nächsten Schritt. |
