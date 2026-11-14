# R09 · Grafik-Kritiker → Grafikleitung und App-Team

14.11.2026. Beide Richtungen sind prüfbare frühe Mobilstudien. Für eine Richtungsentscheidung fehlen eine klar unterscheidbare Gestaltung, der vollständige Trainingsablauf und eine vergleichbare Muskelansicht. [Raster](../../redesign/richtung-a.html) · [Trainingsjournal](../../redesign/richtung-b.html) · [E07](2026-11-14-1519-e07-app-kritiker-an-grafik-redesign.md)

## Priorisierte Befunde

1. **Hoch · Die Richtungen unterscheiden sich vor allem in der Oberfläche.** Raster nutzt kühle Töne, kompakte Kennzahlen und Großbuchstaben. Trainingsjournal nutzt warme Töne, Georgia, eine größere Seitenüberschrift und abgerundete Flächen. Beide teilen dieselbe Inhaltsreihenfolge, Anordnung der Kennzahlen, Knopf- und Satzstruktur. Der Wechsel zu einem moderneren, ernsteren Auftritt ist damit nur teilweise nachgewiesen. Für R10 denselben Inhalt in klar verschiedenen Kompositionen zeigen. Bei Raster die Trainingsaktion und Kennzahlen als kompakte Arbeitsfläche ausarbeiten. Beim Trainingsjournal nächste Einheit und letzten Eintrag als hierarchisch gegliederte Chronik anordnen. Je Richtung Schriftstufen, Datenhierarchie und Komponenten unabhängig festlegen.
2. **Hoch · Der Trainingsablauf endet nach dem Formularhinweis.** In beiden Studien führen „Training starten“ und „Training“ in dieselbe Ansicht mit drei Zeilen. „Satzwerte prüfen“ zeigt einen festen Text. Es gibt keinen gespeicherten Satzstatus, keine Vorher-Werte, keinen laufenden Timer und keinen Trainingsabschluss. Auf Heute fehlen Wochenstreifen und letztes Training. Desktop-Auswertung, Balkenskala, Ziele und Tabellenalternative fehlen. Für R10 je Richtung mindestens denselben vollständigen Ablauf abbilden und seine Tastaturbedienung prüfen.
3. **Hoch · Der Figurenbeleg reicht für E07 noch nicht.** Die Bühne ist in beiden Modi schwarz. Der Schalter blendet den langen Bizepskopf als Teilstudie zur männlichen V33-Front ein. Beide Richtungen verwenden dieselbe Figur und denselben Einzelfarb-Effekt. Die männliche und weibliche Figur vorne/hinten, vier unterscheidbare Rollen, auswählbarer Einzelkopf mit neutraler Kontur und Liste oder Lupe für kleine Regionen fehlen im Entwurf. Die bestehende geometrische Maske eignet sich als Funktionsprobe. Für R10 auf den nach der Figurenprüfung verfügbaren Arbeitsstand zurückgreifen und die Figurenfarbe und Rollen ausdrücklich pro Richtung festlegen.
4. **Mittel · Helle Feldränder sind zu schwach.** Die rechnerischen Kontrastwerte belegen gute Kontraste für Text und Hauptaktion. In beiden hellen Varianten bleibt der Rand von Eingabefeldern und Nebenknöpfen zum Hintergrund unter dem E07-Ziel von 3 : 1. Beide Dateien nutzen Browser-Standardfokus. Die tatsächlich sichtbare Fokusmarkierung, Aktivzustände und Tastaturreihenfolge sind im Browser zu prüfen. Die Studien enthalten noch keine Navigation mit Icons oder festem Aktivzustand. Das verlangt E07 für den ausgebauten Entwurf.

| Richtung und Modus | Text/Hintergrund | Hauptaktion | Feldrand/Hintergrund |
| --- | ---: | ---: | ---: |
| Raster hell | 14,25 | 6,51 | 2,39 |
| Raster dunkel | 15,62 | 8,95 | 3,50 |
| Trainingsjournal hell | 13,26 | 5,85 | 2,32 |
| Trainingsjournal dunkel | 15,19 | 10,13 | 3,55 |

Werte sind rechnerische Kontrastverhältnisse der CSS-Farben. Die Hauptaktion verwendet jeweils die Seitenfarbe für Text und den Akzent als Hintergrund. Für R10 die hellen Feldränder separat definieren und sämtliche Interaktionszustände auf der tatsächlich verwendeten Fläche nachmessen.

## Prüfgrenzen und nächste Abnahme

Quelltext und Pfade wurden lokal gelesen. Die HTML-Skripte wurden jeweils mit einem kleinen DOM-Ersatz ausgeführt. Wechsel Heute/Training, Formularmeldung, Hell/Dunkel und Schalterzustand der Muskelmaske haben dabei funktioniert. Beide relativen Medienpfade lösen auf. Es gab keinen isolierten Browserdurchlauf in dieser Prüfung. Die Vergleichsansicht bei 390 × 844 und 1280 × 800, sichtbare Überlagerung, reale Fokusfolge, reduzierte Bewegung und gerenderte Zustände bleiben daher offen. Vor einer Entscheidung dieselben Zustände beider Richtungen in beiden Modi aufnehmen, die Kontraste an den finalen Zuständen prüfen und Heute → Training → Satz speichern → Timer → Abschluss jeweils per Tastatur durchspielen.
