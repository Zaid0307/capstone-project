# Mockup V5 · Grafik- und Iconzuordnung

Read-only geprüft am 25.11.2026 gegen app-mockup/mockup-v5.html und E07-V5-Abnahme. E07 nimmt die Oberfläche mit 9/10 ab. Seine drei Hinweise zu Durchschnitt-Hinweis, statischer Zusammenfassung und Statuszeit bleiben relevant. Die Grafikquellen sind weiterhin teilweise Platzhalter.

## Referenzbilder und eigene Figurflächen

| Stelle | Tatsächliche Quelle | Übergabe |
|---|---|---|
| CSS .ref, Zeile 93; Heute .hero .ref, 94; DOM Heute, 354 | nutzer-referenz/uebersicht-referenz-2026-11-13.png, CSS-Ausschnitt mit Hue-Rotation und Maskenverlauf | Eigene männliche Frontstudie liegt in fitness-graphics/g01-figurenprobe/ruecken-v4/male_front.svg, Farbvariante male_front_color.svg. Intern als Kandidat einsetzen, Stil-/Anatomiefreigabe offen. Eigenes SVG vollständig einrahmen, Sprite-Offsets entfallen. |
| Training .media .ref / #exRef, 159 / 407; EX.refPos, 598 und 601 | Derselbe Referenz-Sprite, verschiedene Ausschnitte für barbell_squat und barbell_bench_press. Zeile 633 setzt den Ausschnitt beim Übungswechsel. | Für diese beiden exakten Übungs-IDs fehlt im internen Testpaket ein passendes fertiges Medienpaar. bodyweight_squat besitzt einen anderen Gerätebezug. Seine Clips deshalb nur auf einer als Kniebeuge ohne Gerät benannten Testübung verwenden. glute_bridge ist eine weitere eigenständige Übung. |
| #exRoles, Zeile 409, Aufruf 636; .stage[data-figure=map], 484, Rendering 585–591 | Eigene inline erzeugte Schemata aus SILHOUETTE und REGIONS; je Hälfte gespiegelt, grobe interne Region-IDs (trap, pec, quad usw.). Kein Referenz-PNG. | Im Mockup fachlich beurteilte Schemaansicht. Eine Umstellung auf echte App-Muskel-IDs ist eine Daten-/Maskenintegration. Die G01-Dateien mit 440×720 haben andere Geometrie als viewBox 17 0 66 200 und ersetzen diese Flächen nicht automatisch deckungsgleich. |
| .ring / .timer-ring, Stufenbalken, Muster pSecondary/pStabilizer, gRing | Eigene Datenvisualisierungen aus Kreisen, Füllungen und Linien | Dynamische Darstellungen weiter als Datenvisualisierungen führen. Kein Austausch durch statische Iconbilder erforderlich. |
| Betriebssystem-Statuszeile .status mit CSS-Batterie, Zeile 59 | Eigenes CSS-Mockupdetail | Gehört zur Gerätestatusdarstellung. Kein Bedarfseintrag unter den 92 App-Icons. |

Die weibliche G01-Referenzfigur und vollständige tiefe Muskelmasken sind im Testpaket weiterhin offen. Die 92 Icons schließen diese Grafik-Lücken nicht.

## Direkter Austausch von elf Inline-Definitionen

V5 enthält 21 symbol-Definitionen (Zeilen 307–330) und 41 statische use-Stellen. Dazu kommen dynamische use-Stellen in basis und setRows. Alle Symbole sind lokale Inline-Grafiken, keine eingebundenen Dateien aus dem kanonischen 92er-Satz.

Alle Pfade dieser Tabelle beziehen sich auf design-handoff. Die kopierten internen Dateien stehen zusätzlich unter fitness-graphics/internal-preview-icons-01/icons/ mit identischem Gruppen-/Dateipfad.

| V5-Symbol | Kanonische ID und Quelldatei | Einsatz |
|---|---|---|
| i-home | navigation/today · fitness-graphics/icons/navigation/today.svg | Navigation Heute |
| i-calendar | navigation/calendar · fitness-graphics/icons/navigation/calendar.svg | Navigation Kalender |
| i-plans | navigation/plans · fitness-graphics/icons/navigation/plans.svg | Navigation Pläne |
| i-analysis | navigation/analysis · fitness-graphics/icons/navigation/analysis.svg | Navigation Auswertung |
| i-exercises | navigation/exercises · fitness-graphics/icons/navigation/exercises.svg | Navigation Übungen |
| i-timer | actions/timer · fitness-graphics/icons/actions/timer.svg | Pause |
| i-play | actions/start-training · fitness-graphics/icons/actions/start-training.svg | Training starten |
| i-check | actions/check · fitness-graphics/icons/actions/check.svg | Bestätigte Sätze und erledigte Tage; auch dynamisch in setRows |
| i-back | actions/back · fitness-graphics/icons/actions/back.svg | Zurück |
| i-close | actions/close · fitness-graphics/icons/actions/close.svg | Schließen |
| i-more | actions/more · fitness-graphics/icons/actions/more.svg | Mehr-Menü, kanonisch vertikale Punkte |

