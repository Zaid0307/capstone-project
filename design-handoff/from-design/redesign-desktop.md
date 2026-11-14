# Desktop-Entwurf für Auswertung und Muskelkarte

Die Arbeitsfläche verbindet Trainingsauswertung und Muskelkarte. Ein Klick auf einen Muskel oder eine Muskelgruppe öffnet die zugehörigen Übungen im Detailbereich. Dieselben Einträge sind über eine Liste erreichbar. Filter und Figurenauswahl bleiben zwischen Karte und Detailansicht erhalten.

## Desktop ab 1280 px

```text
┌─────────────┬─────────────────────────────────────────────────────────────────┐
│ Navigation  │ Auswertung                                                      │
│ Übersicht   │ [Letzte 30 Tage ▾] [Trainingsplan ▾] [Übung ▾] [Zurücksetzen]     │
│ Training    ├──────────────────────────────────────┬──────────────────────────┤
│ Auswertung  │ Muskelkarte                          │ Ausgewählte Region       │
│ Übungen     │ [Frau / Mann] [Vorne / Hinten]        │ Seitlicher Trizepskopf   │
│             │ [Oberfläche / Tiefe] [□ Skelett]      │ Rechter Oberarm           │
│             │ [Muskeln / Anteile / Segmente ▾]      │ Rolle · Sekundär          │
│             │                                      │                          │
│             │            Figur                     │ Übungen im Zeitraum       │
│             │                                      │ Bankdrücken          ›    │
│             │        [−] [100 %] [+] [Großansicht] │ Schulterdrücken      ›    │
│             │                                      │                          │
│             │ [Legende]    [Muskelliste öffnen]     │ [Übungsverlauf öffnen]  │
└─────────────┴──────────────────────────────────────┴──────────────────────────┘
```

Seitennavigation etwa 200 px, Detailbereich 320–360 px, die Karte nutzt den verbleibenden Platz. Der obere Filterbereich bleibt sichtbar. Anzeige und Filter verwenden dieselben Karten- und Listenresultate. Die Detailspalte zeigt bei noch keiner Auswahl eine kompakte Liste der sichtbaren Muskelgruppen. Im Vollbild bleiben Ansichtswechsel, Ebenen und Legende erreichbar.

## Kompakte Ansichten

| Breite | Anordnung und Bedienung |
| --- | --- |
| 960–1279 px | Schmale Navigation mit zugänglichen Textnamen, Filter oberhalb der Karte. Details öffnen als einklappbarer Abschnitt unter der Karte oder als rechte Seitenleiste auf Nutzerwunsch. |
| 600–959 px | Eine Spalte mit Karte und ausklappbarer Filterzeile. Details folgen direkt unter der Karte. Karte und Liste sind sichtbare Alternativen. |
| Bis 599 px | Karte und Liste als zwei Umschaltflächen. Filter in einem Dialog mit angewandter Filterzahl und Rückkehr zum Auslöser. Detailbereich unter der aktuellen Auswahl. Kartensteuerung unterstützt Vergrößern und Verschieben per Tasten und Schaltflächen. |

Weder Figur noch Detail hängt allein von Mausbewegung oder genauer Zeigerposition ab. Beim Wechsel der Breite bleiben Auswahl, Filter und Ansicht erhalten.

## Filter und Detailverlauf

