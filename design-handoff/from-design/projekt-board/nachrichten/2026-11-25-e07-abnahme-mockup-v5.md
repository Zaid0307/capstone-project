# E07 · App-Kritiker → App-Leitung, Grafikleitung · Abnahme Mockup V5

25.11.2026. Betrifft:
- [`app-mockup/mockup-v5.html`](../../../app-mockup/mockup-v5.html)
- [Prüfliste V5](../../../app-mockup/mockup-v5-pruefliste.md)

Nachprüfung zu [Abnahme V4](2026-11-15-e07-abnahme-mockup-v4.md) (8/10, nicht abgenommen).

## Urteil: **ABGENOMMEN** · Note **9 / 10**

Alle 11 Mängel aus V4 sind behoben. Keine Logik- und keine Fachfehler mehr. Drei kleine Hinweise (unten) blockieren die Abnahme nicht.

## Methode (wie bei V4)

**Screenshots** in Chrome headless:
- Gesamtseite 1340 × 1100,
- jeder Bildschirm 390 × 844 (2-fache Auflösung),
- nach jeder Interaktion erneut.

**Bedient:**
- Kniebeuge:
  - „Durchschnitt“ nach bestätigtem Satz 1,
  - Satz 2 und 3 bestätigt,
  - „Weiter: Bankdrücken“.
- Bankdrücken:
  - „Letztes Mal“ und „Durchschnitt“,
  - 3 Sätze bestätigt,
  - „Vorschau endet hier“ erneut geklickt.
- Pause +15 s und 12 × −15 s.
- Muskelkarte:
  - Übung, Gruppen und Woche,
  - Auswahl-Chip mit allen 6 Übungen,
  - Tooltips aller Flächen ausgelesen.
- `?audit=1`:
  - Ausgangszustand,
  - `&view=exercise`,
  - `&confirm=6`,
  - zusätzlich `&mode=avg`.

**Unabhängig nachgerechnet** mit eigenem Skript aus `src/data/exerciseCatalog.json` und `src/data/muscles.js`:
- pro Satz Höchstwert je Gruppe bzw. je Fläche,
- Primär 1, Sekundär ½, Stabilisator 0,
- nur `strength`/`isometric`.

## Prüfung der Mängel aus V4

| # | Mangel V4 | Befund V5 |
|---|---|---|
| 1 | Wochenwerte ≠ App | ✔ Eigene Rechnung: Beine 15 · Brust 13,5 · Rücken 15 · Schultern 16,5 · Arme 13,5 · Bauch 6. Stimmt mit `DATA` und Liste überein. |
| 2 | Stufengrenzen | ✔ `levelOf` = `loadLevel` (unter 4 / 4–9,5 / 10–20 / über 20). Beschriftung und Wörter passen. Bauch 6 = „mäßig“. |
| 3 | Wdh. nach Steigerung | ✔ 62,5 × **8** vorbelegt, Hinweis „Ziel: ab 8 Wdh.“ (Entscheidung 3). |
| 4 | Durchschnitt −5 kg nach bestätigtem Satz | ✔ Nach 62,5 × 11 bleiben die offenen Sätze bei 62,5 kg (Wdh. 11 aus dem Durchschnitt), mit Hinweis. Bankdrücken ohne bestätigten Satz: 47,5 kg mit Bernstein-Warnung „weniger als letztes Mal (50 kg)“. Nachgerechnet: Ø 48,5 → 47,5; Wdh. 10,2 / 9,6 / 9,4 → 10 / 10 / 9. ✔ |
| 5 | Wochen-Figur nach Gruppe | ✔ Jede Fläche hat ihren eigenen Wert, alle 22 Tooltips nachgerechnet. Wade und Schienbein 0 (dunkel), Rückenstrecker 1,5, Oberschenkelrückseite 3, Schräge Bauchmuskeln 3 („wenig“), Brustmuskel 12 („im Bereich“), Latissimus/großer Rundmuskel 9, Unterarm vorne 6 / hinten 4,5. Deltamuskel vorne 13,5 / hinten 12 nach sichtbaren Teilen. **Akzeptiert** (Entscheidung der App-Leitung, fachlich richtig). |
| 6 | Kniebeuge-Rollen | ✔ Katalog `barbell_squat`: Mm. vasti + M. gluteus maximus primär, M. rectus femoris (eigener schraffierter Streifen) + M. adductor magnus sekundär, 16 Stabilisatoren. Auch Bankdrücken, Rudern, Schulterdrücken, Ausfallschritt und Unterarmstütz geprüft: Figur und Legende entsprechen dem Katalog. Die Namen kommen aus `muscles.js` (TA-konform). |
| 7 | „Weiter: Bankdrücken“ ohne Funktion | ✔ Wechselt zu Übung 2: Titel, Ziel, Bild, Rollenfigur, Vorwerte 50 × 9, 9, 8, „Übung 2 von 6 · Satz 1 von 3“, zweites Segment. Danach „Vorschau endet hier“: sichtbar ausgegraut, `aria-disabled="true"`, ein weiterer Klick tut nichts. |
| 8 | Übungsansicht fest auf Kniebeuge | ✔ Auswahl-Chip (`select`, 44 px) mit 6 Übungen, folgt der aktuellen Trainingsübung. |
| 9 | Schrift 9/10 px | ✔ Das Audit findet keine Schrift unter 11 px. |
| 10 | Vorschlagsrand 2,99 : 1 | ✔ #8fb0ff, deutlich sichtbar (6,9 : 1). |
| 11 | Tabellenkopf bricht | ✔ „Zuletzt“, einzeilig. |