Diese elf Definitionen decken 25 der 41 statischen use-Stellen ab. Der Austausch führt den kanonischen Linien-/Füllstil ein; V5 verwendet bisher überwiegend Duotone. Die bestehenden farbigen Kachelträger, Touch-Flächen und Beschriftungen tragen weiterhin ihre UI-Funktion.

## Drei Wiederverwendungen mit Beschriftung

| V5-Symbol | Vorhandener Kandidat | Grenze |
|---|---|---|
| i-dumbbell | equipment/dumbbells · fitness-graphics/icons/equipment/dumbbells.svg | Bisher Hantel mit zusätzlichem Playzeichen. Die kanonische Hantel ist als Trainingsillustration in einer beschrifteten Kachel nutzbar. Die Startaktion hat separat actions/start-training. |
| i-clock | actions/timer · fitness-graphics/icons/actions/timer.svg | Die kanonische Stoppuhr kann die beschriftete Dauer ca. 50 min begleiten. Sie ist bildlich eine Stoppuhr. |
| i-up | actions/move-up · fitness-graphics/icons/actions/move-up.svg | Als Pfeil neben dem vorhandenen Steigerungstext wiederverwendbar. Die ID bezeichnet ursprünglich Sortieren nach oben, deshalb keinen Sortierhandler an die Steigerungsanzeige koppeln. |

## Sieben Motive ohne exakten Eintrag im 92er-Bedarf

| V5-Symbol | Bedeutung | Nächster Schritt |
|---|---|---|
| i-user | Konto | Profil-/Kontomotiv als konkrete Bedarfserweiterung vorsehen. figure-male/female sind für Figurwahl bestimmt. |
| i-fire | Trainingsserie | Serien-/Flammenmotiv fehlt. V5-Motiv vorläufig lokal erhalten oder neue kanonische Bedarf-ID ergänzen. |
| i-trophy | Bestleistung | Trophäe fehlt. Eigene stabile Leistungs-ID ergänzen. |
| i-muscle | Muskelkarte als Ganzkörperübersicht | Keine genaue generische Körperkarte-ID. muscleGroups/arms wäre fachlich enger. Bedarf um Körperkartenmotiv ergänzen. |
| i-layers | Umfang 6 Übungen / 16 Sätze | Schichten-/Umfangsmotiv fehlt. Textinformation funktioniert bereits eigenständig. |
| i-avg | Durchschnittshinweis, dynamisch basis() | Eigener Durchschnitts-/Verlaufspfeil fehlt. navigation/analysis bezeichnet einen Navigationsbereich und wäre nur mit bewusster Wiederverwendung geeignet. |
| i-sets | Zahl/Block der Sätze | Satzstapelmotiv fehlt. actions/add/remove-set sind Aktionen und ersetzen keine Mengenanzeige. |

Eine vollständige Ersetzung sämtlicher V5-Motive allein mit den 92 vorhandenen IDs würde für diese sieben Motive Bedeutungen verändern. Für die App-Leitung ist eine Bedarferweiterung um konkrete Motive oder das Weglassen rein dekorativer Symbole zu entscheiden.

## Einbindung und nächster Schritt

Die SVGs verwenden currentColor. Bei Inline-Übernahme oder eigenem Sprite Root-Attribute wie fill=none, stroke=currentColor, stroke-width und runde Linienenden übernehmen. Ein externes img erbt die aktuelle CSS-Textfarbe nicht automatisch. Die Vorschautafel behandelt Dunkel über Filter; das ist kein automatischer Nachweis für die produktive App-Einbindung.

Als nächsten Auftrag den elf direkten Definitionen im freigegebenen App-Umfang die kanonischen Dateien zuweisen, danach Fokus-/Aktiv-/Disabledzustände und 20/24 px im echten Layout prüfen. Verantwortlich App-Leitung, Abnahme mit Grafik-Kritiker. Die Grafikleitung entscheidet mit dem App-Team über die sieben fehlenden Motive. Dieser Bericht ändert weder Mockup noch App-Quellen.