- **Zeitraum** mit Heute, 7 Tage, 30 Tage und benutzerdefiniertem Bereich. Zusätzlich Trainingsplan und Übung, sofern die zugrunde liegenden Daten diese Filter hergeben.
- **Region und Rolle** als Auswahl in der Karte oder per Suchfeld in der Liste. Vorhandene Muskel-IDs liefern die Hierarchie Muskelgruppe → Muskel → Anteil → geprüftes Segment. Die anatomische Seite bleibt eine separate Eigenschaft.
- **Übungsauswahl** färbt die hinterlegten Rollen in der Karte und sortiert zugehörige Einträge in der Detailsicht. Ohne einzelne Übung zeigt der Zeitraum belegte Übungszuordnungen mit Datum und Anzahl. Bei mehreren Übungen kann dieselbe Region mehrere Rollen haben. Die Details nennen die Rollen je Übung.
- **Detailbereich** zeigt Name, anatomische Seite, Elternmuskel, belegte Teilmasken und Übungsliste. Beim Öffnen einer Übung erscheinen ihre Rollen, Einheitendaten und ein Rückweg zur Region. Der Wechsel zwischen Muskeln löscht die aktiven Filter nicht.
- **Leerzustände** unterscheiden fehlende Trainingseinträge, fehlende Rollenzuordnung und fehlende Masken. Bei fehlenden Masken bleibt der Muskel in der Liste auswählbar. Ein Hinweis nennt die passende Ansicht oder Ebene, sobald diese verfügbar ist.

## Legende und Ebenen

| Darstellung | Verhalten |
| --- | --- |
| Primär, sekundär, stabilisierend, inaktiv | Rot, Orange, Grau und dunkle Grunddarstellung. Text in Legende und Detail plus unterscheidbare Kontur- oder Füllmuster. Die Farbe drückt die hinterlegte Übungsrolle aus und liefert keine Messung von Aktivierung oder Intensität. |
| Oberfläche und Tiefe | Umschalter mit sichtbarem Zustand. Tiefe Regionen blenden die passende neutrale Maske ein. Eine Auswahl über die Liste kann auf Wunsch zur passenden Ansicht wechseln. |
| Skelett | Zuschaltbare neutrale Ebene mit derselben Pose und Kamera. Die Figur bleibt als Orientierung erkennbar. Der Schalter erscheint als nicht verfügbar, solange zur gewählten Figur und Ansicht keine passende Ebene vorliegt. |
| Anteile und Segmente | Umschaltbar, sobald freigegebene Kindmasken vorhanden sind. Die Ausschnitte stammen aus der vereinbarten App-Hierarchie. Mit übergeordneten Auswahlflächen und Kindmasken darf dieselbe Fläche nicht doppelt gewertet werden. |
| Figuren | Blau-Schwarz für die männliche und Grün-Schwarz für die weibliche Basis. Neutrale, deckungsgleiche Masken tragen die Rollenfarben. |

## Bedienung und Abnahme

- Die Muskelliste verwendet Standard-Schaltflächen mit sichtbarem Fokus. Der Name enthält bei beidseitigen Regionen die anatomische Seite. Drücken von Eingabe oder Leertaste wählt aus. Eine Textmeldung nennt Name und Rolle.
- Kartenauswahl und Listenfokus sind synchron. Bei kleinen oder überlappenden Regionen öffnet eine Auswahl die Liste der betroffenen Muskeln. Für rein grafische SVGs bietet die Liste dieselben Aktionen. Dekorative SVG-Pfade erhalten keine zusätzlichen Tabstopps.
- Eingeklappten Bereich oder Dialog per Escape schließen. Fokus kehrt zum Auslöser zurück. Auswahl, Fokus und Rollen müssen bei hellem und dunklem Hintergrund erkennbar sein. Bewegungen der Oberfläche respektieren die Einstellung zur reduzierten Bewegung.
- Abnahmeszenario: Auf einem breiten und einem schmalen Bildschirm die letzte Trainingseinheit filtern, hinten den rechten Trizepskopf auswählen, über die Liste zur tiefen Region wechseln, die Skelett-Ebene zuschalten und dieselbe Auswahl an beiden Figuren prüfen. Den Ablauf vollständig per Tastatur wiederholen. Falls Daten oder Ebenen fehlen, muss der jeweilige Leerzustand sichtbar sein.

Die Ebenen und Segment-IDs richten sich nach den abgeglichenen Grafikvorgaben. Segment-IDs werden erst nach Rückmeldung zum App-Modell V2 verbindlich. [Grafikvorgaben](../00-AKTUELL-AN-GRAFIK.md) · [N4-Segmentvorschlag](n4-muskelbuendel-vorschlag.md)