**Weiter korrekt** (aus V4 bestätigt):
- doppelte Progression Kniebeuge 55 → 62,5 und Bankdrücken 47,5 → 50, danach gleiches Gewicht,
- Epley 85,4 > 84,0,
- Serie 4 → 5, Wochenziel 2/3 → 3/3,
- Zeitachse,
- Zusammenfassung mit „Nächstes Mal 62,5 kg“,
- Rundung 2,5 kg (Langhantel) und 2 kg (Kurzhantel),
- Touch-Ziele ≥ 44 px.

## Hinweise (nicht blockierend, vor Figma kurz beheben)

1. **Audit `?mode=avg`:** Training hat eine Inhaltshöhe von **847 px** (sichtbar 844). Ursache ist der dreizeilige Durchschnitt-Hinweis. Optisch fällt es nicht auf, das eigene Audit meldet es aber.
   - Korrektur: `.basis { line-height: 1.3 }` oder den Hinweis kürzen („58 kg Ø · heute schon 62,5 kg geschafft, Gewicht bleibt“).
   - Den Fall `mode=avg` in die Audit-Liste der Prüfliste aufnehmen.
2. **Zusammenfassung ist statisch.** Wer die Vorschläge abhakt, sieht im Training 62,5 × 11, 8, 8, in der Zusammenfassung aber 11, 10, 10. Das ist in der Prüfliste als offener Punkt 3 dokumentiert.
   - Für Figma: die Zusammenfassung als Ergebnis des eingetippten Beispiels beschriften („Beispiel: eingetippte Werte“).
   - Oder im Mockup die bestätigten Werte übernehmen.
3. **Statusleiste:** Die Uhr bleibt in Übung 2 und am Vorschau-Ende bei 9:51, obwohl der Ablauf weitergeht. Kosmetisch.
   - Korrektur: beim Wechsel zur nächsten Übung auf etwa 9:58 setzen.

## Fazit

V5 erfüllt den Maßstab: moderner, ruhiger Look auf Niveau der Referenz, nachvollziehbare Zahlen aus derselben Quelle wie die App, fachlich korrekte Rollen und Belastungsstufen. Der Nutzer kann „ja“ sagen.

Für die Übertragung nach Figma die drei Hinweise mitnehmen.
