# R09L · Nachprüfung von Tastaturfokus und Muskelrollen

Die beiden Fehler aus R09I sind in den geprüften Chrome-Zuständen behoben. Getestet wurden Raster und Trainingsjournal bei 390 × 844 CSS-Pixeln sowie beide Desktop-Richtungen bei 1280 × 800, jeweils in Hell und Dunkel. [Raster](../../redesign/richtung-a.html) · [Trainingsjournal](../../redesign/richtung-b.html) · [Desktop-Auswertung](../../redesign/r09-desktop.html) · [R09I](r09i-grafik-kritiker-browserpruefung.md)

| Prüfschritt | Ergebnis |
| --- | --- |
| Training starten | Enter auf der fokussierten Startaktion zeigt die Trainingsseite und setzt den Fokus auf die Überschrift „Training“. |
| Tab-Reihenfolge am Anfang | Bei Raster folgen Gewicht und Wiederholungen für Satz 1. Beim Journal folgen zuerst die Technikhinweise und dann das Gewicht für Satz 1. |
| Satz speichern | In allen vier Mobilzuständen wurden drei Sätze mit 12,5 kg und 10 Wiederholungen gespeichert. Die Eingabe wurde per Enter ausgelöst. Der Fokus sprang nach Satz 1 und 2 jeweils zum Gewichtsfeld des nächsten Satzes und nach Satz 3 zu „Training abschließen“. |
| Abschluss und Rückkehr | Enter schließt ab und meldet drei gespeicherte Sätze. Enter auf „Heute“ öffnet die Startansicht und setzt den Fokus auf deren Überschrift. |
| Rollen bei Auswahl | Auf der Rückansicht mit aktivierter Tiefenebene wurden sechs Pfade in der männlichen Figurenstudie geprüft. Enter auf der ersten Region markiert den langen Trizepskopf links. Die gesetzten Rollen und berechneten Füllfarben bleiben bei allen Pfaden erhalten. Die übrigen Pfade behalten Deckkraft 0,8. Der ausgewählte Pfad erhält eine eigene Kontur und Deckkraft 1. Der Fokus bleibt beim Listeneintrag. |

Die Tests verwendeten Chrome Headless und echte Tastaturereignisse für Enter und Tab. Vor ausgewählten Prüfschritten wurden die Startpunkte per Browser gesetzt, zwischen Gewicht und Wiederholungen wurde mit Tab gewechselt. Richtung, Theme, Rückansicht und Tiefenebene wurden programmgesteuert geschaltet. Die lückenlose Tab-Folge durch alle Steuerungen, Screenreader-Ausgabe, Touch, visuelle Kontrastabnahme und ein gleichzeitiges Vier-Rollen-Beispiel bleiben in diesem Durchlauf ungeprüft. Der Desktop-Nachweis umfasst Primär, Sekundär und Stabilisator anhand desselben Beispielausschnitts.

Für das Board kann R09L als Nachweis der beiden Korrekturen geschlossen werden. Die visuelle Richtungsentscheidung bleibt separat.
